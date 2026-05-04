"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportControls } from "@/components/ExportControls";
import { SpacingControls } from "@/components/SpacingControls";
import { TextPatternPreview } from "@/components/TextPatternPreview";
import type { GeneratorSettings } from "@/lib/fontTypes";
import { renderTextToGrid } from "@/lib/renderTextToGrid";
import { loadGeneratorSettings, loadSelectedFontId, saveGeneratorSettings, saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";

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
      return {
        fontId: "",
        text: "",
        letterSpacing: 1,
        wordSpacing: 3,
        lineSpacing: 2,
        alignment: "left" as const,
        width: 0,
        height: 0,
        grid: [],
        unsupportedCharacters: []
      };
    }
    return renderTextToGrid(settings.text, font, settings);
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
          <p className="warning">Unsupported characters: {pattern.unsupportedCharacters.join(", ")}</p>
        ) : null}

        <TextPatternPreview
          pattern={pattern}
          showGrid={settings.showGrid}
          showFilled={settings.showFilled}
          zoom={settings.zoom}
        />
        <ExportControls pattern={pattern} />
      </section>
    </section>
  );
}

