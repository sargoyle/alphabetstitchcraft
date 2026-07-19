"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  deleteRemoteFont,
  loadRemoteFontBackups,
  loadRemoteFontResult,
  restoreRemoteFontBackup,
  saveRemoteFont,
  type RemoteFontBackup
} from "./fontPersistence";
import { defaultFonts } from "./fonts";
import type { StitchFont } from "./fontTypes";
import {
  loadCustomFonts,
  loadDeletedFontIds,
  resetFontEdits,
  restoreFont
} from "./localStorageUtils";
import { isSupabaseConfigured } from "./supabaseClient";

type PersistenceState = {
  mode: "loading" | "remote" | "unconfigured" | "error";
  message: string;
  canWrite: boolean;
  warnings: string[];
  lastError?: string;
};

export function useFonts() {
  const [savedFonts, setSavedFonts] = useState<StitchFont[]>([]);
  const [deletedFontIds, setDeletedFontIds] = useState<string[]>([]);
  const [fontBackups, setFontBackups] = useState<Record<string, RemoteFontBackup[]>>({});
  const lastSaveErrorRef = useRef<string | null>(null);
  const [persistence, setPersistence] = useState<PersistenceState>({
    mode: "loading",
    message: "Checking font storage...",
    canWrite: false,
    warnings: []
  });

  const fonts = useMemo(() => {
    if (persistence.mode === "remote") {
      return savedFonts.filter((font) => !deletedFontIds.includes(font.id));
    }

    const savedById = new Map(savedFonts.map((font) => [font.id, font]));
    const mergedDefaultFonts = defaultFonts
      .filter((font) => !deletedFontIds.includes(font.id))
      .map((font) => savedById.get(font.id) ?? font);
    const addedFonts = savedFonts.filter((font) => !defaultFonts.some((defaultFont) => defaultFont.id === font.id));
    return [...mergedDefaultFonts, ...addedFonts.filter((font) => !deletedFontIds.includes(font.id))];
  }, [savedFonts, deletedFontIds, persistence.mode]);

  const deletedFonts = useMemo(
    () => defaultFonts.filter((font) => deletedFontIds.includes(font.id)),
    [deletedFontIds]
  );

  function isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  function prepareDatabaseFont(font: StitchFont): StitchFont {
    if (isUuid(font.id)) return font;
    return {
      ...font,
      updatedAt: new Date().toISOString()
    };
  }

  const refreshBackups = useCallback(async (fontsToLoad: StitchFont[]) => {
    const remoteFonts = fontsToLoad.filter((font) => isUuid(font.id));
    const entries = await Promise.all(
      remoteFonts.map(async (font) => {
        try {
          return [font.id, await loadRemoteFontBackups(font.id)] as const;
        } catch {
          return [font.id, []] as const;
        }
      })
    );
    setFontBackups(Object.fromEntries(entries));
  }, []);

  const refresh = useCallback(async () => {
    const localFonts = loadCustomFonts();
    const localDeletedFontIds = loadDeletedFontIds();
    setDeletedFontIds(localDeletedFontIds);

    if (!isSupabaseConfigured()) {
      setPersistence({
        mode: "unconfigured",
        message: "Database sync is not configured. Add Supabase environment values before creating or editing fonts.",
        canWrite: false,
        warnings: [],
        lastError: undefined
      });
      return;
    }

    try {
      if (localFonts.length) {
        await Promise.allSettled(localFonts.map((font) => saveRemoteFont(font)));
      }

      const remoteResult = await loadRemoteFontResult();
      const remoteFonts = remoteResult?.fonts ?? [];
      setSavedFonts(remoteFonts);
      setDeletedFontIds(localDeletedFontIds);
      await refreshBackups(remoteFonts);
      const warnings =
        remoteResult?.invalidFonts.map(
          (font) => `${font.name || font.id} could not be loaded: ${font.errors.join(" ")}`
        ) ?? [];
      setPersistence({
        mode: "remote",
        message: warnings.length
          ? `Public fonts are saved to the database. ${warnings.length} invalid font record${warnings.length === 1 ? "" : "s"} need attention.`
          : "Public fonts are saved to the database. Anyone using the site can create, edit, rename or delete them.",
        canWrite: true,
        warnings,
        lastError: undefined
      });
    } catch (error) {
      setFontBackups({});
      setPersistence({
        mode: "error",
        message: error instanceof Error ? error.message : "Database sync failed. Font changes are paused until it reconnects.",
        canWrite: false,
        warnings: [],
        lastError: error instanceof Error ? error.message : "Database sync failed. Font changes are paused until it reconnects."
      });
    }
  }, [refreshBackups]);

  useEffect(() => {
    refresh();

    return undefined;
  }, [refresh]);

  async function saveEditableFont(font: StitchFont): Promise<boolean> {
    lastSaveErrorRef.current = null;
    const nextFont = prepareDatabaseFont({ ...font, updatedAt: new Date().toISOString() });

    try {
      const savedRemotely = await saveRemoteFont(nextFont);
      if (!savedRemotely) {
        const message = "Add Supabase environment values before saving fonts to the database.";
        lastSaveErrorRef.current = message;
        setPersistence((current) => ({ ...current, message, canWrite: false, lastError: message }));
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Database save failed. Font changes were not saved.";
      lastSaveErrorRef.current = message;
      setPersistence((current) => ({ ...current, mode: "error", message, canWrite: false, lastError: message }));
      return false;
    }

    lastSaveErrorRef.current = null;
    setSavedFonts((current) => {
      const nextFonts = current.filter((savedFont) => savedFont.id !== nextFont.id);
      return [...nextFonts, nextFont];
    });
    await refresh();
    setPersistence((current) => ({
      ...current,
      mode: "remote",
      message: "Font changes saved successfully.",
      canWrite: true,
      lastError: undefined
    }));
    return true;
  }

  async function deleteEditableFont(fontId: string): Promise<boolean> {
    try {
      const deletedRemotely = await deleteRemoteFont(fontId);
      if (!deletedRemotely) {
        const message = "Only database-saved fonts can be deleted here.";
        setPersistence((current) => ({ ...current, message }));
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Database delete failed. Font was not deleted.";
      setPersistence((current) => ({ ...current, mode: "error", message, canWrite: false }));
      return false;
    }

    await refresh();
    setPersistence((current) => ({
      ...current,
      mode: "remote",
      message: "Font deleted successfully.",
      canWrite: true
    }));
    return true;
  }

  async function restoreFontBackup(backupId: string): Promise<boolean> {
    try {
      const restored = await restoreRemoteFontBackup(backupId);
      if (!restored) {
        const message = "Database restore failed. The backup was not restored.";
        setPersistence((current) => ({ ...current, mode: "error", message, canWrite: false }));
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Database restore failed. The backup was not restored.";
      setPersistence((current) => ({ ...current, mode: "error", message, canWrite: false }));
      return false;
    }

    await refresh();
    setPersistence((current) => ({
      ...current,
      mode: "remote",
      message: "Font backup restored successfully.",
      canWrite: true
    }));
    return true;
  }

  async function restoreEditableFont(fontId: string): Promise<boolean> {
    restoreFont(fontId);
    await refresh();
    setPersistence((current) => ({ ...current, message: "Font restored successfully." }));
    return true;
  }

  async function resetEditableFont(fontId: string): Promise<boolean> {
    resetFontEdits(fontId);
    await refresh();
    setPersistence((current) => ({ ...current, message: "Font reset successfully." }));
    return true;
  }

  return {
    fonts,
    customFonts: savedFonts.filter((font) => isUuid(font.id)),
    savedFonts,
    deletedFonts,
    persistence,
    fontBackups,
    refresh,
    saveFont: saveEditableFont,
    getLastSaveError: () => lastSaveErrorRef.current,
    deleteFont: deleteEditableFont,
    restoreFontBackup,
    restoreFont: restoreEditableFont,
    resetFontEdits: resetEditableFont
  };
}

