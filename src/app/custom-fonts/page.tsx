"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileJson, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { FontGridPreview } from "@/components/FontGridPreview";
import { exportFontJson } from "@/lib/exportUtils";
import { createBlankFont } from "@/lib/fontFactory";
import { useFonts } from "@/lib/useFonts";

export default function CustomFontsPage() {
  const { fonts, deletedFonts, deleteFont, fontBackups, restoreFont, restoreFontBackup, saveFont, persistence } = useFonts();
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function renameFont(fontId: string) {
    setActionStatus(null);
    const font = fonts.find((item) => item.id === fontId);
    if (!font) return;
    const name = window.prompt("Rename font", font.name);
    if (!name?.trim()) return;
    if (fonts.some((item) => item.id !== font.id && item.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setActionStatus({ type: "error", message: "A font with this name already exists." });
      return;
    }
    const saved = await saveFont({ ...font, name: name.trim() });
    setActionStatus(
      saved
        ? { type: "success", message: "Font changes saved successfully." }
        : { type: "error", message: persistence.message || "Font was not saved." }
    );
  }

  async function removeFont(fontId: string) {
    setActionStatus(null);
    const font = fonts.find((item) => item.id === fontId);
    if (!window.confirm(`Delete ${font?.name ?? "this font"}?`)) return;
    const deleted = await deleteFont(fontId);
    setActionStatus(
      deleted
        ? { type: "success", message: "Font deleted successfully." }
        : { type: "error", message: persistence.message || "Font was not deleted." }
    );
  }

  async function restoreBackup(backupId: string, fontName: string, createdAt: string) {
    setActionStatus(null);
    if (!window.confirm(`Restore ${fontName} from ${createdAt.slice(0, 10)}? This will replace the current saved font.`)) {
      return;
    }
    const restored = await restoreFontBackup(backupId);
    setActionStatus(
      restored
        ? { type: "success", message: "Font backup restored successfully." }
        : { type: "error", message: persistence.message || "Font backup was not restored." }
    );
  }

  async function createFont() {
    setActionStatus(null);
    if (!persistence.canWrite) {
      setActionStatus({ type: "error", message: persistence.message });
      return;
    }

    const name = window.prompt("Name your new font", "New stitch alphabet");
    if (!name?.trim()) return;
    if (fonts.some((font) => font.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setActionStatus({ type: "error", message: "A font with this name already exists." });
      return;
    }
    const font = createBlankFont(name.trim());
    const saved = await saveFont(font);
    setActionStatus(
      saved
        ? { type: "success", message: "Font changes saved successfully." }
        : { type: "error", message: persistence.message || "Font was not saved." }
    );
  }

  return (
    <section className="page-stack">
      <div className="page-heading with-actions">
        <div>
          <span className="eyebrow">Manage fonts</span>
          <h1>Editable lettering alphabets</h1>
          <p>Create shared public fonts that everyone can browse, use, edit, rename or delete.</p>
        </div>
        <div className="page-action-stack">
          <button className="button primary" type="button" onClick={createFont} disabled={!persistence.canWrite}>
            <Plus aria-hidden="true" size={18} />
            Create new font
          </button>
          {actionStatus ? (
            <p
              className={actionStatus.type === "success" ? "success-message compact-status" : "warning compact-status"}
              role={actionStatus.type === "success" ? "status" : "alert"}
              aria-live={actionStatus.type === "success" ? "polite" : "assertive"}
            >
              {actionStatus.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="sync-card">
        <div>
          <span className="eyebrow">Font sync</span>
          <p role="status" aria-live="polite">{persistence.message}</p>
          {persistence.warnings.length ? (
            <ul className="status-list" aria-label="Font sync warnings" role="alert" aria-live="assertive">
              {persistence.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {fonts.length ? (
        <div className="card-grid">
          {fonts.map((font) => (
            <article className="tool-card" key={font.id}>
              <div className="card-topline">
                <span className="eyebrow">{font.category}</span>
                <span>{Object.keys(font.characters).length} characters</span>
              </div>
              <h2>{font.name}</h2>
              <p>
                Editable shared alphabet. Last saved{" "}
                {font.updatedAt?.slice(0, 10) ?? "after database sync"}.
              </p>
              <div className="mini-preview">
                <FontGridPreview font={font} />
              </div>
              {fontBackups[font.id]?.length ? (
                <div className="backup-list">
                  <span className="eyebrow">Recent backups</span>
                  {fontBackups[font.id].slice(0, 3).map((backup) => (
                    <button
                      className="button secondary"
                      type="button"
                      key={backup.id}
                      onClick={() => restoreBackup(backup.id, backup.fontName, backup.createdAt)}
                    >
                      <RotateCcw aria-hidden="true" size={17} />
                      Restore {backup.createdAt.slice(0, 10)}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="button-row">
                <Link className="button primary" href={`/editor?font=${font.id}`}>
                  <Pencil aria-hidden="true" size={17} />
                  Edit
                </Link>
                <button className="button ghost" type="button" onClick={() => renameFont(font.id)}>
                  <Pencil aria-hidden="true" size={17} />
                  Rename
                </button>
                <button className="button secondary" type="button" onClick={() => exportFontJson(font)}>
                  <FileJson aria-hidden="true" size={17} />
                  Export JSON
                </button>
                <button className="button danger" type="button" onClick={() => removeFont(font.id)}>
                  <Trash2 aria-hidden="true" size={17} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-preview">
          <p>No fonts are currently active.</p>
          <Link className="button primary" href="/fonts">
            <Download aria-hidden="true" size={17} />
            Restore fonts
          </Link>
        </div>
      )}

      {deletedFonts.length ? (
        <section className="restore-panel">
          <div>
            <span className="eyebrow">Deleted fonts</span>
            <h2>Restore removed alphabets</h2>
          </div>
          <div className="button-row">
            {deletedFonts.map((font) => (
              <button
                className="button secondary"
                type="button"
                key={font.id}
                onClick={async () => {
                  setActionStatus(null);
                  const restored = await restoreFont(font.id);
                  setActionStatus(
                    restored
                      ? { type: "success", message: "Font restored successfully." }
                      : { type: "error", message: persistence.message || "Font was not restored." }
                  );
                }}
              >
                <RotateCcw aria-hidden="true" size={17} />
                Restore {font.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
