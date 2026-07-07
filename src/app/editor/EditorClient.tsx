"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Save, Trash2, X } from "lucide-react";
import { CharacterEditor } from "@/components/CharacterEditor";
import { defaultEditableCharacterKeys, lowercaseCharacters, numberCharacters, punctuationCharacters, uppercaseCharacters } from "@/lib/characterSets";
import type { StitchCharacter } from "@/lib/fontTypes";
import { cloneFont, resizeCharacter, resizeFontCharactersHeight } from "@/lib/gridUtils";
import { useFonts } from "@/lib/useFonts";

type EditorDraftActions = {
  save: () => Promise<boolean>;
  discard: () => void;
};

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

const orderedBaseCharacters = new Set(defaultEditableCharacterKeys);

export function EditorClient() {
  const params = useSearchParams();
  const { fonts, saveFont, deleteFont, persistence } = useFonts();
  const [fontId, setFontId] = useState(params.get("font") ?? "");
  const selectedFont = fonts.find((font) => font.id === fontId) ?? (fontId ? undefined : fonts[0]);
  const characterKeys = Object.keys(selectedFont?.characters ?? {}).sort();
  const otherCharacters = characterKeys.filter((key) => !orderedBaseCharacters.has(key)).sort();
  const displayedCharacterKeys = [...uppercaseCharacters, ...lowercaseCharacters, ...numberCharacters, ...punctuationCharacters, ...otherCharacters];
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
  const [hasUnsavedCharacterChanges, setHasUnsavedCharacterChanges] = useState(false);
  const [pendingExit, setPendingExit] = useState<{ action: () => void } | null>(null);
  const editorDraftActions = useRef<EditorDraftActions | null>(null);
  const activeKey = characterKey;
  const selectedCharacter = activeKey ? selectedFont?.characters[activeKey] : undefined;
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

  const requestCharacterExit = useCallback(
    (action: () => void) => {
      if (!hasUnsavedCharacterChanges) {
        action();
        return;
      }
      setPendingExit({ action });
    },
    [hasUnsavedCharacterChanges]
  );

  useEffect(() => {
    if (!selectedFont) return;
    setFontNameDraft(selectedFont.name);
    setFontHeightDraft(selectedFont.defaultHeight);
    setFontSettingsStatus(null);
  }, [selectedFont]);

  useEffect(() => {
    if (!hasUnsavedCharacterChanges) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedCharacterChanges]);

  useEffect(() => {
    function handleDocumentClick(event: globalThis.MouseEvent) {
      if (!hasUnsavedCharacterChanges || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement) || target.target || target.hasAttribute("download")) return;
      const href = target.href;
      if (!href || href === window.location.href) return;
      event.preventDefault();
      requestCharacterExit(() => {
        window.location.href = href;
      });
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [hasUnsavedCharacterChanges, requestCharacterExit]);

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

  async function saveAndContinue() {
    const saved = await editorDraftActions.current?.save();
    if (!saved || !pendingExit) return;
    setPendingExit(null);
    setHasUnsavedCharacterChanges(false);
    pendingExit.action();
  }

  function discardAndContinue() {
    if (!pendingExit) return;
    editorDraftActions.current?.discard();
    setPendingExit(null);
    setHasUnsavedCharacterChanges(false);
    pendingExit.action();
  }

  function cancelPendingExit() {
    setPendingExit(null);
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
      <h1 className="sr-only">Font Editor</h1>
      <aside className="editor-sidebar editor-font-panel" aria-label="Font settings and font actions">
        <label>
          Font
          <select
            value={selectedFont.id}
            onChange={(event) => {
              const nextFontId = event.target.value;
              requestCharacterExit(() => {
                setFontId(nextFontId);
                setCreatingCharacter(false);
                setSourceCharacterKey("");
                setDestinationCharacterKey("");
                setReplaceExistingCharacter(false);
                setNewCharacterOpen(false);
              });
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
            <p className={fontSettingsStatus.type === "success" ? "success-message compact-status" : "warning compact-status"} role={fontSettingsStatus.type === "success" ? "status" : "alert"} aria-live={fontSettingsStatus.type === "success" ? "polite" : "assertive"}>{fontSettingsStatus.message}</p>
          ) : null}
        </div>

        <div className="danger-zone">
          <span className="eyebrow">Danger zone</span>
          <p>Deletes the full font and all characters permanently.</p>
          <button className="button danger" type="button" onClick={() => requestCharacterExit(removeSelectedFont)}>
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
                    requestCharacterExit(() => {
                      setCharacterKey(key);
                      setDestinationCharacterKey(key);
                      setSourceCharacterKey("");
                      setReplaceExistingCharacter(exists);
                      setCreatingCharacter(false);
                      setNewCharacterOpen(false);
                    });
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
              requestCharacterExit(() => {
                setDestinationCharacterKey(activeKey);
                setSourceCharacterKey("");
                setReplaceExistingCharacter(hasFilledStitches(selectedFont.characters[activeKey]));
                setNewCharacterOpen(true);
              });
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

      {pendingExit ? (
        <div className="modal-backdrop" role="presentation">
          <div className="new-character-modal unsaved-change-dialog" role="dialog" aria-modal="true" aria-labelledby="unsaved-character-title">
            <span className="eyebrow">Unsaved character</span>
            <h2 id="unsaved-character-title">You have unsaved changes to this character.</h2>
            <p>Would you like to save your changes before continuing?</p>
            <div className="button-row unsaved-change-actions">
              <button className="button primary" type="button" onClick={saveAndContinue}>
                <Save aria-hidden="true" size={17} />
                Save &amp; Continue
              </button>
              <button className="button secondary" type="button" onClick={discardAndContinue}>
                Discard Changes
              </button>
              <button className="button ghost" type="button" onClick={cancelPendingExit}>
                Cancel
              </button>
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
          onDirtyChange={setHasUnsavedCharacterChanges}
          onEditorActionsChange={(actions) => {
            editorDraftActions.current = actions;
          }}
          saveDisabled={Boolean(saveDisabledReason)}
          saveDisabledReason={saveDisabledReason}
          saveLabel={creatingCharacter ? "Save new character" : "Save character"}
          headingLabel={creatingCharacter ? "New character" : "Selected character"}
        />
      </section>
    </section>
  );
}
