"use client";

import { useEffect, useMemo, useState } from "react";
import { Eraser, Info, RotateCcw, Save } from "lucide-react";
import type { StitchCharacter } from "@/lib/fontTypes";
import { clearCharacter, resizeCharacter, setGridCell, toggleGridCell, validateCharacter } from "@/lib/gridUtils";
import { CharacterGrid } from "./CharacterGrid";

type CharacterEditorProps = {
  characterKey: string;
  character: StitchCharacter;
  originalCharacter: StitchCharacter;
  onSave: (character: StitchCharacter) => void | Promise<boolean | void>;
  saveDisabled?: boolean;
  saveDisabledReason?: string;
  saveLabel?: string;
  headingLabel?: string;
};

export function CharacterEditor({
  characterKey,
  character,
  originalCharacter,
  onSave,
  saveDisabled = false,
  saveDisabledReason,
  saveLabel = "Save character",
  headingLabel = "Selected character"
}: CharacterEditorProps) {
  const [draft, setDraft] = useState(character);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const validation = useMemo(() => validateCharacter(draft, characterKey), [draft, characterKey]);
  const cannotSave = saveDisabled || !validation.valid;

  useEffect(() => {
    setDraft(character);
    setSaveStatus(null);
  }, [character, characterKey]);

  async function handleSave() {
    setSaveStatus(null);

    try {
      const saved = await onSave(draft);
      if (saved === false) {
        setSaveStatus({ type: "error", message: "Database save failed. Font changes were not saved." });
        return;
      }
      setSaveStatus({ type: "success", message: "Font changes saved successfully." });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Database save failed. Font changes were not saved."
      });
    }
  }

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
          <p className="editor-help-card">
            <Info aria-hidden="true" size={16} />
            Character width is edited here. Font height is set once for the whole font in the sidebar.
          </p>

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
            <button className="button primary save-character-button" type="button" disabled={cannotSave} onClick={handleSave}>
              <Save aria-hidden="true" size={17} />
              {saveLabel}
            </button>
          </div>

          {saveStatus ? (
            <p className={saveStatus.type === "success" ? "success-message editor-status-row" : "warning editor-status-row"} role={saveStatus.type === "success" ? "status" : "alert"} aria-live={saveStatus.type === "success" ? "polite" : "assertive"}>{saveStatus.message}</p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}


