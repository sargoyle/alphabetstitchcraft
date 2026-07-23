"use client";

import { defaultEditableCharacterKeys } from "./characterSets";
import type { StitchCharacter, StitchFont } from "./fontTypes";
import { resizeCharacter, validateFont } from "./gridUtils";
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
  default_width?: number | null;
  recommended_use: string;
  licence: string;
  created_at: string;
  updated_at: string;
};

type RemoteDefaultFontRow = {
  id: string;
  name: string;
  description: string;
  category: StitchFont["category"];
  default_height: number;
  default_width?: number | null;
  recommended_use: string;
  licence: string;
  characters: unknown;
  created_at: string;
  updated_at: string;
};

type RemoteCharacterRow = {
  id?: string;
  font_id: string;
  character_key: string;
  width: number;
  height: number;
  grid: unknown;
  created_at?: string;
  updated_at?: string;
};

export type FontHydrationDiagnostic = {
  fontName: string;
  fontId: string;
  sourceTable: "custom_fonts" | "default_fonts";
  supabaseCharacterRowCount: number;
  supabaseCharacterKeys: string[];
  loadedCharacterKeyCount: number;
  loadedCharacterKeys: string[];
  missingFromUiModel: string[];
  blankInUiModel: string[];
  markedNotCreatedDespiteFilledSupabase: string[];
  duplicateCharacterRows: Array<{ characterKey: string; count: number; rowIds: string[] }>;
  invalidGridRows: Array<{ characterKey: string; rowId?: string; errors: string[] }>;
  dimensionMismatchRows: Array<{ characterKey: string; rowId?: string; width: number; height: number; gridRows: number | null; gridColumnCounts: number[] }>;
};

export type FontHydrationDiagnosticResult = {
  generatedAt: string;
  supabaseHost: string | null;
  duplicateFontRecords: Array<{ name: string; count: number; records: Array<{ id: string; sourceTable: "custom_fonts" | "default_fonts" }> }>;
  diagnostics: FontHydrationDiagnostic[];
  invalidFonts: InvalidRemoteFont[];
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

function createBlankCharacter(width: number, height: number): StitchCharacter {
  return {
    width,
    height,
    grid: Array.from({ length: height }, () => "0".repeat(width))
  };
}

function hasFilledStitches(character: StitchCharacter | undefined) {
  return Boolean(character?.grid.some((row) => row.includes("1")));
}

function isFilledRemoteCharacterRow(row: RemoteCharacterRow) {
  return isStringGrid(row.grid) && row.grid.some((line) => line.includes("1"));
}

function getRemoteRowTime(row: RemoteCharacterRow) {
  const updated = Date.parse(row.updated_at ?? "");
  if (Number.isFinite(updated)) return updated;
  const created = Date.parse(row.created_at ?? "");
  return Number.isFinite(created) ? created : 0;
}

function validateRemoteCharacterRow(row: RemoteCharacterRow) {
  const errors: string[] = [];
  const gridRows = isStringGrid(row.grid) ? row.grid : null;

  if (!row.character_key || !row.character_key.trim()) errors.push("Character key is empty.");
  if (!Number.isInteger(row.width) || row.width <= 0) errors.push("Width must be a positive integer.");
  if (!Number.isInteger(row.height) || row.height <= 0) errors.push("Height must be a positive integer.");
  if (!gridRows) {
    errors.push("Grid must be an array of strings.");
    return errors;
  }
  if (gridRows.length !== row.height) errors.push("Grid row count must equal height.");
  gridRows.forEach((line, index) => {
    if (line.length !== row.width) errors.push(`Grid row ${index + 1} width must equal width.`);
    if (!/^[01]+$/.test(line)) errors.push(`Grid row ${index + 1} must only contain 0 or 1.`);
  });

  return errors;
}

function getDimensionMismatch(row: RemoteCharacterRow) {
  if (!isStringGrid(row.grid)) return null;
  const gridColumnCounts = [...new Set(row.grid.map((line) => line.length))];
  const mismatched = row.grid.length !== row.height || gridColumnCounts.some((count) => count !== row.width);
  return mismatched
    ? {
        characterKey: row.character_key,
        rowId: row.id,
        width: row.width,
        height: row.height,
        gridRows: row.grid.length,
        gridColumnCounts
      }
    : null;
}

function normaliseCharacterToFontHeight(character: StitchCharacter, fontHeight: number) {
  if (character.height === fontHeight && character.grid.length === fontHeight) return character;
  return resizeCharacter(character, character.width, fontHeight);
}

function isFontSaveDebugEnabled() {
  if (process.env.NEXT_PUBLIC_FONT_SAVE_DEBUG === "true") return true;

  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem("alphabet-stitch-debug-font-save") === "1";
  } catch {
    return false;
  }
}

function getCharacterDebugShape(character: StitchCharacter) {
  return {
    width: character.width,
    height: character.height,
    gridRowCount: character.grid.length,
    gridColumnCounts: [...new Set(character.grid.map((row) => row.length))],
    isEmpty: !hasFilledStitches(character)
  };
}

function logFontSaveDebug(label: string, payload: unknown) {
  if (!isFontSaveDebugEnabled()) return;
  console.info(`[font-save-debug] ${label}`, payload);
}

function characterMatchesSavedRow(character: StitchCharacter, row: RemoteCharacterRow | null | undefined) {
  return Boolean(
    row &&
      row.width === character.width &&
      row.height === character.height &&
      isStringGrid(row.grid) &&
      JSON.stringify(row.grid) === JSON.stringify(character.grid)
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getFontIdKind(fontId: string) {
  return isUuid(fontId) ? "uuid" : "slug";
}

export function getRemoteFontSaveTarget(font: Pick<StitchFont, "id">) {
  return isUuid(font.id)
    ? { table: "custom_fonts" as const, operation: "upsert" as const }
    : { table: "default_fonts" as const, operation: "update" as const };
}

export function getRemoteFontDeleteTarget(fontId: string) {
  return isUuid(fontId)
    ? { allowed: true as const, table: "custom_fonts" as const, idKind: "uuid" as const }
    : { allowed: true as const, table: "default_fonts" as const, idKind: "slug" as const };
}

export function hasSharedFontNameConflict(
  fonts: Array<Pick<StitchFont, "id" | "name">>,
  currentFontId: string,
  name: string
) {
  const normalisedName = name.trim().toLowerCase();
  return fonts.some((font) => font.id !== currentFontId && font.name.trim().toLowerCase() === normalisedName);
}

function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      globalThis.setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

function getRemoteErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error) {
    return [
      "message" in error ? String((error as { message?: unknown }).message ?? "") : "",
      "details" in error ? String((error as { details?: unknown }).details ?? "") : "",
      "hint" in error ? String((error as { hint?: unknown }).hint ?? "") : "",
      "code" in error ? String((error as { code?: unknown }).code ?? "") : ""
    ].filter(Boolean).join(" ");
  }
  return String(error ?? "");
}

function normaliseRemoteFontSaveError(error: unknown) {
  const message = getRemoteErrorMessage(error);
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("default_width") || lowerMessage.includes("could not find") && lowerMessage.includes("column")) {
    return new Error(
      "Database setup is missing the font default width column. Run Supabase migration 202607140001_add_font_default_width.sql, then try again."
    );
  }
  return error instanceof Error ? error : new Error(message || "Database save failed. Font changes were not saved.");
}

async function loadRemoteCustomFontCharacterRows(fontIds: string[]): Promise<RemoteCharacterRow[]> {
  if (!fontIds.length) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const pageSize = 1000;
  const rows: RemoteCharacterRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("custom_font_characters")
      .select("id, font_id, character_key, width, height, grid, created_at, updated_at")
      .in("font_id", fontIds)
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const pageRows = (data ?? []) as unknown as RemoteCharacterRow[];
    rows.push(...pageRows);

    if (pageRows.length < pageSize) break;
  }

  return rows;
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

function toDefaultStitchFont(font: RemoteDefaultFontRow): { font: StitchFont | null; errors: string[] } {
  const sourceCharacters = font.characters && typeof font.characters === "object"
    ? font.characters as Record<string, StitchCharacter>
    : {};
  const characters = Object.fromEntries(
    Object.entries(sourceCharacters).map(([key, character]) => [
      key,
      normaliseCharacterToFontHeight(character, font.default_height)
    ])
  ) as StitchFont["characters"];

  const stitchFont: StitchFont = {
    id: font.id,
    name: font.name,
    description: font.description,
    category: font.category,
    defaultHeight: font.default_height,
    defaultWidth: font.default_width ?? font.default_height,
    recommendedUse: font.recommended_use,
    licence: font.licence,
    canEdit: true,
    createdAt: font.created_at,
    updatedAt: font.updated_at,
    characters
  };

  const validation = validateSharedFont(stitchFont);
  return validation.valid ? { font: stitchFont, errors: [] } : { font: null, errors: validation.errors };
}

function getDefaultFontDiagnostic(font: RemoteDefaultFontRow, stitchFont: StitchFont | null): FontHydrationDiagnostic {
  const sourceCharacters = font.characters && typeof font.characters === "object"
    ? font.characters as Record<string, StitchCharacter>
    : {};
  const supabaseCharacterKeys = Object.keys(sourceCharacters).filter((key) => hasFilledStitches(sourceCharacters[key])).sort();
  const loadedCharacters = stitchFont?.characters ?? {};
  const loadedCharacterKeys = Object.keys(loadedCharacters).sort();
  const loadedFilledKeys = loadedCharacterKeys.filter((key) => hasFilledStitches(loadedCharacters[key]));
  const invalidGridRows = Object.entries(sourceCharacters)
    .map(([key, character]) => {
      const errors = validateRemoteCharacterRow({
        font_id: font.id,
        character_key: key,
        width: character.width,
        height: character.height,
        grid: character.grid
      });
      return errors.length ? { characterKey: key, errors } : null;
    })
    .filter((item): item is { characterKey: string; errors: string[] } => Boolean(item));
  const dimensionMismatchRows = Object.entries(sourceCharacters)
    .map(([key, character]) => getDimensionMismatch({
      font_id: font.id,
      character_key: key,
      width: character.width,
      height: character.height,
      grid: character.grid
    }))
    .filter((item): item is NonNullable<ReturnType<typeof getDimensionMismatch>> => Boolean(item));

  return {
    fontName: font.name,
    fontId: font.id,
    sourceTable: "default_fonts",
    supabaseCharacterRowCount: Object.keys(sourceCharacters).length,
    supabaseCharacterKeys,
    loadedCharacterKeyCount: loadedCharacterKeys.length,
    loadedCharacterKeys: loadedFilledKeys,
    missingFromUiModel: supabaseCharacterKeys.filter((key) => !loadedCharacterKeys.includes(key)),
    blankInUiModel: supabaseCharacterKeys.filter((key) => !hasFilledStitches(loadedCharacters[key])),
    markedNotCreatedDespiteFilledSupabase: supabaseCharacterKeys.filter((key) => !hasFilledStitches(loadedCharacters[key])),
    duplicateCharacterRows: [],
    invalidGridRows,
    dimensionMismatchRows
  };
}

export function hydrateRemoteCustomFont(
  font: RemoteFontRow,
  characters: RemoteCharacterRow[]
): { font: StitchFont | null; errors: string[]; diagnostic: FontHydrationDiagnostic } {
  const defaultHeight = font.default_height;
  const defaultWidth = font.default_width ?? font.default_height;
  const starterCharacters = Object.fromEntries(
    defaultEditableCharacterKeys.map((key) => [key, createBlankCharacter(defaultWidth, defaultHeight)])
  ) as Record<string, StitchCharacter>;
  const rowsByKey = new Map<string, RemoteCharacterRow[]>();
  const duplicateCharacterRows: FontHydrationDiagnostic["duplicateCharacterRows"] = [];
  const invalidGridRows: FontHydrationDiagnostic["invalidGridRows"] = [];
  const dimensionMismatchRows: FontHydrationDiagnostic["dimensionMismatchRows"] = [];

  for (const row of characters) {
    const errors = validateRemoteCharacterRow(row);
    if (errors.length) {
      invalidGridRows.push({ characterKey: row.character_key, rowId: row.id, errors });
    }

    const mismatch = getDimensionMismatch(row);
    if (mismatch) dimensionMismatchRows.push(mismatch);

    const characterKey = row.character_key ?? "";
    const rows = rowsByKey.get(characterKey) ?? [];
    rows.push(row);
    rowsByKey.set(characterKey, rows);
  }

  const mappedCharacters = { ...starterCharacters };

  for (const [characterKey, rows] of rowsByKey.entries()) {
    if (rows.length > 1) {
      duplicateCharacterRows.push({
        characterKey,
        count: rows.length,
        rowIds: rows.map((row) => row.id ?? "(no id)")
      });
    }

    const validRows = rows.filter((row) => validateRemoteCharacterRow(row).length === 0);
    const filledRows = validRows.filter(isFilledRemoteCharacterRow);
    const candidates = filledRows.length ? filledRows : validRows;
    const chosenRow = [...candidates].sort((first, second) => getRemoteRowTime(second) - getRemoteRowTime(first))[0];
    if (!chosenRow || !isStringGrid(chosenRow.grid) || !isFilledRemoteCharacterRow(chosenRow)) continue;

    mappedCharacters[characterKey] = normaliseCharacterToFontHeight({
      width: chosenRow.width,
      height: chosenRow.height,
      grid: chosenRow.grid
    }, defaultHeight);
  }

  const stitchFont: StitchFont = {
    id: font.id,
    name: font.name,
    description: font.description,
    category: font.category,
    defaultHeight,
    defaultWidth,
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
  const filledSupabaseKeys = [...rowsByKey.entries()]
    .filter(([, rows]) => rows.some(isFilledRemoteCharacterRow))
    .map(([key]) => key)
    .sort();
  const loadedCharacterKeys = Object.keys(stitchFont.characters).sort();
  const loadedFilledKeys = loadedCharacterKeys.filter((key) => hasFilledStitches(stitchFont.characters[key]));
  const diagnostic: FontHydrationDiagnostic = {
    fontName: font.name,
    fontId: font.id,
    sourceTable: "custom_fonts",
    supabaseCharacterRowCount: characters.length,
    supabaseCharacterKeys: filledSupabaseKeys,
    loadedCharacterKeyCount: loadedCharacterKeys.length,
    loadedCharacterKeys: loadedFilledKeys,
    missingFromUiModel: filledSupabaseKeys.filter((key) => !loadedCharacterKeys.includes(key)),
    blankInUiModel: filledSupabaseKeys.filter((key) => !hasFilledStitches(stitchFont.characters[key])),
    markedNotCreatedDespiteFilledSupabase: filledSupabaseKeys.filter((key) => !hasFilledStitches(stitchFont.characters[key])),
    duplicateCharacterRows,
    invalidGridRows,
    dimensionMismatchRows
  };

  return validation.valid
    ? { font: stitchFont, errors: [], diagnostic }
    : { font: null, errors: validation.errors, diagnostic };
}

async function loadRemoteFontSnapshot(fontId: string): Promise<StitchFont | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: fontRow, error: fontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .eq("id", fontId)
    .maybeSingle();

  if (fontError) throw normaliseRemoteFontSaveError(fontError);
  if (!fontRow) return null;

  const characterRows = await loadRemoteCustomFontCharacterRows([fontId]);

  const result = hydrateRemoteCustomFont(fontRow as unknown as RemoteFontRow, (characterRows ?? []) as RemoteCharacterRow[]);
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

async function assertUniqueSharedFontName(name: string, currentFontId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data: defaultDuplicateRows, error: defaultDuplicateError } = await supabase
    .from("default_fonts")
    .select("id, name")
    .ilike("name", name)
    .neq("id", currentFontId)
    .limit(1);

  if (defaultDuplicateError) throw defaultDuplicateError;

  let customDuplicateQuery = supabase
    .from("custom_fonts")
    .select("id, name")
    .ilike("name", name)
    .limit(1);

  if (isUuid(currentFontId)) {
    customDuplicateQuery = customDuplicateQuery.neq("id", currentFontId);
  }

  const { data: customDuplicateRows, error: customDuplicateError } = await customDuplicateQuery;

  if (customDuplicateError) throw customDuplicateError;

  const duplicates = [
    ...((defaultDuplicateRows ?? []) as Array<Pick<StitchFont, "id" | "name">>).map((font) => ({
      ...font,
      table: "default_fonts"
    })),
    ...((customDuplicateRows ?? []) as Array<Pick<StitchFont, "id" | "name">>).map((font) => ({
      ...font,
      table: "custom_fonts"
    }))
  ];

  const duplicate = duplicates.find((font) => hasSharedFontNameConflict([font], currentFontId, name));

  if (duplicate) {
    console.warn(
      `[fontPersistence] Duplicate shared font name "${name}" while saving "${currentFontId}". ` +
        `Matched ${duplicate.table} id "${duplicate.id}".`
    );
    throw new Error(`Another shared font named "${name}" already exists in ${duplicate.table}.`);
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

  const invalidFonts: InvalidRemoteFont[] = [];

  const { data: defaultFontRows, error: defaultFontError } = await supabase
    .from("default_fonts")
    .select("*")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (defaultFontError) throw defaultFontError;

  const remoteDefaultFonts = ((defaultFontRows ?? []) as unknown as RemoteDefaultFontRow[])
    .map((font) => {
      const result = toDefaultStitchFont(font);

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

  if (!defaultFontRows?.length) {
    invalidFonts.push({
      id: "default_fonts",
      name: "Default fonts",
      errors: ["No default font records were found. Run the default font seed migration before editing bundled fonts."]
    });
  }

  const { data: fontRows, error: fontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (fontError) throw normaliseRemoteFontSaveError(fontError);
  if (!fontRows?.length) return { fonts: remoteDefaultFonts, invalidFonts };

  const remoteFontRows = fontRows as unknown as RemoteFontRow[];
  const ids = remoteFontRows.map((font) => font.id);
  const characterRows = await loadRemoteCustomFontCharacterRows(ids);

  const fonts = remoteFontRows
    .map((font) => {
      const result = hydrateRemoteCustomFont(
        font,
        characterRows.filter((character) => character.font_id === font.id)
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

  return { fonts: [...remoteDefaultFonts, ...fonts], invalidFonts };
}

export async function loadRemoteFonts(): Promise<StitchFont[] | null> {
  const result = await loadRemoteFontResult();
  return result?.fonts ?? null;
}

export async function loadFontHydrationDiagnostics(fontNames: string[] = []): Promise<FontHydrationDiagnosticResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      generatedAt: new Date().toISOString(),
      supabaseHost: null,
      duplicateFontRecords: [],
      diagnostics: [],
      invalidFonts: [{ id: "supabase", name: "Supabase", errors: ["Supabase is not configured."] }]
    };
  }

  const selectedNames = new Set(fontNames.map((name) => name.trim().toLowerCase()).filter(Boolean));
  const includeFontName = (name: string) => selectedNames.size === 0 || selectedNames.has(name.trim().toLowerCase());
  const invalidFonts: InvalidRemoteFont[] = [];

  const { data: defaultFontRows, error: defaultFontError } = await supabase
    .from("default_fonts")
    .select("*")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (defaultFontError) throw defaultFontError;

  const defaultRows = ((defaultFontRows ?? []) as unknown as RemoteDefaultFontRow[]).filter((font) => includeFontName(font.name));
  const defaultDiagnostics = defaultRows.map((font) => {
    const mapped = toDefaultStitchFont(font);
    if (mapped.errors.length) invalidFonts.push({ id: font.id, name: font.name, errors: mapped.errors });
    return getDefaultFontDiagnostic(font, mapped.font);
  });

  const { data: customFontRows, error: customFontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .order("name", { ascending: true });

  if (customFontError) throw normaliseRemoteFontSaveError(customFontError);

  const customRows = ((customFontRows ?? []) as unknown as RemoteFontRow[]).filter((font) => includeFontName(font.name));
  const customIds = customRows.map((font) => font.id);
  const allCharacterRows = await loadRemoteCustomFontCharacterRows(customIds);
  const customDiagnostics = customRows.map((font) => {
    const result = hydrateRemoteCustomFont(
      font,
      allCharacterRows.filter((character) => character.font_id === font.id)
    );
    if (result.errors.length) invalidFonts.push({ id: font.id, name: font.name, errors: result.errors });
    return result.diagnostic;
  });

  const fontRecords = [
    ...((defaultFontRows ?? []) as unknown as RemoteDefaultFontRow[]).map((font) => ({
      id: font.id,
      name: font.name,
      sourceTable: "default_fonts" as const
    })),
    ...((customFontRows ?? []) as unknown as RemoteFontRow[]).map((font) => ({
      id: font.id,
      name: font.name,
      sourceTable: "custom_fonts" as const
    }))
  ];
  const recordsByName = new Map<string, typeof fontRecords>();
  for (const record of fontRecords) {
    const key = record.name.trim().toLowerCase();
    recordsByName.set(key, [...(recordsByName.get(key) ?? []), record]);
  }

  return {
    generatedAt: new Date().toISOString(),
    supabaseHost: process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null,
    duplicateFontRecords: [...recordsByName.entries()]
      .filter(([, records]) => records.length > 1)
      .map(([name, records]) => ({ name, count: records.length, records })),
    diagnostics: [...defaultDiagnostics, ...customDiagnostics],
    invalidFonts
  };
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

export async function saveRemoteCustomFontMetadata(font: StitchFont): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  if (!isUuid(font.id)) return true;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const validation = validateSharedFont(font);
  if (!validation.valid) {
    throw new Error(`Font is invalid: ${validation.errors.join(" ")}`);
  }

  const trimmedName = font.name.trim();
  await assertUniqueSharedFontName(trimmedName, font.id);

  const baseDefaultFontId = font.baseFontId && !isUuid(font.baseFontId) ? font.baseFontId : null;
  const baseCustomFontId = font.baseFontId && isUuid(font.baseFontId) ? font.baseFontId : null;

  if (baseDefaultFontId) {
    await ensureBaseDefaultFontExists(baseDefaultFontId);
  }

  const customFontsTable = supabase.from("custom_fonts") as any;
  const { error } = await withTimeout<any>(
    customFontsTable.upsert({
      id: font.id,
      owner_id: null,
      base_default_font_id: baseDefaultFontId,
      base_custom_font_id: baseCustomFontId,
      name: trimmedName,
      description: font.description,
      category: font.category,
      default_height: font.defaultHeight,
      default_width: font.defaultWidth ?? font.defaultHeight,
      recommended_use: font.recommendedUse,
      licence: font.licence,
      updated_at: new Date().toISOString()
    }),
    `Timed out saving font "${font.name}". Check the database connection and try again.`
  );

  if (error) throw normaliseRemoteFontSaveError(error);
  return true;
}
export async function saveRemoteCustomFontCharacter(
  fontId: string,
  characterKey: string,
  character: StitchCharacter,
  context: { fontName?: string; fontType?: "custom" | "default" } = {}
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  if (!isUuid(fontId)) {
    logFontSaveDebug("shared-font-character-save-skipped", {
      fontId,
      fontName: context.fontName,
      fontType: context.fontType ?? "default",
      characterKey,
      characterKeyType: typeof characterKey,
      method: "default_fonts.characters",
      table: "default_fonts",
      ...getCharacterDebugShape(character)
    });
    return true;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const customFontCharactersTable = supabase.from("custom_font_characters") as any;
  const debugPayload = {
    fontId,
    fontName: context.fontName,
    fontType: context.fontType ?? "custom",
    characterKey,
    characterKeyType: typeof characterKey,
    method: hasFilledStitches(character) ? "upsert" : "delete",
    table: "custom_font_characters",
    ...getCharacterDebugShape(character)
  };
  logFontSaveDebug("character-save-attempt", debugPayload);
  if (context.fontName === "Deco" && characterKey === "G") {
    logFontSaveDebug("deco-g-character-save-full-payload", {
      ...debugPayload,
      payload: {
        font_id: fontId,
        owner_id: null,
        character_key: characterKey,
        width: character.width,
        height: character.height,
        grid: character.grid
      }
    });
  }

  if (!hasFilledStitches(character)) {
    const { data, error } = await withTimeout<any>(
      customFontCharactersTable
        .delete()
        .eq("font_id", fontId)
        .eq("character_key", characterKey)
        .select("font_id, character_key"),
      `Timed out clearing character "${characterKey}". Check the database connection and try again.`
    );
    logFontSaveDebug("character-clear-response", { data, error });

    if (error) throw normaliseRemoteFontSaveError(error);

    const { data: clearedRow, error: readAfterClearError } = await withTimeout<any>(
      customFontCharactersTable
        .select("font_id")
        .eq("font_id", fontId)
        .eq("character_key", characterKey)
        .maybeSingle(),
      `Timed out verifying cleared character "${characterKey}". Check the database connection and try again.`
    );

    if (readAfterClearError) throw normaliseRemoteFontSaveError(readAfterClearError);
    if (clearedRow) {
      throw new Error(`Character "${characterKey}" was not cleared in the database. Try saving again.`);
    }

    return true;
  }

  const { data, error } = await withTimeout<any>(
    customFontCharactersTable.upsert(
      {
        font_id: fontId,
        owner_id: null,
        character_key: characterKey,
        width: character.width,
        height: character.height,
        grid: character.grid
      },
      { onConflict: "font_id,character_key" }
    ).select("font_id, character_key, width, height, grid"),
    `Timed out saving character "${characterKey}". Check the database connection and try again.`
  );
  logFontSaveDebug("character-upsert-response", { data, error });

  if (error) throw normaliseRemoteFontSaveError(error);

  const { data: savedRow, error: readAfterSaveError } = await withTimeout<any>(
    customFontCharactersTable
      .select("font_id, character_key, width, height, grid")
      .eq("font_id", fontId)
      .eq("character_key", characterKey)
      .maybeSingle(),
    `Timed out verifying saved character "${characterKey}". Check the database connection and try again.`
  );

  if (readAfterSaveError) throw normaliseRemoteFontSaveError(readAfterSaveError);
  if (!characterMatchesSavedRow(character, savedRow as RemoteCharacterRow | null)) {
    throw new Error(`Character "${characterKey}" was not saved correctly in the database. Try saving again.`);
  }

  return true;
}
export async function saveRemoteFont(
  font: StitchFont,
  options: { backupAction?: RemoteFontBackup["action"] | null } = {}
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const validation = validateSharedFont(font);
  if (!validation.valid) {
    throw new Error(`Font is invalid: ${validation.errors.join(" ")}`);
  }

  const trimmedName = font.name.trim();
  await assertUniqueSharedFontName(trimmedName, font.id);

  const saveTarget = getRemoteFontSaveTarget(font);
  console.info(
    `[fontPersistence] Saving font "${font.id}" as ${getFontIdKind(font.id)} via ${saveTarget.table}.${saveTarget.operation}.`
  );

  if (saveTarget.table === "default_fonts") {
    const defaultFontsTable = supabase.from("default_fonts") as any;
    const { data, error } = await defaultFontsTable
      .update({
        name: trimmedName,
        description: font.description,
        category: font.category,
        default_height: font.defaultHeight,
        default_width: font.defaultWidth ?? font.defaultHeight,
        recommended_use: font.recommendedUse,
        licence: font.licence,
        characters: font.characters,
        is_public: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", font.id)
      .select("id")
      .maybeSingle();

    if (error) throw normaliseRemoteFontSaveError(error);
    if (!data) {
      throw new Error(`Default font "${font.id}" was not found in the database. Run the default font seed migration before saving changes.`);
    }

    return true;
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
    default_width: font.defaultWidth ?? font.defaultHeight,
    recommended_use: font.recommendedUse,
    licence: font.licence,
    updated_at: new Date().toISOString()
  });

  if (fontError) throw normaliseRemoteFontSaveError(fontError);

  const characterEntries = Object.entries(font.characters);
  const characters = characterEntries
    .filter(([, character]) => hasFilledStitches(character))
    .map(([key, character]) => ({
      font_id: font.id,
      owner_id: null,
      character_key: key,
      width: character.width,
      height: character.height,
      grid: character.grid
    }));

  if (characters.length) {
    const { error: characterError } = await customFontCharactersTable.upsert(characters, {
      onConflict: "font_id,character_key"
    });
    if (characterError) throw normaliseRemoteFontSaveError(characterError);
  }

  return true;
}

export async function deleteRemoteFont(fontId: string): Promise<boolean> {
  const deleteTarget = getRemoteFontDeleteTarget(fontId);
  console.info(
    `[fontPersistence] Delete requested for font "${fontId}" as ${deleteTarget.idKind}; allowed=${deleteTarget.allowed}.`
  );

  if (!isSupabaseConfigured() || !deleteTarget.allowed) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  if (deleteTarget.table === "default_fonts") {
    const { data: archived, error } = await (supabase as any).rpc("archive_default_font", { font_id: fontId });

    if (error) throw error;
    if (archived !== true) throw new Error(`Default/shared font "${fontId}" was not found or could not be deleted.`);
    return true;
  }

  await createRemoteFontBackup(fontId, "delete");

  const customFontsTable = supabase.from("custom_fonts") as any;
  const { data, error } = await customFontsTable
    .delete()
    .eq("id", fontId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Custom font "${fontId}" was not found or could not be deleted.`);
  return true;
}








