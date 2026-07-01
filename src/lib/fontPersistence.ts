"use client";

import type { StitchCharacter, StitchFont } from "./fontTypes";
import { validateFont } from "./gridUtils";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

export type InvalidRemoteFont = {
  id: string;
  name: string;
  errors: string[];
};

export type RemoteFontLoadResult = {
  fonts: StitchFont[];
  invalidFonts: InvalidRemoteFont[];
};

export type RemoteFontBackup = {
  id: string;
  fontId: string;
  action: "update" | "delete" | "restore";
  fontName: string;
  font: StitchFont;
  createdAt: string;
};

type RemoteFontRow = {
  id: string;
  owner_id: string | null;
  base_default_font_id: string | null;
  base_custom_font_id: string | null;
  name: string;
  description: string;
  category: StitchFont["category"];
  default_height: number;
  recommended_use: string;
  licence: string;
  created_at: string;
  updated_at: string;
};

type RemoteCharacterRow = {
  font_id: string;
  character_key: string;
  width: number;
  height: number;
  grid: unknown;
};

type RemoteFontBackupRow = {
  id: string;
  font_id: string;
  action: RemoteFontBackup["action"];
  font_name: string;
  font_snapshot: unknown;
  created_at: string;
};

function isStringGrid(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((row) => typeof row === "string");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

function validateSharedFont(font: StitchFont) {
  const result = validateFont(font);
  const errors = [...result.errors];
  const trimmedName = font.name.trim();

  if (!trimmedName) errors.push("Font name is required.");

  for (const key of Object.keys(font.characters)) {
    if (Array.from(key).length !== 1) {
      errors.push(`Character key "${key}" must be a single character.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function toStitchFont(font: RemoteFontRow, characters: RemoteCharacterRow[]): { font: StitchFont | null; errors: string[] } {
  const mappedCharacters = characters.reduce<Record<string, StitchCharacter>>((acc, character) => {
    if (!isStringGrid(character.grid)) {
      acc[character.character_key] = {
        width: character.width,
        height: character.height,
        grid: []
      };
      return acc;
    }
    acc[character.character_key] = {
      width: character.width,
      height: character.height,
      grid: character.grid
    };
    return acc;
  }, {});

  const stitchFont: StitchFont = {
    id: font.id,
    name: font.name,
    description: font.description,
    category: font.category,
    defaultHeight: font.default_height,
    recommendedUse: font.recommended_use,
    licence: font.licence,
    isCustom: true,
    ownerId: font.owner_id ?? undefined,
    canEdit: true,
    baseFontId: font.base_default_font_id ?? font.base_custom_font_id ?? undefined,
    createdAt: font.created_at,
    updatedAt: font.updated_at,
    characters: mappedCharacters
  };

  const validation = validateSharedFont(stitchFont);
  return validation.valid ? { font: stitchFont, errors: [] } : { font: null, errors: validation.errors };
}

async function loadRemoteFontSnapshot(fontId: string): Promise<StitchFont | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: fontRow, error: fontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .eq("id", fontId)
    .maybeSingle();

  if (fontError) throw fontError;
  if (!fontRow) return null;

  const { data: characterRows, error: characterError } = await supabase
    .from("custom_font_characters")
    .select("font_id, character_key, width, height, grid")
    .eq("font_id", fontId);

  if (characterError) throw characterError;

  const result = toStitchFont(fontRow as unknown as RemoteFontRow, (characterRows ?? []) as RemoteCharacterRow[]);
  if (result.errors.length) {
    throw new Error(`Cannot back up invalid font "${(fontRow as RemoteFontRow).name}": ${result.errors.join(" ")}`);
  }

  return result.font;
}

async function createRemoteFontBackup(fontId: string, action: RemoteFontBackup["action"]) {
  if (!isSupabaseConfigured() || !isUuid(fontId)) return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  const font = await loadRemoteFontSnapshot(fontId);
  if (!font) return;

  const backupsTable = supabase.from("custom_font_backups") as any;
  const { error } = await backupsTable.insert({
    font_id: font.id,
    action,
    font_name: font.name,
    font_snapshot: font
  });

  if (error) throw error;
}

async function ensureBaseDefaultFontExists(baseDefaultFontId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("default_fonts")
    .select("id")
    .eq("id", baseDefaultFontId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error(
      `Default font "${baseDefaultFontId}" is missing from the database. Restore the default_fonts seed migration before saving custom font changes.`
    );
  }
}

export async function getCurrentRemoteUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await withTimeout(
    supabase.auth.getSession(),
    "Could not reach Supabase. Check the project URL and refresh the page."
  );
  if (error) return null;
  return data.session?.user ?? null;
}

export async function loadRemoteFontResult(): Promise<RemoteFontLoadResult | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: fontRows, error: fontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (fontError) throw fontError;
  if (!fontRows?.length) return { fonts: [], invalidFonts: [] };

  const remoteFontRows = fontRows as unknown as RemoteFontRow[];
  const ids = remoteFontRows.map((font) => font.id);
  const { data: characterRows, error: characterError } = await supabase
    .from("custom_font_characters")
    .select("font_id, character_key, width, height, grid")
    .in("font_id", ids);

  if (characterError) throw characterError;

  const invalidFonts: InvalidRemoteFont[] = [];
  const fonts = remoteFontRows
    .map((font) => {
      const result = toStitchFont(
        font,
        ((characterRows ?? []) as RemoteCharacterRow[]).filter((character) => character.font_id === font.id)
      );

      if (result.errors.length) {
        invalidFonts.push({
          id: font.id,
          name: font.name,
          errors: result.errors
        });
      }

      return result.font;
    })
    .filter((font): font is StitchFont => Boolean(font));

  return { fonts, invalidFonts };
}

export async function loadRemoteFonts(): Promise<StitchFont[] | null> {
  const result = await loadRemoteFontResult();
  return result?.fonts ?? null;
}

export async function loadRemoteFontBackups(fontId: string): Promise<RemoteFontBackup[]> {
  if (!isSupabaseConfigured() || !isUuid(fontId)) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const backupsTable = supabase.from("custom_font_backups") as any;
  const { data, error } = await backupsTable
    .select("id, font_id, action, font_name, font_snapshot, created_at")
    .eq("font_id", fontId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  return ((data ?? []) as RemoteFontBackupRow[])
    .map((backup) => {
      const font = backup.font_snapshot as StitchFont;
      const validation = validateSharedFont(font);
      if (!validation.valid) return null;
      return {
        id: backup.id,
        fontId: backup.font_id,
        action: backup.action,
        fontName: backup.font_name,
        font,
        createdAt: backup.created_at
      };
    })
    .filter((backup): backup is RemoteFontBackup => Boolean(backup));
}

export async function restoreRemoteFontBackup(backupId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const backupsTable = supabase.from("custom_font_backups") as any;
  const { data, error } = await backupsTable
    .select("font_snapshot")
    .eq("id", backupId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return false;

  const font = (data as { font_snapshot: unknown }).font_snapshot as StitchFont;
  const validation = validateSharedFont(font);
  if (!validation.valid) {
    throw new Error(`Backup is invalid: ${validation.errors.join(" ")}`);
  }

  return saveRemoteFont(font, { backupAction: "restore" });
}

export async function saveRemoteFont(
  font: StitchFont,
  options: { backupAction?: RemoteFontBackup["action"] | null } = {}
): Promise<boolean> {
  if (!isSupabaseConfigured() || !isUuid(font.id)) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const validation = validateSharedFont(font);
  if (!validation.valid) {
    throw new Error(`Font is invalid: ${validation.errors.join(" ")}`);
  }

  const trimmedName = font.name.trim();
  const { data: duplicateFonts, error: duplicateError } = await supabase
    .from("custom_fonts")
    .select("id")
    .ilike("name", trimmedName)
    .neq("id", font.id)
    .limit(1);

  if (duplicateError) throw duplicateError;
  if (duplicateFonts?.length) {
    throw new Error(`A shared font named "${trimmedName}" already exists.`);
  }

  const baseDefaultFontId = font.baseFontId && !isUuid(font.baseFontId) ? font.baseFontId : null;
  const baseCustomFontId = font.baseFontId && isUuid(font.baseFontId) ? font.baseFontId : null;

  if (baseDefaultFontId) {
    await ensureBaseDefaultFontExists(baseDefaultFontId);
  }

  const customFontsTable = supabase.from("custom_fonts") as any;
  const customFontCharactersTable = supabase.from("custom_font_characters") as any;

  if (options.backupAction !== null) {
    await createRemoteFontBackup(font.id, options.backupAction ?? "update");
  }

  const { error: fontError } = await customFontsTable.upsert({
    id: font.id,
    owner_id: null,
    base_default_font_id: baseDefaultFontId,
    base_custom_font_id: baseCustomFontId,
    name: trimmedName,
    description: font.description,
    category: font.category,
    default_height: font.defaultHeight,
    recommended_use: font.recommendedUse,
    licence: font.licence,
    updated_at: new Date().toISOString()
  });

  if (fontError) throw fontError;

  const { error: deleteError } = await customFontCharactersTable
    .delete()
    .eq("font_id", font.id);

  if (deleteError) throw deleteError;

  const characters = Object.entries(font.characters).map(([key, character]) => ({
    font_id: font.id,
    owner_id: null,
    character_key: key,
    width: character.width,
    height: character.height,
    grid: character.grid
  }));

  if (!characters.length) return true;

  const { error: characterError } = await customFontCharactersTable.insert(characters);
  if (characterError) throw characterError;

  return true;
}

export async function deleteRemoteFont(fontId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !isUuid(fontId)) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  await createRemoteFontBackup(fontId, "delete");

  const customFontsTable = supabase.from("custom_fonts") as any;
  const { error } = await customFontsTable.delete().eq("id", fontId);
  if (error) throw error;
  return true;
}
