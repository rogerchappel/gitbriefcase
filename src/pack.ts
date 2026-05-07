import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { createTgz } from "./archive.js";
import { looksBinary } from "./binary.js";
import { GitbriefcaseError } from "./errors.js";
import { readGitFacts } from "./git.js";
import { sha256 } from "./hash.js";
import { guessLanguage } from "./language.js";
import { relativePosix } from "./path-utils.js";
import { redactContent } from "./redact.js";
import { renderSummary } from "./summary.js";
import type { BundleManifest, ManifestFile, PackOptions, RedactionFinding, SkippedFile } from "./types.js";
import { getVersion } from "./version.js";
import { walkRepository } from "./walk.js";

export interface PackResult {
  outputPath: string;
  manifest: BundleManifest;
}

export async function packRepository(options: PackOptions): Promise<PackResult> {
  const root = resolve(options.repoPath);
  const rootStats = await stat(root).catch(() => null);
  if (!rootStats?.isDirectory()) throw new GitbriefcaseError(`Repository path is not a directory: ${options.repoPath}`);

  const bundleBase = options.output ? resolve(options.output) : resolve(`${basename(root)}.briefcase`);
  const workDir = options.format === "tgz" ? bundleBase.replace(/\.tar\.gz$|\.tgz$/u, "") : bundleBase;

  if (options.force) await rm(workDir, { recursive: true, force: true });
  await mkdir(join(workDir, "files"), { recursive: false }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") throw new GitbriefcaseError(`Output already exists: ${workDir}. Use --force to overwrite.`);
    throw error;
  });

  const walked = await walkRepository(root, { includeGitIgnored: options.includeGitIgnored });
  const skipped: SkippedFile[] = [...walked.skipped];
  const files: ManifestFile[] = [];
  const redactions: RedactionFinding[] = [];
  const warnings: string[] = [];

  for (const absPath of walked.files) {
    const rel = relativePosix(root, absPath);
    const data = await readFile(absPath).catch((error: Error) => {
      skipped.push({ path: rel, reason: "read-error", detail: error.message });
      return null;
    });
    if (!data) continue;

    if (data.byteLength > options.maxFileBytes) {
      skipped.push({ path: rel, reason: "too-large", detail: `${data.byteLength} bytes exceeds ${options.maxFileBytes}` });
      continue;
    }

    if (looksBinary(rel, data)) {
      skipped.push({ path: rel, reason: "binary", detail: "binary-looking content is not copied" });
      continue;
    }

    const originalText = data.toString("utf8");
    const redacted = redactContent(rel, originalText);
    redactions.push(...redacted.findings);

    const bundlePath = `files/${rel}`;
    const outPath = join(workDir, bundlePath);
    await mkdir(join(outPath, ".."), { recursive: true });
    await writeFile(outPath, redacted.content, "utf8");

    const outputBuffer = Buffer.from(redacted.content, "utf8");
    files.push({
      path: rel,
      bundlePath,
      size: outputBuffer.byteLength,
      originalSize: data.byteLength,
      sha256: sha256(outputBuffer),
      language: guessLanguage(rel),
      redacted: redacted.findings.length > 0
    });
  }

  files.sort((a, b) => a.path.localeCompare(b.path));
  skipped.sort((a, b) => a.path.localeCompare(b.path));
  redactions.sort((a, b) => a.path.localeCompare(b.path) || a.pattern.localeCompare(b.pattern));

  const manifest: BundleManifest = {
    schemaVersion: 1,
    tool: { name: "gitbriefcase", version: getVersion(), command: process.argv.join(" ") },
    createdAt: "1970-01-01T00:00:00.000Z",
    source: { rootName: basename(root), git: readGitFacts(root) },
    options: { maxFileBytes: options.maxFileBytes, includeGitIgnored: options.includeGitIgnored },
    stats: {
      files: files.length,
      skipped: skipped.length,
      redactedFiles: new Set(redactions.map((finding) => finding.path)).size,
      bytes: files.reduce((sum, file) => sum + file.size, 0)
    },
    files,
    skipped,
    redactions,
    warnings
  };

  await writeFile(join(workDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(join(workDir, "SUMMARY.md"), renderSummary(manifest), "utf8");

  if (options.format === "tgz") {
    const archivePath = bundleBase.endsWith(".tgz") || bundleBase.endsWith(".tar.gz") ? bundleBase : `${bundleBase}.tar.gz`;
    if (options.force) await rm(archivePath, { force: true });
    await createTgz(workDir, archivePath);
    await rm(workDir, { recursive: true, force: true });
    return { outputPath: archivePath, manifest };
  }

  return { outputPath: workDir, manifest };
}
