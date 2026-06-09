"use client";

import { useState } from "react";
import { ClipboardCopy, Download, FileJson } from "lucide-react";
import type { GeneratedPattern } from "@/lib/fontTypes";
import { copyDesignSize, exportPatternJson, exportPatternPng } from "@/lib/exportUtils";

type ExportControlsProps = {
  pattern: GeneratedPattern;
  showGrid: boolean;
  showFilled: boolean;
};

export function ExportControls({ pattern, showGrid, showFilled }: ExportControlsProps) {
  const [message, setMessage] = useState("");
  const canExport = pattern.width > 0 && pattern.height > 0 && pattern.text.trim().length > 0;

  return (
    <div className="export-controls">
      <button
        className="button primary"
        type="button"
        disabled={!canExport}
        onClick={() => {
          try {
            exportPatternPng(pattern, "stitch-lettering-pattern.png", { showGrid, showFilled });
            setMessage("PNG exported.");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Export failed.");
          }
        }}
      >
        <Download aria-hidden="true" size={17} />
        Export PNG
      </button>
      <button
        className="button secondary"
        type="button"
        disabled={!canExport}
        onClick={async () => {
          try {
            await copyDesignSize(pattern);
            setMessage("Design size copied.");
          } catch {
            setMessage(`Width: ${pattern.width} stitches, Height: ${pattern.height} stitches`);
          }
        }}
      >
        <ClipboardCopy aria-hidden="true" size={17} />
        Copy size
      </button>
      <button
        className="button ghost"
        type="button"
        disabled={!canExport}
        onClick={() => {
          exportPatternJson(pattern);
          setMessage("JSON exported.");
        }}
      >
        <FileJson aria-hidden="true" size={17} />
        Export JSON
      </button>
      {message ? <p className="status-text">{message}</p> : null}
    </div>
  );
}
