"use client";

import { useEffect, useRef, useState } from "react";
import type { StitchCharacter } from "@/lib/fontTypes";

type CharacterGridProps = {
  character: StitchCharacter;
  label: string;
  editable?: boolean;
  showGrid?: boolean;
  cellSize?: number;
  onToggle?: (row: number, column: number) => void;
  onSetCell?: (row: number, column: number, filled: boolean) => void;
};

export function CharacterGrid({
  character,
  label,
  editable = false,
  showGrid = true,
  cellSize = 18,
  onToggle,
  onSetCell
}: CharacterGridProps) {
  const [dragFillValue, setDragFillValue] = useState<boolean | null>(null);
  const lastPaintedCell = useRef<string | null>(null);

  useEffect(() => {
    function stopDragging() {
      setDragFillValue(null);
      lastPaintedCell.current = null;
    }

    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  function applyCell(row: number, column: number, filled: boolean) {
    const cellKey = `${row}-${column}`;
    if (lastPaintedCell.current === cellKey) return;
    lastPaintedCell.current = cellKey;
    if (onSetCell) {
      onSetCell(row, column, filled);
      return;
    }
    onToggle?.(row, column);
  }

  function startDrag(row: number, column: number, currentlyFilled: boolean) {
    if (!editable) return;
    const nextFilled = !currentlyFilled;
    setDragFillValue(nextFilled);
    applyCell(row, column, nextFilled);
  }

  function paintUnderPointer(clientX: number, clientY: number) {
    if (!editable || dragFillValue === null) return;
    const target = document.elementFromPoint(clientX, clientY);
    const cell = target instanceof HTMLElement ? target.closest<HTMLButtonElement>("[data-grid-cell='true']") : null;
    if (!cell) return;
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);
    if (!Number.isInteger(row) || !Number.isInteger(column)) return;
    applyCell(row, column, dragFillValue);
  }

  function handleKeyboardToggle(row: number, column: number) {
    if (!editable) return;
    onToggle?.(row, column);
  }

  return (
    <div
      className="stitch-grid"
      aria-label={label}
      role={editable ? "grid" : "img"}
      onPointerMove={(event) => paintUnderPointer(event.clientX, event.clientY)}
      style={{
        gridTemplateColumns: `repeat(${character.width}, ${cellSize}px)`,
        ["--cell-size" as string]: `${cellSize}px`
      }}
    >
      {character.grid.map((row, rowIndex) =>
        Array.from(row).map((cell, columnIndex) => {
          const filled = cell === "1";
          return (
            <button
              key={`${rowIndex}-${columnIndex}`}
              type="button"
              data-grid-cell="true"
              data-row={rowIndex}
              data-column={columnIndex}
              className={`stitch-cell ${filled ? "is-filled" : ""} ${showGrid ? "has-grid" : ""}`}
              aria-label={`${label}, row ${rowIndex + 1}, column ${columnIndex + 1}, ${
                filled ? "filled" : "empty"
              }`}
              aria-pressed={editable ? filled : undefined}
              disabled={!editable}
              onPointerDown={(event) => {
                event.preventDefault();
                startDrag(rowIndex, columnIndex, filled);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                handleKeyboardToggle(rowIndex, columnIndex);
              }}
            />
          );
        })
      )}
    </div>
  );
}
