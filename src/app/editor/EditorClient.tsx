"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Save, Trash2, X } from "lucide-react";
import { CharacterEditor } from "@/components/CharacterEditor";
import type { StitchCharacter } from "@/lib/fontTypes";
import { cloneFont, resizeCharacter, resizeFontCharactersHeight } from "@/lib/gridUtils";
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

function hasFilledStitches(character: StitchCharacter | undefined) {
  return Boolean(character?.grid.some((row) => row.includes("1")));
}

const uppercaseCharacters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const lowercaseCharacters = Array.from("abcdefghijklmnopqrstuvwxyz");
const numberCharacters = Array.from("0123456789");
const orderedBaseCharacters = new Set([...uppercaseCharacters, ...lowercaseCharacters, ...numberCharacters]);

export function EditorClient() {
  const params = useSearchParams();
  const { fonts, saveFont, deleteFont, persistence } = useFonts();
  const [fontId, setFontId] = useState(params.get("font") ?? "");
  const selectedFont = fonts.find((font) => font.id === fontId) ?? (fontId ? undefined : fonts[0]);
  const characterKeys = useMemo(() => Object.keys(selectedFont?.characters ?? {}).sort(), [selectedFont]);
  const displayedCharacterKeys = useMemo(() => {
    const otherCharacters = characterKeys.filter((key) => !orderedBaseCharacters.has(key)).sort();
    return [...uppercaseCharacters, ...lowercaseCharacters, ...numberCharacters, ...otherCharacters];
  }, [characterKeys]);
  const [characterKey, setCharacterKey] = useState("A");
  const [creatingCharacter, setCreatingCharacter] = useState(false);
  const [sourceCharacterKey, setSourceCharacterKey] = useState("");
  const [destinationCharacterKey, setDestinationCharacterKey] = useState("");
  const [replaceExistingCharacter, setReplaceExistingCharacter] = useState(false);
  const [newCharacterOpen, setNewCharacterOpen] = useState(false);
  const [fontNameDraft, setFontNameDraft] = useState("");
  const [fontHeightDraft, setFontHeightDraft] = useState(10);
  const [fontSettingsStatus, setFontSettingsStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const activeKey = characterKey;
  const selectedCharacter = activeKey ? selectedFont?.characters[activeKey] : undefined;
  const selectedCharacterExists = hasFilledStitches(selectedCharacter);
  const destinationKey = creatingCharacter ? firstCharacter(destinationCharacterKey) : activeKey;
  const destinationExists = hasFilledStitches(destinationKey ? selectedFont?.characters[destinationKey] : undefined);
  const sourceCharacter = sourceCharacterKey ? selectedFont?.characters[sourceCharacterKey] : null;
  const newCharacter = sourceCharacter
    ? (JSON.parse(JSON.stringify(sourceCharacter)) as StitchCharacter)
    : blankCharacter(
        Math.max(1, Math.min(24, selectedFont?.defaultHeight ?? 10)),
        Math.max(1, Math.min(24, selectedFont?.defaultHeight ?? 10))
      );
  const activeEditorKey = destinationKey || activeKey || "New unmapped character";
  const character = creatingCharacter ? newCharacter : selectedCharacter ?? newCharacter;
  const saveDisabledReason = creatingCharacter
    ? !destinationKey
      ? "Choose a new character before saving."
      : destinationExists && !replaceExistingCharacter
        ? `${destinationKey} already exists. Choose an unmapped character or confirm replacement.`
        : undefined
    : undefined;

  useEffect(() => {
    if (!selectedFont) return;
    setFontNameDraft(selectedFont.name);
    setFontHeightDraft(selectedFont.defaultHeight);
    setFontSettingsStatus(null);
  }, [selectedFont?.id, selectedFont?.name, selectedFont?.defaultHeight]);

  async function saveFontSettings() {
    if (!selectedFont) return;

    const nextName = fontNameDraft.trim();
    const nextHeight = Math.max(1, Math.min(24, Math.round(fontHeightDraft)));

    if (!nextName) {
      setFontSettingsStatus({ type: "error", message: "Font name is required." });
      return;
    }

    const targetFont = resizeFontCharactersHeight(cloneFont(selectedFont), nextHeight);
    targetFont.name = nextName;
    targetFont.updatedAt = new Date().toISOString();

    const saved = await saveFont(targetFont);
    setFontSettingsStatus(
      saved
        ? { type: "success", message: "Font settings saved successfully." }
        : { type: "error", message: "Font settings were not saved." }
    );

    if (saved) {
      setFontId(targetFont.id);
    }
  }

  async function saveCharacter(updated: StitchCharacter) {
    if (!selectedFont) return false;
    const targetKey = creatingCharacter ? destinationKey : activeKey;
    if (!targetKey) return false;
    if (creatingCharacter && destinationExists && !replaceExistingCharacter) return false;

    const targetFont = cloneFont(selectedFont);
    targetFont.characters[targetKey] = resizeCharacter(updated, updated.width, targetFont.defaultHeight);
    const saved = await saveFont(targetFont);
    if (!saved) return false;

    setFontId(targetFont.id);
    setCharacterKey(targetKey);
    setCreatingCharacter(false);
    setSourceCharacterKey("");
    setDestinationCharacterKey("");
    setReplaceExistingCharacter(false);
    setNewCharacterOpen(false);
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
        <div className="empty-preview">
          {persistence.mode === "loading" ? "Loading font data..." : "No editable font data is available yet."}
        </div>
      </section>
    );
  }

  return (
    <section className="editor-workspace">
      <aside className="editor-sidebar editor-font-panel" aria-label="Font settings and font actions">
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
              setNewCharacterOpen(false);
            }}
          >
            {fonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </label>

        <div className="font-settings-panel">
          <span className="eyebrow">Font settings</span>
          <label>
            Font name
            <input
              value={fontNameDraft}
              onChange={(event) => {
                setFontNameDraft(event.target.value);
                setFontSettingsStatus(null);
              }}
              placeholder="Font name"
            />
          </label>
          <label>
            Font height
            <input
              type="number"
              min={1}
              max={24}
              value={fontHeightDraft}
              onChange={(event) => {
                setFontHeightDraft(Number(event.target.value));
                setFontSettingsStatus(null);
              }}
            />
          </label>
          <p className="form-hint">Height applies to every character in this font.</p>
          <button className="button secondary" type="button" onClick={saveFontSettings}>
            <Save aria-hidden="true" size={17} />
            Save font settings
          </button>
          {fontSettingsStatus ? (
            <p className={fontSettingsStatus.type === "success" ? "success-message compact-status" : "warning compact-status"}>
              {fontSettingsStatus.message}
            </p>
          ) : null}
        </div>

        <div className="danger-zone">
          <span className="eyebrow">Danger zone</span>
          <p>Deletes the full font and all characters permanently.</p>
          <button className="button danger" type="button" onClick={removeSelectedFont}>
            <Trash2 aria-hidden="true" size={17} />
            Delete Font...
          </button>
        </div>
      </aside>

      <aside className="editor-sidebar editor-character-panel" aria-label="Character selection and duplicate controls">
        <div className="character-picker" aria-label="Characters">
          <span className="eyebrow">Characters</span>
          <div className="character-button-grid">
            {displayedCharacterKeys.map((key) => {
              const exists = hasFilledStitches(selectedFont.characters[key]);
              const selected = key === activeKey;
              const className = [
                "character-tile",
                exists ? "exists" : "not-created",
                selected ? "is-active" : ""
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  className={className}
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setCharacterKey(key);
                    setDestinationCharacterKey(key);
                    setSourceCharacterKey("");
                    setReplaceExistingCharacter(exists);
                    setCreatingCharacter(false);
                    setNewCharacterOpen(false);
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
          <div className="character-picker-legend" aria-label="Character tile legend">
            <span>
              <span className="legend-swatch exists" />
              Exists
            </span>
            <span>
              <span className="legend-swatch not-created" />
              Not created
            </span>
            <span>
              <span className="legend-swatch selected" />
              Selected
            </span>
          </div>
          <button
            className="button secondary new-character-button"
            type="button"
            onClick={() => {
              setDestinationCharacterKey(activeKey);
              setSourceCharacterKey("");
              setReplaceExistingCharacter(hasFilledStitches(selectedFont.characters[activeKey]));
              setNewCharacterOpen(true);
            }}
          >
            <Copy aria-hidden="true" size={17} />
            Select duplicate
          </button>
        </div>
      </aside>

      {newCharacterOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div
            className="new-character-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-character-title"
          >
            <button
              className="icon-button modal-close"
              type="button"
              aria-label="Close new character dialog"
              onClick={() => setNewCharacterOpen(false)}
            >
              <X aria-hidden="true" size={18} />
            </button>
            <span className="eyebrow">Select duplicate</span>
            <h2 id="new-character-title">Copy into {activeKey}</h2>
            <p>Choose an existing character to duplicate into the selected character, or start from a blank grid.</p>
            <div className="control-panel">
              <span className="field-label">Start from</span>
              <div className="duplicate-source-grid" aria-label="Duplicate source characters">
                <button
                  className={sourceCharacterKey ? "duplicate-source-tile" : "duplicate-source-tile is-active"}
                  type="button"
                  onClick={() => {
                    setSourceCharacterKey("");
                    setDestinationCharacterKey(activeKey);
                    setCreatingCharacter(true);
                  }}
                >
                  Blank
                </button>
                {characterKeys.map((key) => (
                  <button
                    className={sourceCharacterKey === key ? "duplicate-source-tile is-active" : "duplicate-source-tile"}
                    key={key}
                    type="button"
                    onClick={() => {
                      setSourceCharacterKey(key);
                      setDestinationCharacterKey(activeKey);
                      setCreatingCharacter(true);
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <p id="new-character-help" className="form-hint">
                The selected source will replace the current draft for {activeKey}. Save only happens when you click Save character.
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
                  className="button primary"
                  type="button"
                  disabled={!destinationKey || (destinationExists && !replaceExistingCharacter)}
                  onClick={() => {
                    setCreatingCharacter(true);
                    setNewCharacterOpen(false);
                  }}
                >
                  {sourceCharacterKey ? "Use duplicate" : "Start blank"}
                </button>
                <button className="button secondary" type="button" onClick={() => setNewCharacterOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="editor-main">
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
