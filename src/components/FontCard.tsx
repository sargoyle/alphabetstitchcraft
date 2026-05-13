"use client";

import Link from "next/link";
import { Eye, Pencil, Type } from "lucide-react";
import type { StitchFont } from "@/lib/fontTypes";
import { FontGridPreview } from "./FontGridPreview";

type FontCardProps = {
  font: StitchFont;
  onUse: (fontId: string) => void;
  showEdit?: boolean;
};

export function FontCard({ font, onUse, showEdit = false }: FontCardProps) {
  return (
    <article className="tool-card font-card">
      <div className="card-topline">
        <span className="eyebrow">{font.category}</span>
        <span>{font.defaultHeight} stitches high</span>
      </div>
      <h2>{font.name}</h2>
      <p>{font.description}</p>
      <div className="mini-preview">
        <FontGridPreview font={font} />
      </div>
      <div className="button-row">
        <Link className="button secondary" href={`/fonts/${font.id}`}>
          <Eye aria-hidden="true" size={17} />
          View alphabet
        </Link>
        <Link className="button primary" href="/generator" onClick={() => onUse(font.id)}>
          <Type aria-hidden="true" size={17} />
          Use
        </Link>
        {showEdit ? (
          <Link className="button ghost" href={`/editor?font=${font.id}`}>
            <Pencil aria-hidden="true" size={17} />
            Edit
          </Link>
        ) : null}
      </div>
    </article>
  );
}
