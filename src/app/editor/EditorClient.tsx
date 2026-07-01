"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CharacterEditor } from "@/components/CharacterEditor";
import type { StitchCharacter } from "@/lib/fontTypes";
import { cloneFont } from "@/lib/gridUtils";
import { useFonts } from "@/lib/useFonts";

function blankCharacter(width = 8, height = 10): StitchCharacter {
  return {
    width,
    height,
    grid: Array.from({ length: height }, () => "0".repeat(width))
  };
}

function firstCharacter(value: string) {
  return Array.from(value.trim())[0] ?? "";
}

export function EditorClient() {
  const params = useSearchParams();
  const { fonts, saveFont, deleteFont } = useFonts();
  const [fontId, setFontId] = useState(params.get("font") ?? "");
  const selectedFont = fonts.find((font) => font.id === fontId) ?? fonts[0];
  const characterKeys = useMemo(() => Object.keys(selectedFont?.characters ?? {}).sort(), [selectedFont]);
  const [characterKey, setCharacterKey] = useState("A");
  const [creatingCharacter, setCreatingCharacter] = useState(false);
  const [sourceCharacterKey, setSourceCharacterKey] = useState("");
  const [destinationCharacterKey, setDestinationCharacterKey] = useState("");
  const [replaceExistingCharacter, setReplaceExistingCharacter] = useState(false);
  const activeKey = characterKeys.includes(characterKey) ? characterKey : characterKeys[0];
  const destinationKey = firstCharacter(destinationCharacterKey);
  const destinationExists = Boolean(destinationKey && selectedFont?.characters[destinationKey]);
  const sourceCharacter = sourceCharacterKey ? selectedFont?.characters[sourceCharacterKey] : null;
  const newCharacter = sourceCharacter
    ? (JSON.parse(JSON.stringify(sourceCharacter)) as StitchCharacter)
    : blankCharacter(
        Math.max(1, Math.min(24, selectedFont?.defaultHeight ?? 10)),
        Math.max(1, Math.min(24, selectedFont?.defaultHeight ?? 10))
      );
  const activeEditorKey = creatingCharacter ? destinationKey || "New unmapped character" : activeKey;
  const character = creatingCharacter ? newCharacter : selectedFont?.characters[activeKey];
  const saveDisabledReason = creatingCharacter
    ? !destinationKey
      ? "Choose a new character before saving."
      : destinationExists && !replaceExistingCharacter
        ? `${destinationKey} already exists. Choose an unmapped character or confirm replacement.`
        : undefined
    : undefined;

  async function saveCharacter(updated: StitchCharacter) {
    if (!selectedFont) return false;
    const targetKey = creatingCharacter ? destinationKey : activeKey;
    if (!targetKey) return false;
    if (creatingCharacter && destinationExists && !replaceExistingCharacter) return false;

    const targetFont = cloneFont(selectedFont);
    targetFont.characters[targetKey] = updated;
    const saved = await saveFont(targetFont);
    if (!saved) return false;

    setFontId(targetFont.id);
    setCharacterKey(targetKey);
    setCreatingCharacter(false);
    setSourceCharacterKey("");
    setDestinationCharacterKey("");
    setReplaceExistingCharacter(false);
    return true;
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
          <select
            value={selectedFont.id}
            onChange={(event) => {
              setFontId(event.target.value);
              setCreatingCharacter(false);
              setSourceCharacterKey("");
              setDestinationCharacterKey("");
              setReplaceExistingCharacter(false);
            }}
          >
            {fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Character
          <select
            value={activeKey}
            onChange={(event) => {
              setCharacterKey(event.target.value);
              setCreatingCharacter(false);
            }}
          >
            {characterKeys.map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </label>
        <div className="tool-card compact-tool-card">
          <div className="card-topline">
            <span className="eyebrow">New character</span>
          </div>
          <h2>Duplicate or start blank</h2>
          <p>Create a new mapped character from an existing letter or a blank grid.</p>
          <div className="control-panel">
            <label>
              Start from
              <select
                value={sourceCharacterKey}
                onChange={(event) => {
                  setSourceCharacterKey(event.target.value);
                  setCreatingCharacter(true);
                }}
              >
                <option value="">Blank character</option>
                {characterKeys.map((key) => (
                  <option key={key} value={key}>
                    Duplicate {key}
                  </option>
                ))}
              </select>
            </label>
            <label>
              New character
              <input
                value={destinationCharacterKey}
                onChange={(event) => {
                  setDestinationCharacterKey(firstCharacter(event.target.value));
                  setReplaceExistingCharacter(false);
                  setCreatingCharacter(true);
                }}
                placeholder="Type one character"
                aria-describedby="new-character-help"
              />
            </label>
            <p id="new-character-help" className="form-hint">
              Save is available after you choose an unmapped character.
            </p>
            {destinationExists ? (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={replaceExistingCharacter}
                  onChange={(event) => setReplaceExistingCharacter(event.target.checked)}
                />
                Replace existing {destinationKey}
              </label>
            ) : null}
            <div className="button-row">
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  setCreatingCharacter(true);
                  setSourceCharacterKey("");
                  setDestinationCharacterKey("");
                  setReplaceExistingCharacter(false);
                }}
              >
                Start blank
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  setCreatingCharacter(false);
                  setSourceCharacterKey("");
                  setDestinationCharacterKey("");
                  setReplaceExistingCharacter(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <button className="button danger" type="button" onClick={removeSelectedFont}>
          Delete font
        </button>
      </aside>

      <section className="workspace-main">
        <CharacterEditor
          key={`${selectedFont.id}-${creatingCharacter ? `new-${sourceCharacterKey || "blank"}` : activeKey}`}
          characterKey={activeEditorKey}
          character={character}
          originalCharacter={character}
          onSave={saveCharacter}
          saveDisabled={Boolean(saveDisabledReason)}
          saveDisabledReason={saveDisabledReason}
          saveLabel={creatingCharacter ? "Save new character" : "Save character"}
          headingLabel={creatingCharacter ? "New character" : "Selected character"}
        />
      </section>
    </section>
  );
}
