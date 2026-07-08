"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eraser, RotateCcw, Save } from "lucide-react";
import type { StitchCharacter } from "@/lib/fontTypes";
import { clearCharacter, resizeCharacter, setGridCell, toggleGridCell, validateCharacter } from "@/lib/gridUtils";
import { CharacterGrid } from "./CharacterGrid";

type EditorDraftActions = {
  save: () => Promise<boolean>;
  discard: () => void;
};

type CharacterEditorProps = {
  characterKey: string;
  character: StitchCharacter;
  originalCharacter: StitchCharacter;
  onSave: (character: StitchCharacter) => void | Promise<boolean | void>;
  onDirtyChange?: (dirty: boolean) => void;
  onEditorActionsChange?: (actions: EditorDraftActions | null) => void;
  saveDisabled?: boolean;
  saveDisabledReason?: string;
  saveLabel?: string;
  headingLabel?: string;
};

function serialiseCharacter(character: StitchCharacter) {
  return `${character.width}x${character.height}:${character.grid.join("|")}`;
}

export function CharacterEditor({
  characterKey,
  character,
  originalCharacter,
  onSave,
  onDirtyChange,
  onEditorActionsChange,
  saveDisabled = false,
  saveDisabledReason,
  saveLabel = "Save character",
  headingLabel = "Selected character"
}: CharacterEditorProps) {
  const [draft, setDraft] = useState(character);
  const [baseline, setBaseline] = useState(character);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | "saving"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const validation = useMemo(() => validateCharacter(draft, characterKey), [draft, characterKey]);
  const cannotSave = saveDisabled || !validation.valid || isSaving;
  const dirty = serialiseCharacter(draft) !== serialiseCharacter(baseline);

  useEffect(() => {
    setDraft(character);
    setBaseline(character);
    setSaveStatus(null);
  }, [character, characterKey]);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (saveStatus?.type !== "success") return;
    const timer = window.setTimeout(() => setSaveStatus(null), 3200);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  const handleSave = useCallback(async () => {
    setSaveStatus(null);

    if (isSaving) return false;
    if (cannotSave) {
      setSaveStatus({ type: "error", message: saveDisabledReason ?? validation.errors.join(" ") });
      return false;
    }

    setIsSaving(true);
    setSaveStatus({ type: "saving", message: "Saving character..." });

    try {
      const saved = await onSave(draft);
      if (saved === false) {
        setSaveStatus({ type: "error", message: "Database save failed. Font changes were not saved." });
        return false;
      }
      setBaseline(draft);
      onDirtyChange?.(false);
      setSaveStatus({ type: "success", message: "Font changes saved successfully." });
      return true;
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Database save failed. Font changes were not saved."
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [cannotSave, draft, isSaving, onDirtyChange, onSave, saveDisabledReason, validation.errors]);

  const discardDraft = useCallback(() => {
    setDraft(baseline);
    setSaveStatus(null);
    onDirtyChange?.(false);
  }, [baseline, onDirtyChange]);

  useEffect(() => {
    onEditorActionsChange?.({ save: handleSave, discard: discardDraft });
    return () => onEditorActionsChange?.(null);
  }, [discardDraft, handleSave, onEditorActionsChange]);

  return (
    <div className="editor-panel character-editor-shell">
      <div className="editor-heading character-editor-heading">
        <div>
          <span className="eyebrow">{headingLabel}</span>
          <h2>{characterKey}</h2>
        </div>
        <span className="dimension-pill">
          {draft.width} x {draft.height}
        </span>
      </div>

      <div className="editor-divider" />

      <div className="character-editor-layout">
        <div className="character-grid-stack">
          <div className="character-grid-stage">
            <CharacterGrid
              character={draft}
              label={`Editable character ${characterKey}`}
              editable
              showGrid
              cellSize={28}
              onToggle={(row, column) => setDraft((current) => toggleGridCell(current, row, column))}
              onSetCell={(row, column, filled) => setDraft((current) => setGridCell(current, row, column, filled))}
            />
          </div>

          <div className="control-panel dimension-controls">
            <label>
              Width
              <input
                type="number"
                min={1}
                max={24}
                value={draft.width}
                onChange={(event) =>
                  setDraft((current) => resizeCharacter(current, Number(event.target.value), current.height))
                }
              />
            </label>
          </div>
        </div>

        <aside className="character-editor-controls" aria-label="Character save controls">
          {validation.errors.length ? (<p className="warning" role="alert" aria-live="assertive">{validation.errors.join(" ")}</p>) : null}
          {saveDisabledReason ? (<p className="warning" role="alert" aria-live="assertive">{saveDisabledReason}</p>) : null}

          <div className="editor-footer">
            <div className="button-row editor-actions">
              <button className="button secondary" type="button" onClick={() => setDraft(originalCharacter)}>
                <RotateCcw aria-hidden="true" size={17} />
                Reset
              </button>
              <button className="button secondary" type="button" onClick={() => setDraft(clearCharacter(draft))}>
                <Eraser aria-hidden="true" size={17} />
                Clear
              </button>
            </div>
            <button
              className="button primary save-character-button"
              type="button"
              disabled={cannotSave}
              aria-busy={isSaving}
              onClick={handleSave}
            >
              <Save aria-hidden="true" size={17} />
              {isSaving ? "Saving..." : saveLabel}
            </button>
          </div>
        </aside>
      </div>

      {saveStatus ? (
        <p className={saveStatus.type === "success" || saveStatus.type === "saving" ? "success-message editor-floating-status" : "warning editor-floating-status"} role={saveStatus.type === "error" ? "alert" : "status"} aria-live={saveStatus.type === "error" ? "assertive" : "polite"}>{saveStatus.message}</p>
      ) : null}
    </div>
  );
}
