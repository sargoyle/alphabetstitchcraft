import type { FontCategory } from "./fontTypes";

export type FontCategoryDefinition = {
  name: FontCategory;
  description: string;
};

export const fontCategoryDefinitions: FontCategoryDefinition[] = [
  { name: "Block", description: "Simple upright letters with clear straight edges. Good for labels, names and beginner-friendly patterns." },
  { name: "Serif", description: "Letters with small finishing strokes. Good for traditional samplers and classic wording." },
  { name: "Gothic", description: "Dark, dramatic or medieval-inspired lettering. Good for bold titles and themed pieces." },
  { name: "Script-inspired", description: "Lettering that suggests handwriting or flowing strokes while staying stitch-grid friendly." },
  { name: "Decorative", description: "More ornamental alphabets for display text, headings and feature lettering." },
  { name: "Modern", description: "Clean contemporary lettering for simple, minimal or geometric designs." }
];

export const defaultFontCategories = fontCategoryDefinitions.map((category) => category.name);

export function normaliseFontCategory(value: string): FontCategory {
  return value.trim().replace(/\s+/g, " ") || "Block";
}

export function getFontCategoryDescription(category: string) {
  return fontCategoryDefinitions.find((item) => item.name === category)?.description ?? "Custom category created for this font library.";
}

export function mergeFontCategories(fontCategories: string[]) {
  const hiddenCategories = new Set(["Tiny", "Sampler"]);
  const categories = [...defaultFontCategories, ...fontCategories.map(normaliseFontCategory)]
    .filter(Boolean)
    .filter((category) => !hiddenCategories.has(category));
  return Array.from(new Set(categories));
}

