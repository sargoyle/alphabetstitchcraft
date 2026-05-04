"use client";

import Link from "next/link";
import { Download, FileJson, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { FontGridPreview } from "@/components/FontGridPreview";
import { exportFontJson } from "@/lib/exportUtils";
import type { FontCategory, StitchCharacter, StitchFont } from "@/lib/fontTypes";
import { useFonts } from "@/lib/useFonts";

const alphabetKeys = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  ".",
  ",",
  "!",
  "?",
  "'",
  "-",
  "&"
];

function blankCharacter(width = 8, height = 10): StitchCharacter {
  return {
    width,
    height,
    grid: Array.from({ length: height }, () => "0".repeat(width))
  };
}

function createBlankFont(name: string): StitchFont {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    description: "A blank editable alphabet ready for drawing on the character grid.",
    category: "Block" as FontCategory,
    defaultHeight: 10,
    recommendedUse: "Custom lettering alphabets, experiments and personal stitch styles",
    licence: "User-created public font",
    isCustom: true,
    createdAt: now,
    updatedAt: now,
    characters: Object.fromEntries(alphabetKeys.map((key) => [key, blankCharacter()]))
  };
}

export default function CustomFontsPage() {
  const { fonts, deletedFonts, deleteFont, restoreFont, saveFont, persistence } = useFonts();

  function renameFont(fontId: string) {
    const font = fonts.find((item) => item.id === fontId);
    if (!font) return;
    const name = window.prompt("Rename font", font.name);
    if (!name?.trim()) return;
    saveFont({ ...font, name: name.trim() });
  }

  function removeFont(fontId: string) {
    const font = fonts.find((item) => item.id === fontId);
    if (!window.confirm(`Delete ${font?.name ?? "this font"}?`)) return;
    deleteFont(fontId);
  }

  function createFont() {
    if (!persistence.canWrite) {
      window.alert(persistence.message);
      return;
    }

    const name = window.prompt("Name your new font", "New stitch alphabet");
    if (!name?.trim()) return;
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
