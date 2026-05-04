"use client";

import type { TextAlignment } from "@/lib/fontTypes";

type SpacingControlsProps = {
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  alignment: TextAlignment;
  showGrid: boolean;
  showFilled: boolean;
  zoom: number;
  onChange: (updates: Partial<Omit<SpacingControlsProps, "onChange">>) => void;
};

export function SpacingControls(props: SpacingControlsProps) {
  const { letterSpacing, wordSpacing, lineSpacing, alignment, showGrid, showFilled, zoom, onChange } = props;

  return (
    <div className="control-panel">
      <label>
        Letter spacing
        <input
          type="number"
          min={0}
          max={8}
          value={letterSpacing}
          onChange={(event) => onChange({ letterSpacing: Number(event.target.value) })}
        />
      </label>
      <label>
        Word spacing
        <input
          type="number"
          min={1}
          max={16}
          value={wordSpacing}
          onChange={(event) => onChange({ wordSpacing: Number(event.target.value) })}
        />
      </label>
      <label>
        Line spacing
        <input
          type="number"
          min={0}
          max={12}
          value={lineSpacing}
          onChange={(event) => onChange({ lineSpacing: Number(event.target.value) })}
        />
      </label>
      <fieldset>
        <legend>Alignment</legend>
        <div className="segmented">
          {(["left", "center", "right"] as TextAlignment[]).map((item) => (
            <button
              key={item}
              type="button"
              className={alignment === item ? "is-active" : ""}
              onClick={() => onChange({ alignment: item })}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="switch-row">
        <input type="checkbox" checked={showGrid} onChange={(event) => onChange({ showGrid: event.target.checked })} />
        Show grid
      </label>
      <label className="switch-row">
        <input
          type="checkbox"
          checked={showFilled}
          onChange={(event) => onChange({ showFilled: event.target.checked })}
        />
        Show stitches
      </label>
      <label>
        Zoom
        <input
          type="range"
          min={8}
          max={34}
          value={zoom}
          onChange={(event) => onChange({ zoom: Number(event.target.value) })}
        />
      </label>
    </div>
  );
}
