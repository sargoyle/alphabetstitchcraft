"use client";

import type { GeneratorSettings, StitchFont } from "./fontTypes";
import { cloneFont, validateFont } from "./gridUtils";

const CUSTOM_FONTS_KEY = "crossStitch.customFonts";
const DELETED_FONTS_KEY = "crossStitch.deletedFontIds";
const GENERATOR_SETTINGS_KEY = "crossStitch.generatorSettings";
const SELECTED_FONT_KEY = "crossStitch.selectedFontId";

function storageAvailable() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCustomFonts(): StitchFont[] {
  return readJson<StitchFont[]>(CUSTOM_FONTS_KEY, []).filter((font) => validateFont(font).valid);
}

export function saveCustomFonts(fonts: StitchFont[]) {
  writeJson(CUSTOM_FONTS_KEY, fonts);
}

export function loadDeletedFontIds(): string[] {
  return readJson<string[]>(DELETED_FONTS_KEY, []);
}

export function saveDeletedFontIds(fontIds: string[]) {
  writeJson(DELETED_FONTS_KEY, Array.from(new Set(fontIds)));
}

export function saveFont(font: StitchFont) {
  const fonts = loadCustomFonts().filter((item) => item.id !== font.id);
  saveCustomFonts([...fonts, { ...font, isCustom: true, updatedAt: new Date().toISOString() }]);
  saveDeletedFontIds(loadDeletedFontIds().filter((id) => id !== font.id));
}

export function saveCustomFont(font: StitchFont) {
  saveFont(font);
}

export function deleteFont(fontId: string) {
  saveCustomFonts(loadCustomFonts().filter((font) => font.id !== fontId));
  saveDeletedFontIds([...loadDeletedFontIds(), fontId]);
}

export function restoreFont(fontId: string) {
  saveDeletedFontIds(loadDeletedFontIds().filter((id) => id !== fontId));
}

export function resetFontEdits(fontId: string) {
  saveCustomFonts(loadCustomFonts().filter((font) => font.id !== fontId));
  restoreFont(fontId);
}

export function deleteCustomFont(fontId: string) {
  deleteFont(fontId);
}

export function duplicateFont(font: StitchFont, name: string): StitchFont {
  const now = new Date().toISOString();
  const copy = cloneFont(font);
  return {
    ...copy,
    id: `custom-${font.id}-${Date.now()}`,
    name,
    isCustom: true,
    baseFontId: font.baseFontId ?? font.id,
    createdAt: now,
    updatedAt: now
  };
}

export function loadGeneratorSettings(): Partial<GeneratorSettings> {
  return readJson<Partial<GeneratorSettings>>(GENERATOR_SETTINGS_KEY, {});
}

export function saveGeneratorSettings(settings: Partial<GeneratorSettings>) {
  writeJson(GENERATOR_SETTINGS_KEY, settings);
}

export function loadSelectedFontId(): string | null {
  if (!storageAvailable()) return null;
  return window.localStorage.getItem(SELECTED_FONT_KEY);
}

export function saveSelectedFontId(fontId: string) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(SELECTED_FONT_KEY, fontId);
}
