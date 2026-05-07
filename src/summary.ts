import type { BundleManifest } from "./types.js";

export function renderSummary(manifest: BundleManifest): string {
  const topLanguages = languageSummary(manifest);
  const notable = manifest.files.slice(0, 25).map((file) => `- \`${file.path}\` (${file.language}, ${file.size} bytes)`).join("\n");
  const skipped = manifest.skipped.slice(0, 25).map((file) => `- \`${file.path}\` — ${file.reason}${file.detail ? ` (${file.detail})` : ""}`).join("\n");

  return `# gitbriefcase Summary

` +
    `Source: ${manifest.source.rootName}\n` +
    `Created: ${manifest.createdAt}\n` +
    `Git branch: ${manifest.source.git.branch ?? "unknown"}\n` +
    `Git commit: ${manifest.source.git.commit ?? "unknown"}\n` +
    `Git dirty: ${manifest.source.git.isDirty === null ? "unknown" : String(manifest.source.git.isDirty)}\n\n` +
    `## Stats\n\n` +
    `- Files packed: ${manifest.stats.files}\n` +
    `- Files skipped: ${manifest.stats.skipped}\n` +
    `- Redacted files: ${manifest.stats.redactedFiles}\n` +
    `- Packed bytes: ${manifest.stats.bytes}\n\n` +
    `## Languages\n\n${topLanguages || "- None"}\n\n` +
    `## Notable Files\n\n${notable || "- None"}\n\n` +
    `## Skipped Files\n\n${skipped || "- None"}\n\n` +
    `## Redactions\n\n${manifest.redactions.length === 0 ? "- None" : manifest.redactions.map((r) => `- \`${r.path}\` — ${r.pattern} x${r.count}`).join("\n")}\n`;
}

function languageSummary(manifest: BundleManifest): string {
  const counts = new Map<string, number>();
  for (const file of manifest.files) counts.set(file.language, (counts.get(file.language) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language, count]) => `- ${language}: ${count}`)
    .join("\n");
}
