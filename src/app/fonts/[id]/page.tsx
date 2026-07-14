"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CharacterGrid } from "@/components/CharacterGrid";
import { getCharacterGroups } from "@/lib/fonts";
import { saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";

function hasFilledStitches(character: { grid: string[] } | undefined) {
  return Boolean(character?.grid.some((row) => row.includes("1")));
}

function getPreviewCellSize(width: number, height: number) {
  const maxCells = Math.max(width, height);
  const availableCellPixels = 112;
  return Math.max(3, Math.min(14, Math.floor(availableCellPixels / maxCells)));
}

export default function FontDetailPage() {
  const params = useParams<{ id: string }>();
  const { fonts } = useFonts();
  const font = fonts.find((item) => item.id === params.id);

  if (!font) {
    return (
      <section className="page-stack">
        <div className="empty-preview">
          <p>Font not found.</p>
          <Link className="button primary" href="/fonts">
            Back to font library
          </Link>
        </div>
      </section>
    );
  }

  const groups = Object.fromEntries(
    Object.entries(getCharacterGroups(font)).map(([groupName, keys]) => [
      groupName,
      keys.filter((key) => hasFilledStitches(font.characters[key]))
    ])
  );
  const hasCreatedCharacters = Object.values(groups).some((keys) => keys.length > 0);

  return (
    <section className="page-stack">
      <div className="page-heading with-actions font-detail-heading">
        <div>
          <span className="eyebrow">{font.category}</span>
          <h1>{font.name}</h1>
          <p>{font.description}</p>
          <p className="font-detail-meta">Height: {font.defaultHeight} stitches</p>
        </div>
        <div className="button-row font-detail-actions">
          <Link className="button primary" href="/generator" onClick={() => saveSelectedFontId(font.id)}>
            Use in generator
          </Link>
        </div>
      </div>

      {!hasCreatedCharacters ? (
        <div className="empty-preview">No characters have been created for this font yet.</div>
      ) : null}

      {Object.entries(groups).map(([groupName, keys]) =>
        keys.length ? (
          <section className="character-section" key={groupName}>
            <h2>{groupName}</h2>
            <div className="alphabet-grid">
              {keys.map((key) => {
                const character = font.characters[key];
                const cellSize = getPreviewCellSize(character.width, character.height);
                return (
                  <article className="character-card" key={key}>
                    <div className="card-topline">
                      <strong>{key}</strong>
                      <span>
                        {character.width} x {character.height}
                      </span>
                    </div>
                    <CharacterGrid character={character} label={`${font.name} character ${key}`} cellSize={cellSize} />
                  </article>
                );
              })}
            </div>
          </section>
        ) : null
      )}
    </section>
  );
}
