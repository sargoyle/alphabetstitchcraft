"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Save, Trash2, X } from "lucide-react";
import { CharacterEditor } from "@/components/CharacterEditor";
import { defaultEditableCharacterKeys, lowercaseCharacters, numberCharacters, punctuationCharacters, uppercaseCharacters } from "@/lib/characterSets";
import { getFontCategoryDescription, mergeFontCategories, normaliseFontCategory } from "@/lib/fontCategories";
import type { StitchCharacter, StitchFont } from "@/lib/fontTypes";
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

function parseFontDimension(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) return { value: null, error: `${label} is required.` };
  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric) || numeric < 1 || numeric > 60) {
    return { value: null, error: `${label} must be a whole number between 1 and 60.` };
  }
  return { value: numeric, error: null };
}

function filledCharacterCount(font: StitchFont | undefined) {
  return Object.values(font?.characters ?? {}).filter(hasFilledStitches).length;
}

const orderedBaseCharacters = new Set(defaultEditableCharacterKeys);
const CUSTOM_CATEGORY_VALUE = "__custom__";

export function EditorClient() {
  const params = useSearchParams();
  const { fonts, saveFont, saveFontCharacter, deleteFont, persistence } = useFonts();
  const [fontId, setFontId] = useState(params.get("font") ?? "");
  const selectedFont = fonts.find((font) => font.id === fontId) ?? (fontId ? undefined : fonts[0]);
  const latestFontRef = useRef(selectedFont);
  const characterKeys = Object.keys(selectedFont?.characters ?? {}).sort();
  const otherCharacters = characterKeys.filter((key) => !orderedBaseCharacters.has(key)).sort();
  const displayedCharacterKeys = [...uppercaseCharacters, ...lowercaseCharacters, ...numberCharacters, ...punctuationCharacters, ...otherCharacters];
  const duplicateSourceKeys = displayedCharacterKeys.filter((key) => hasFilledStitches(selectedFont?.characters[key]));
  const fontCategoryOptions = useMemo(() => mergeFontCategories(fonts.map((font) => font.category)), [fonts]);
  const [characterKey, setCharacterKey] = useState("A");
  const [creatingCharacter, setCreatingCharacter] = useState(false);
  const [sourceCharacterKey, setSourceCharacterKey] = useState("");
  const [destinationCharacterKey, setDestinationCharacterKey] = useState("");
  const [newCharacterDraft, setNewCharacterDraft] = useState<StitchCharacter | null>(null);
  const [replaceExistingCharacter, setReplaceExistingCharacter] = useState(false);
  const [newCharacterOpen, setNewCharacterOpen] = useState(false);
  const [fontNameDraft, setFontNameDraft] = useState("");
  const [fontHeightDraft, setFontHeightDraft] = useState("10");
  const [fontWidthDraft, setFontWidthDraft] = useState("10");
  const [fontCategoryDraft, setFontCategoryDraft] = useState("Block");
  const [customFontCategoryDraft, setCustomFontCategoryDraft] = useState("");
  const [fontSettingsStatus, setFontSettingsStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [savingCharacter, setSavingCharacter] = useState(false);
  const [hasUnsavedCharacterChanges, setHasUnsavedCharacterChanges] = useState(false);
  const [pendingExit, setPendingExit] = useState<{ action: () => void } | null>(null);
  const editorDraftActions = useRef<EditorDraftActions | null>(null);
  const activeKey = characterKey;
  const selectedCharacter = activeKey ? selectedFont?.characters[activeKey] : undefined;
  const destinationKey = creatingCharacter ? firstCharacter(destinationCharacterKey) : activeKey;
  const destinationExists = hasFilledStitches(destinationKey ? selectedFont?.characters[destinationKey] : undefined);
  const sourceCharacter = sourceCharacterKey ? selectedFont?.characters[sourceCharacterKey] : null;
  const resolvedFontCategory = fontCategoryDraft === CUSTOM_CATEGORY_VALUE
    ? normaliseFontCategory(customFontCategoryDraft)
    : normaliseFontCategory(fontCategoryDraft);
  const newCharacter = useMemo(() => {
    if (sourceCharacter) return JSON.parse(JSON.stringify(sourceCharacter)) as StitchCharacter;
    const fontHeight = Math.max(1, Math.min(60, selectedFont?.defaultHeight ?? 10));
    const fontWidth = Math.max(1, Math.min(60, selectedFont?.defaultWidth ?? fontHeight));
    return blankCharacter(fontWidth, fontHeight);
  }, [selectedFont?.defaultHeight, selectedFont?.defaultWidth, sourceCharacter]);
  const activeEditorKey = destinationKey || activeKey || "New unmapped character";
  const character = creatingCharacter
    ? newCharacterDraft ?? newCharacter
    : selectedCharacter && hasFilledStitches(selectedCharacter)
      ? selectedCharacter
      : newCharacter;
  const saveDisabledReason = creatingCharacter
    ? !destinationKey
      ? "Choose a new character before saving."
      : destinationExists && !replaceExistingCharacter && !savingCharacter
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
    const currentFont = latestFontRef.current;
    if (currentFont?.id === selectedFont?.id && filledCharacterCount(currentFont) > filledCharacterCount(selectedFont)) {
      return;
    }
    latestFontRef.current = selectedFont;
  }, [selectedFont]);

  useEffect(() => {
    if (!selectedFont) return;
    const nextCategory = normaliseFontCategory(selectedFont.category);
    setFontNameDraft(selectedFont.name);
    setFontHeightDraft(String(selectedFont.defaultHeight));
    setFontWidthDraft(String(selectedFont.defaultWidth ?? selectedFont.defaultHeight));
    setFontCategoryDraft(fontCategoryOptions.includes(nextCategory) ? nextCategory : CUSTOM_CATEGORY_VALUE);
    setCustomFontCategoryDraft(fontCategoryOptions.includes(nextCategory) ? "" : nextCategory);
    setFontSettingsStatus(null);
  }, [fontCategoryOptions, selectedFont]);

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

  async function applyFontSettings() {
    if (!selectedFont) return;

    const nextName = fontNameDraft.trim();
    const parsedHeight = parseFontDimension(fontHeightDraft, "Font height");
    const parsedWidth = parseFontDimension(fontWidthDraft, "Default character width");
    const nextHeight = parsedHeight.value;
    const nextWidth = parsedWidth.value;
    const nextCategory = resolvedFontCategory;

    if (!nextName) {
      setFontSettingsStatus({ type: "error", message: "Font name is required." });
      return;
    }

    if (!nextCategory) {
      setFontSettingsStatus({ type: "error", message: "Choose or create a font category." });
      return;
    }

    if (parsedHeight.error || nextHeight === null) {
      setFontSettingsStatus({ type: "error", message: parsedHeight.error ?? "Font height is required." });
      return;
    }

    if (parsedWidth.error || nextWidth === null) {
      setFontSettingsStatus({ type: "error", message: parsedWidth.error ?? "Default character width is required." });
      return;
    }

    const baseFont = latestFontRef.current?.id === selectedFont.id ? latestFontRef.current : selectedFont;
    const targetFont = resizeFontCharactersHeight(cloneFont(baseFont), nextHeight);
    targetFont.name = nextName;
    targetFont.category = nextCategory;
    targetFont.defaultWidth = nextWidth;
    targetFont.updatedAt = new Date().toISOString();

    const saved = await saveFont(targetFont);
    setFontSettingsStatus(
      saved
        ? { type: "success", message: "Font settings saved successfully." }
        : { type: "error", message: "Font settings were not saved." }
    );

    if (saved) {
      latestFontRef.current = targetFont;
      setFontId(targetFont.id);
    }
  }

  function saveFontSettings() {
    requestCharacterExit(() => {
      void applyFontSettings();
    });
  }

  async function saveCharacter(updated: StitchCharacter) {
    if (!selectedFont) return false;
    const targetKey = creatingCharacter ? destinationKey : activeKey;
    if (!targetKey) return false;
    if (creatingCharacter && destinationExists && !replaceExistingCharacter) return false;

    const baseFont = latestFontRef.current?.id === selectedFont.id ? latestFontRef.current : selectedFont;
    const targetFont = cloneFont(baseFont);
    targetFont.characters[targetKey] = resizeCharacter(updated, updated.width, targetFont.defaultHeight);
    setSavingCharacter(true);
    let saved = false;
    try {
      saved = await saveFontCharacter(targetFont, targetKey);
    } finally {
      setSavingCharacter(false);
    }
    if (!saved) return false;

    latestFontRef.current = targetFont;
    setFontId(targetFont.id);
    setCharacterKey(targetKey);
    setCreatingCharacter(false);
    setSourceCharacterKey("");
    setDestinationCharacterKey("");
    setNewCharacterDraft(null);
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
                setNewCharacterDraft(null);
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
              max={60}
              value={fontHeightDraft}
              onChange={(event) => {
                setFontHeightDraft(event.target.value);
                setFontSettingsStatus(null);
              }}
            />
          </label>
          <label>
            Default character width
            <input
              type="number"
              min={1}
              max={60}
              value={fontWidthDraft}
              onChange={(event) => {
                setFontWidthDraft(event.target.value);
                setFontSettingsStatus(null);
              }}
            />
          </label>
          <label>
            Category
            <select
              value={fontCategoryDraft}
              onChange={(event) => {
                setFontCategoryDraft(event.target.value);
                setFontSettingsStatus(null);
              }}
            >
              {fontCategoryOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
              <option value={CUSTOM_CATEGORY_VALUE}>New category...</option>
            </select>
          </label>
          {fontCategoryDraft === CUSTOM_CATEGORY_VALUE ? (
            <label>
              New category name
              <input
                value={customFontCategoryDraft}
                onChange={(event) => {
                  setCustomFontCategoryDraft(event.target.value);
                  setFontSettingsStatus(null);
                }}
                placeholder="For example: Holiday"
              />
            </label>
          ) : null}
          <p className="form-hint">{getFontCategoryDescription(resolvedFontCategory)}</p>
          <p className="form-hint">Height applies to every character. Default width sets the starting grid for new characters only.</p>
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
                      setNewCharacterDraft(null);
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
                setNewCharacterDraft(null);
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
                    setNewCharacterDraft(blankCharacter(selectedFont.defaultWidth ?? selectedFont.defaultHeight, selectedFont.defaultHeight));
                    setCreatingCharacter(true);
                    setNewCharacterOpen(false);
                  }}
                >
                  Blank
                </button>
                {duplicateSourceKeys.map((key) => (
                  <button
                    className={sourceCharacterKey === key ? "duplicate-source-tile is-active" : "duplicate-source-tile"}
                    key={key}
                    type="button"
                    onClick={() => {
                      setSourceCharacterKey(key);
                      setDestinationCharacterKey(activeKey);
                      setNewCharacterDraft(JSON.parse(JSON.stringify(selectedFont.characters[key])) as StitchCharacter);
                      setCreatingCharacter(true);
                      setNewCharacterOpen(false);
                    }}
                  >
                    {key}
                  </button>
                ))}
                {duplicateSourceKeys.length === 0 ? (
                  <p className="form-hint duplicate-source-empty">No existing character designs are available to duplicate.</p>
                ) : null}
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
          key={`${selectedFont.id}-${creatingCharacter ? `new-${destinationKey || activeKey || "blank"}` : activeKey}`}
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




