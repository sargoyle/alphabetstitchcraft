"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { FontCard } from "@/components/FontCard";
import { createBlankFont } from "@/lib/fontFactory";
import { fontCategoryDefinitions, getFontCategoryDescription, mergeFontCategories, normaliseFontCategory } from "@/lib/fontCategories";
import { saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";

const CUSTOM_CATEGORY_VALUE = "__custom__";

export default function FontsPage() {
  const { fonts, saveFont, persistence } = useFonts();
  const [category, setCategory] = useState("All");
  const [height, setHeight] = useState("All");
  const [search, setSearch] = useState("");
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newFontName, setNewFontName] = useState("New stitch alphabet");
  const [newFontCategory, setNewFontCategory] = useState("Block");
  const [newFontCustomCategory, setNewFontCustomCategory] = useState("");
  const [newFontHeight, setNewFontHeight] = useState("10");
  const [newFontWidth, setNewFontWidth] = useState("10");
  const isLoadingFonts = persistence.mode === "loading";
  const categories = useMemo(() => ["All", ...mergeFontCategories(fonts.map((font) => font.category))], [fonts]);
  const categoryOptions = useMemo(() => mergeFontCategories(fonts.map((font) => font.category)), [fonts]);
  const heights = useMemo(
    () => ["All", ...Array.from(new Set(fonts.map((font) => font.defaultHeight))).sort((a, b) => a - b).map(String)],
    [fonts]
  );
  const resolvedNewFontCategory = newFontCategory === CUSTOM_CATEGORY_VALUE
    ? normaliseFontCategory(newFontCustomCategory)
    : normaliseFontCategory(newFontCategory);
  const filtered = fonts.filter((font) => {
    const matchesCategory = category === "All" || font.category === category;
    const matchesHeight = height === "All" || font.defaultHeight === Number(height);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query || font.name.toLowerCase().includes(query) || font.description.toLowerCase().includes(query);
    return matchesCategory && matchesHeight && matchesSearch;
  });

  function openCreateFont() {
    setActionStatus(null);
    setNewFontName("New stitch alphabet");
    setNewFontCategory(category !== "All" ? category : "Block");
    setNewFontCustomCategory("");
    setNewFontHeight("10");
    setNewFontWidth("10");
    setCreateOpen(true);
  }

  async function createFont() {
    setActionStatus(null);
    if (!persistence.canWrite) {
      setActionStatus({ type: "error", message: persistence.message });
      return;
    }

    const name = newFontName.trim();
    const categoryName = resolvedNewFontCategory;
    const heightValue = Number(newFontHeight);
    const widthValue = Number(newFontWidth);

    if (!name) {
      setActionStatus({ type: "error", message: "Font name is required." });
      return;
    }
    if (!categoryName) {
      setActionStatus({ type: "error", message: "Choose or create a font category." });
      return;
    }
    if (!newFontHeight.trim() || !Number.isInteger(heightValue) || heightValue < 1 || heightValue > 60) {
      setActionStatus({ type: "error", message: "Font height must be a whole number between 1 and 60." });
      return;
    }
    if (!newFontWidth.trim() || !Number.isInteger(widthValue) || widthValue < 1 || widthValue > 60) {
      setActionStatus({ type: "error", message: "Default character width must be a whole number between 1 and 60." });
      return;
    }
    if (fonts.some((font) => font.name.trim().toLowerCase() === name.toLowerCase())) {
      setActionStatus({ type: "error", message: "A font with this name already exists." });
      return;
    }

    const saved = await saveFont(createBlankFont(name, { category: categoryName, height: heightValue, width: widthValue }));
    setActionStatus(
      saved
        ? { type: "success", message: "Font changes saved successfully." }
        : { type: "error", message: persistence.message || "Font was not saved." }
    );
    if (saved) setCreateOpen(false);
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
            onClick={openCreateFont}
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

          <details className="category-guide">
            <summary>What do the categories mean?</summary>
            <div className="category-definition-list">
              {fontCategoryDefinitions.map((item) => (
                <p key={item.name}>
                  <strong>{item.name}:</strong> {item.description}
                </p>
              ))}
            </div>
          </details>

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

      {createOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="new-character-modal create-font-modal" role="dialog" aria-modal="true" aria-labelledby="create-font-title">
            <button
              className="icon-button modal-close"
              type="button"
              aria-label="Close create font dialog"
              onClick={() => setCreateOpen(false)}
            >
              <X aria-hidden="true" size={18} />
            </button>
            <span className="eyebrow">Create font</span>
            <h2 id="create-font-title">New stitch alphabet</h2>
            <label>
              Font name
              <input value={newFontName} onChange={(event) => setNewFontName(event.target.value)} />
            </label>
            <label>
              Category
              <select value={newFontCategory} onChange={(event) => setNewFontCategory(event.target.value)}>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value={CUSTOM_CATEGORY_VALUE}>New category...</option>
              </select>
            </label>
            {newFontCategory === CUSTOM_CATEGORY_VALUE ? (
              <label>
                New category name
                <input
                  value={newFontCustomCategory}
                  onChange={(event) => setNewFontCustomCategory(event.target.value)}
                  placeholder="For example: Holiday"
                />
              </label>
            ) : null}
            <p className="form-hint">{getFontCategoryDescription(resolvedNewFontCategory)}</p>
            <label>
              Font height
              <input
                type="number"
                min={1}
                max={60}
                value={newFontHeight}
                onChange={(event) => setNewFontHeight(event.target.value)}
              />
            </label>
            <label>
              Default character width
              <input
                type="number"
                min={1}
                max={60}
                value={newFontWidth}
                onChange={(event) => setNewFontWidth(event.target.value)}
              />
            </label>
            <div className="button-row">
              <button className="button primary" type="button" onClick={createFont}>
                Create font
              </button>
              <button className="button secondary" type="button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}