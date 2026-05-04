"use client";

import { useMemo, useState } from "react";
import { FontCard } from "@/components/FontCard";
import { saveSelectedFontId } from "@/lib/localStorageUtils";
import { useFonts } from "@/lib/useFonts";

export default function FontsPage() {
  const { fonts } = useFonts();
  const [category, setCategory] = useState("All");
  const [height, setHeight] = useState("All");
  const [search, setSearch] = useState("");
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

  return (
    <section className="page-stack">
      <div className="page-heading">
        <span className="eyebrow">Font library</span>
        <h1>Browse stitch alphabets</h1>
        <p>Filter stitch alphabets, inspect samples and choose a lettering style for your next grid.</p>
      </div>

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
            />
          ))}
        </div>
      ) : (
        <div className="empty-preview">No fonts match this filter.</div>
      )}

    </section>
  );
}
