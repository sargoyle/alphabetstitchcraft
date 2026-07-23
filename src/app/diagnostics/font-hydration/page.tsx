"use client";

import { useEffect, useState } from "react";
import { loadFontHydrationDiagnostics, type FontHydrationDiagnosticResult } from "@/lib/fontPersistence";

const defaultFocusFonts = ["Deco"];

function joinKeys(keys: string[]) {
  return keys.length ? keys.join(" ") : "(none)";
}

export default function FontHydrationDiagnosticsPage() {
  const [report, setReport] = useState<FontHydrationDiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadFontHydrationDiagnostics()
      .then((result) => {
        if (!cancelled) setReport(result);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Font hydration diagnostic failed.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const diagnostics = report?.diagnostics ?? [];
  const focusedDiagnostics = diagnostics.filter((item) =>
    defaultFocusFonts.some((name) => item.fontName.toLowerCase() === name.toLowerCase())
  );
  const otherDiagnostics = diagnostics
    .filter((item) => !focusedDiagnostics.some((focused) => focused.fontId === item.fontId))
    .slice(0, 12);

  return (
    <section className="page-stack diagnostic-page">
      <div className="page-heading">
        <span className="eyebrow">Diagnostics</span>
        <h1>Font hydration report</h1>
        <p>
          Temporary database-to-app comparison for saved font characters. This page shows public font metadata only and
          does not expose secret keys.
        </p>
      </div>

      {error ? <p className="warning" role="alert">{error}</p> : null}
      {!report && !error ? <div className="empty-preview">Loading font hydration diagnostics...</div> : null}

      {report ? (
        <>
          <div className="tool-card">
            <h2>Environment</h2>
            <p>Generated: {report.generatedAt}</p>
            <p>Supabase host: {report.supabaseHost ?? "(not configured)"}</p>
            {report.customCharacterRowLoad ? (
              <>
                <p>
                  Custom character rows loaded: {report.customCharacterRowLoad.loadedRowCount}
                  {typeof report.customCharacterRowLoad.databaseRowCount === "number"
                    ? ` of ${report.customCharacterRowLoad.databaseRowCount}`
                    : ""}
                </p>
                <p>Character row page size: {report.customCharacterRowLoad.pageSize}</p>
              </>
            ) : null}
            <p>Duplicate font records: {report.duplicateFontRecords.length}</p>
            <p>Invalid fonts: {report.invalidFonts.length}</p>
          </div>

          {report.customCharacterRowLoad?.partialLoad ? (
            <p className="warning" role="alert">
              Warning: only {report.customCharacterRowLoad.loadedRowCount} of{" "}
              {report.customCharacterRowLoad.databaseRowCount ?? "unknown"} custom character rows loaded. Saved
              characters may be hidden until the loader pagination issue is fixed.
            </p>
          ) : null}

          {report.duplicateFontRecords.length ? (
            <div className="tool-card">
              <h2>Duplicate font records</h2>
              {report.duplicateFontRecords.map((duplicate) => (
                <p key={duplicate.name}>
                  <strong>{duplicate.name}</strong>:{" "}
                  {duplicate.records.map((record) => `${record.sourceTable}:${record.id}`).join(", ")}
                </p>
              ))}
            </div>
          ) : null}

          {[...focusedDiagnostics, ...otherDiagnostics].map((item) => (
            <article className="tool-card diagnostic-card" key={`${item.sourceTable}-${item.fontId}`}>
              <div className="card-topline">
                <span className="eyebrow">{item.sourceTable}</span>
                <span>{item.fontId}</span>
              </div>
              <h2>{item.fontName}</h2>
              <dl className="diagnostic-grid">
                <dt>Supabase character rows</dt>
                <dd>{item.supabaseCharacterRowCount}</dd>
                <dt>Filled keys in Supabase</dt>
                <dd>{joinKeys(item.supabaseCharacterKeys)}</dd>
                <dt>Loaded model character keys</dt>
                <dd>{item.loadedCharacterKeyCount}</dd>
                <dt>Filled keys in UI model</dt>
                <dd>{joinKeys(item.loadedCharacterKeys)}</dd>
                <dt>Supabase filled keys missing from UI model</dt>
                <dd>{joinKeys(item.missingFromUiModel)}</dd>
                <dt>Supabase filled keys blank in UI model</dt>
                <dd>{joinKeys(item.blankInUiModel)}</dd>
                <dt>Marked Not Created despite filled Supabase row</dt>
                <dd>{joinKeys(item.markedNotCreatedDespiteFilledSupabase)}</dd>
                <dt>Duplicate character rows</dt>
                <dd>{item.duplicateCharacterRows.length}</dd>
                <dt>Invalid grid rows</dt>
                <dd>{item.invalidGridRows.length}</dd>
                <dt>Dimension mismatches</dt>
                <dd>{item.dimensionMismatchRows.length}</dd>
              </dl>
            </article>
          ))}
        </>
      ) : null}
    </section>
  );
}
