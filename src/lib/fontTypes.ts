export type FontCategory =
  | "Block"
  | "Serif"
  | "Gothic"
  | "Script-inspired"
  | "Tiny"
  | "Decorative"
  | "Sampler"
  | "Modern";

export type StitchCharacter = {
  width: number;
  height: number;
  grid: string[];
};

export type StitchFont = {
  id: string;
  name: string;
  description: string;
  category: FontCategory;
  defaultHeight: number;
  recommendedUse: string;
  licence: string;
  characters: Record<string, StitchCharacter>;
  isCustom?: boolean;
  baseFontId?: string;
  ownerId?: string;
  canEdit?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TextAlignment = "left" | "center" | "right";

export type TextRenderOptions = {
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  alignment: TextAlignment;
  placeholderUnsupported?: boolean;
};

export type GeneratedPattern = {
  fontId: string;
  text: string;
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  alignment: TextAlignment;
  width: number;
  height: number;
  grid: string[];
  unsupportedCharacters: string[];
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type GeneratorSettings = TextRenderOptions & {
  text: string;
  fontId: string;
  showGrid: boolean;
  showFilled: boolean;
  zoom: number;
};
