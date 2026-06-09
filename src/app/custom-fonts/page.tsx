"use client";

import Link from "next/link";
import { Download, FileJson, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { FontGridPreview } from "@/components/FontGridPreview";
import { exportFontJson } from "@/lib/exportUtils";
import { createBlankFont } from "@/lib/fontFactory";
import { useFonts } from "@/lib/useFonts";

export default function CustomFontsPage() {
  const { fonts, deletedFonts, deleteFont, fontBackups, restoreFont, restoreFontBackup, saveFont, persistence } = useFonts();

  function renameFont(fontId: string) {
    const font = fonts.find((item) => item.id === fontId);
    if (!font) return;
    const name = window.prompt("Rename font", font.name);
    if (!name?.trim()) return;
    if (fonts.some((item) => item.id !== font.id && item.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      window.alert("A font with this name already exists.");
      return;
    }
    saveFont({ ...font, name: name.trim() });
  }

  function removeFont(fontId: string) {
    const font = fonts.find((item) => item.id === fontId);
    if (!window.confirm(`Delete ${font?.name ?? "this font"}?`)) return;
    deleteFont(fontId);
  }

  function restoreBackup(backupId: string, fontName: string, createdAt: string) {
    if (!window.confirm(`Restore ${fontName} from ${createdAt.slice(0, 10)}? This will replace the current saved font.`)) {
      return;
    }
    restoreFontBackup(backupId);
  }

  function createFont() {
    if (!persistence.canWrite) {
      window.alert(persistence.message);
      return;
    }

    const name = window.prompt("Name your new font", "New stitch alphabet");
    if (!name?.trim()) return;
    if (fonts.some((font) => font.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      window.alert("A font with this name already exists.");
      return;
    }
    const font = createBlankFont(name.trim());
    saveFont(font);
  }

  return (
    <section className="page-stack">
      <div className="page-heading with-actions">
        <div>
          <span className="eyebrow">Manage fonts</span>
          <h1>Editable lettering alphabets</h1>
          <p>Create shared public fonts that everyone can browse, use, edit, rename or delete.</p>
        </div>
        <button className="button primary" type="button" onClick={createFont} disabled={!persistence.canWrite}>
          <Plus aria-hidden="true" size={18} />
          Create new font
        </button>
      </div>

      <div className="sync-card">
        <div>
          <span className="eyebrow">Font sync</span>
          <p>{persistence.message}</p>
          {persistence.warnings.length ? (
            <ul className="status-list" aria-label="Font sync warnings">
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
              <button className="button secondary" type="button" key={font.id} onClick={() => restoreFont(font.id)}>
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
