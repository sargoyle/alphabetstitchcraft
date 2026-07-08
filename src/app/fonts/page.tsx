"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { FontCard } from "@/components/FontCard";
import { createBlankFont } from "@/lib/fontFactory";
import { saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";

export default function FontsPage() {
  const { fonts, saveFont, persistence } = useFonts();
  const [category, setCategory] = useState("All");
  const [height, setHeight] = useState("All");
  const [search, setSearch] = useState("");
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const isLoadingFonts = persistence.mode === "loading";
  const categories = useMemo(() => ["All", ...Array.from(new Set(fonts.map((font) => font.category)))], [fonts]);
  const heights = useMemo(
    () => ["All", ...Array.from(new Set(fonts.map((font) => font.defaultHeight))).sort((a, b) => a - b).map(String)],
    [fonts]
  );
  const filtered = fonts.filter((font) => {
    const matchesCategory = category === "All" || font.category === category;
    const matchesHeight = height === "All" || font.defaultHeight === Number(height);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query || font.name.toLowerCase().includes(query) || font.description.toLowerCase().includes(query);
    return matchesCategory && matchesHeight && matchesSearch;
  });

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
    const saved = await saveFont(createBlankFont(name.trim()));
    setActionStatus(
      saved
        ? { type: "success", message: "Font changes saved successfully." }
        : { type: "error", message: persistence.message || "Font was not saved." }
    );
  }

  return (
    <section className="page-stack">
      <div className="page-heading with-actions font-library-heading">
        <div>
          <span className="eyebrow">Font library</span>
          <h1>Browse stitch alphabets</h1>
          <p>Filter stitch alphabets, inspect samples and choose a lettering style for your next grid.</p>
        </div>
        <div className="page-action-stack">
          <button
            className="button primary nowrap-button"
            type="button"
            onClick={createFont}
            disabled={!persistence.canWrite || isLoadingFonts}
          >
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

      {isLoadingFonts ? (
        <div className="empty-preview" role="status" aria-live="polite" aria-busy="true">
          Loading alphabet library...
        </div>
      ) : (
        <>
          <div className="toolbar">
            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Height
              <select value={height} onChange={(event) => setHeight(event.target.value)}>
                {heights.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All heights" : `${item} stitches`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Search
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Block, serif, modern" />
            </label>
          </div>

          {filtered.length ? (
            <div className="card-grid">
              {filtered.map((font) => (
                <FontCard
                  key={font.id}
                  font={font}
                  onUse={(fontId) => saveSelectedFontId(fontId)}
                  showEdit
                />
              ))}
            </div>
          ) : (
            <div className="empty-preview">No fonts match this filter.</div>
          )}
        </>
      )}
    </section>
  );
}
