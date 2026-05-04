"use client";

import type { StitchCharacter, StitchFont } from "./fontTypes";
import { validateFont } from "./gridUtils";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

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

function toStitchFont(font: RemoteFontRow, characters: RemoteCharacterRow[]): StitchFont | null {
  const mappedCharacters = characters.reduce<Record<string, StitchCharacter>>((acc, character) => {
    if (!isStringGrid(character.grid)) return acc;
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

  return validateFont(stitchFont).valid ? stitchFont : null;
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

export async function loadRemoteFonts(): Promise<StitchFont[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: fontRows, error: fontError } = await supabase
    .from("custom_fonts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (fontError) throw fontError;
  if (!fontRows?.length) return [];

  const remoteFontRows = fontRows as unknown as RemoteFontRow[];
  const ids = remoteFontRows.map((font) => font.id);
  const { data: characterRows, error: characterError } = await supabase
    .from("custom_font_characters")
    .select("font_id, character_key, width, height, grid")
    .in("font_id", ids);

  if (characterError) throw characterError;

  return remoteFontRows
    .map((font) =>
      toStitchFont(
        font,
        ((characterRows ?? []) as RemoteCharacterRow[]).filter((character) => character.font_id === font.id)
      )
    )
    .filter((font): font is StitchFont => Boolean(font));
}

export async function saveRemoteFont(font: StitchFont): Promise<boolean> {
  if (!isSupabaseConfigured() || !isUuid(font.id)) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const baseDefaultFontId = font.baseFontId && !isUuid(font.baseFontId) ? font.baseFontId : null;
  const baseCustomFontId = font.baseFontId && isUuid(font.baseFontId) ? font.baseFontId : null;

  const customFontsTable = supabase.from("custom_fonts") as any;
  const customFontCharactersTable = supabase.from("custom_font_characters") as any;

  const { error: fontError } = await customFontsTable.upsert({
    id: font.id,
    owner_id: null,
    base_default_font_id: baseDefaultFontId,
    base_custom_font_id: baseCustomFontId,
    name: font.name,
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

  const customFontsTable = supabase.from("custom_fonts") as any;
  const { error } = await customFontsTable.delete().eq("id", fontId);
  if (error) throw error;
  return true;
}
