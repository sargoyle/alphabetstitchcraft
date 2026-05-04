import type { GeneratedPattern } from "@/lib/fontTypes";

type TextPatternPreviewProps = {
  pattern: GeneratedPattern;
  showGrid: boolean;
  showFilled: boolean;
  zoom: number;
};

export function TextPatternPreview({ pattern, showGrid, showFilled, zoom }: TextPatternPreviewProps) {
  const cellSize = Math.max(8, Math.min(34, zoom));

  if (!pattern.text.trim()) {
    return (
      <div className="empty-preview">
        <span>Type lettering to preview the stitch grid.</span>
      </div>
    );
  }

  return (
    <div className="pattern-scroll" aria-label="Generated stitch pattern preview">
      <div
        className="pattern-grid"
        style={{
          gridTemplateColumns: `repeat(${Math.max(1, pattern.width)}, ${cellSize}px)`,
          ["--cell-size" as string]: `${cellSize}px`
        }}
      >
        {pattern.grid.map((row, rowIndex) =>
          Array.from(row).map((cell, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={`pattern-cell ${showGrid ? "has-grid" : ""} ${
                showFilled && cell === "1" ? "is-filled" : ""
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
}

