"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportControls } from "@/components/ExportControls";
import { SpacingControls } from "@/components/SpacingControls";
import { TextPatternPreview } from "@/components/TextPatternPreview";
import type { GeneratorSettings } from "@/lib/fontTypes";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { loadGeneratorSettings, loadSelectedFontId, saveGeneratorSettings, saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";
import type { GeneratedPattern } from "@/lib/fontTypes";

const initialSettings: GeneratorSettings = {
  text: "HELLO\nSTITCH",
  fontId: "",
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left",
  showGrid: true,
  showFilled: true,
  zoom: 18
};

function emptyPattern(overrides: Partial<GeneratedPattern> = {}): GeneratedPattern {
  return {
    fontId: "",
    text: "",
    letterSpacing: 1,
    wordSpacing: 3,
    lineSpacing: 2,
    alignment: "left",
    width: 0,
    height: 0,
    grid: [],
    unsupportedCharacters: [],
    warnings: [],
    ...overrides
  };
}

function formatUnsupportedCharacters(pattern: GeneratedPattern) {
  return pattern.unsupportedCharacters
    .map((item) => `${item.character === "\t" ? "tab" : item.character}${item.count > 1 ? ` x${item.count}` : ""}`)
    .join(", ");
}

export default function GeneratorPage() {
  const { fonts } = useFonts();
  const [settings, setSettings] = useState<GeneratorSettings>(initialSettings);

  useEffect(() => {
    const saved = loadGeneratorSettings();
    const selected = loadSelectedFontId();
    setSettings((current) => ({
      ...current,
      ...saved,
      fontId: selected || saved.fontId || fonts[0]?.id || ""
    }));
  }, [fonts]);

  const font = fonts.find((item) => item.id === settings.fontId) ?? fonts[0];
  const pattern = useMemo(() => {
    if (!font) {
      return emptyPattern();
    }
    try {
      return renderTextToGrid(settings.text, font, settings);
    } catch (error) {
      return emptyPattern({
        fontId: font.id,
        text: settings.text,
        letterSpacing: settings.letterSpacing,
        wordSpacing: settings.wordSpacing,
        lineSpacing: settings.lineSpacing,
        alignment: settings.alignment,
        warnings: [error instanceof Error ? error.message : "Pattern settings are invalid."]
      });
    }
  }, [font, settings]);

  function updateSettings(updates: Partial<GeneratorSettings>) {
    setSettings((current) => {
      const next = { ...current, ...updates };
      saveGeneratorSettings(next);
      if (updates.fontId) saveSelectedFontId(updates.fontId);
      return next;
    });
  }

  return (
    <section className="workspace-layout">
      <aside className="workspace-sidebar">
        <div className="page-heading compact-heading">
          <span className="eyebrow">Text generator</span>
          <h1>Render lettering</h1>
        </div>

        <label>
          Font
          <select value={font?.id ?? ""} onChange={(event) => updateSettings({ fontId: event.target.value })}>
            {fonts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Text
          <textarea
            rows={6}
            value={settings.text}
            onChange={(event) => updateSettings({ text: event.target.value })}
            placeholder="Type names, quotes or labels"
          />
        </label>

        <SpacingControls {...settings} onChange={updateSettings} />
      </aside>

      <section className="workspace-main">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Pattern preview</span>
            <h2>{font?.name ?? "No font selected"}</h2>
          </div>
          <div className="dimension-group">
            <span className="dimension-pill">Width: {pattern.width}</span>
            <span className="dimension-pill">Height: {pattern.height}</span>
          </div>
        </div>

        {pattern.unsupportedCharacters.length ? (
          <p className="warning">Unsupported characters: {formatUnsupportedCharacters(pattern)}</p>
        ) : null}
        {pattern.warnings?.map((warning) => (
          <p className="warning" key={warning}>
            {warning}
          </p>
        ))}

        <TextPatternPreview
          pattern={pattern}
          showGrid={settings.showGrid}
          showFilled={settings.showFilled}
          zoom={settings.zoom}
        />
        <ExportControls pattern={pattern} showGrid={settings.showGrid} showFilled={settings.showFilled} />
      </section>
    </section>
  );
}
