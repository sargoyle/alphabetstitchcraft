"use client";

import { useMemo, useState } from "react";
import { Eraser, RotateCcw, Save } from "lucide-react";
import type { StitchCharacter } from "@/lib/fontTypes";
import { clearCharacter, resizeCharacter, setGridCell, toggleGridCell, validateCharacter } from "@/lib/gridUtils";
import { CharacterGrid } from "./CharacterGrid";

type CharacterEditorProps = {
  characterKey: string;
  character: StitchCharacter;
  originalCharacter: StitchCharacter;
  onSave: (character: StitchCharacter) => void;
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
  const validation = useMemo(() => validateCharacter(draft, characterKey), [draft, characterKey]);
  const cannotSave = saveDisabled || !validation.valid;

  return (
    <div className="editor-panel">
      <div className="editor-heading">
        <div>
          <span className="eyebrow">{headingLabel}</span>
          <h2>{characterKey}</h2>
        </div>
        <span className="dimension-pill">
          {draft.width} x {draft.height}
        </span>
      </div>

      <CharacterGrid
        character={draft}
        label={`Editable character ${characterKey}`}
        editable
        showGrid
        cellSize={28}
        onToggle={(row, column) => setDraft((current) => toggleGridCell(current, row, column))}
        onSetCell={(row, column, filled) => setDraft((current) => setGridCell(current, row, column, filled))}
      />

      <div className="control-panel compact">
        <label>
          Width
          <input
            type="number"
            min={1}
            max={24}
            value={draft.width}
            onChange={(event) => setDraft((current) => resizeCharacter(current, Number(event.target.value), current.height))}
          />
        </label>
        <label>
          Height
          <input
            type="number"
            min={1}
            max={24}
            value={draft.height}
            onChange={(event) => setDraft((current) => resizeCharacter(current, current.width, Number(event.target.value)))}
          />
        </label>
      </div>

      {validation.errors.length ? <p className="warning">{validation.errors.join(" ")}</p> : null}
      {saveDisabledReason ? <p className="warning">{saveDisabledReason}</p> : null}

      <div className="button-row editor-actions">
        <button className="button secondary" type="button" onClick={() => setDraft(clearCharacter(draft))}>
          <Eraser aria-hidden="true" size={17} />
          Clear
        </button>
        <button className="button secondary" type="button" onClick={() => setDraft(originalCharacter)}>
          <RotateCcw aria-hidden="true" size={17} />
          Reset
        </button>
        <button className="button primary" type="button" disabled={cannotSave} onClick={() => onSave(draft)}>
          <Save aria-hidden="true" size={17} />
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
