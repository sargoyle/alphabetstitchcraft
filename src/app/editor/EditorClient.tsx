"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CharacterEditor } from "@/components/CharacterEditor";
import type { StitchCharacter } from "@/lib/fontTypes";
import { cloneFont } from "@/lib/gridUtils";
import { useFonts } from "@/lib/useFonts";

export function EditorClient() {
  const params = useSearchParams();
  const { fonts, saveFont, deleteFont } = useFonts();
  const [fontId, setFontId] = useState(params.get("font") ?? "");
  const selectedFont = fonts.find((font) => font.id === fontId) ?? fonts[0];
  const characterKeys = useMemo(() => Object.keys(selectedFont?.characters ?? {}).sort(), [selectedFont]);
  const [characterKey, setCharacterKey] = useState("A");
  const activeKey = characterKeys.includes(characterKey) ? characterKey : characterKeys[0];
  const character = selectedFont?.characters[activeKey];

  function saveCharacter(updated: StitchCharacter) {
    if (!selectedFont || !activeKey) return;
    const targetFont = cloneFont(selectedFont);
    targetFont.characters[activeKey] = updated;
    saveFont(targetFont);
    setFontId(targetFont.id);
  }

  function removeSelectedFont() {
    if (!selectedFont) return;
    if (!window.confirm(`Delete ${selectedFont.name}?`)) return;
    deleteFont(selectedFont.id);
    setFontId("");
  }

  if (!selectedFont || !character) {
    return (
      <section className="page-stack">
        <div className="empty-preview">No editable font data is available yet.</div>
      </section>
    );
  }

  return (
    <section className="workspace-layout">
      <aside className="workspace-sidebar">
        <div className="page-heading compact-heading">
          <span className="eyebrow">Character editor</span>
          <h1>Edit cells</h1>
          <p>Edit any alphabet directly, then reuse your saved version in the generator.</p>
        </div>
        <label>
          Font
          <select value={selectedFont.id} onChange={(event) => setFontId(event.target.value)}>
            {fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Character
          <select value={activeKey} onChange={(event) => setCharacterKey(event.target.value)}>
            {characterKeys.map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </label>
        <button className="button danger" type="button" onClick={removeSelectedFont}>
          Delete font
        </button>
      </aside>

      <section className="workspace-main">
        <CharacterEditor
          key={`${selectedFont.id}-${activeKey}`}
          characterKey={activeKey}
          character={character}
          originalCharacter={character}
          onSave={saveCharacter}
        />
      </section>
    </section>
  );
}
