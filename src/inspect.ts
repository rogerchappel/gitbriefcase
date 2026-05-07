import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { extractTgz } from "./archive.js";
import { GitbriefcaseError } from "./errors.js";
import { sha256 } from "./hash.js";
import { comparePaths, isSubPath, relativePosix } from "./path-utils.js";
import type { BundleManifest, InspectResult } from "./types.js";

export async function inspectBundle(bundlePath: string): Promise<InspectResult> {
  const resolved = resolve(bundlePath);
  const archive = isArchive(resolved) ? await extractTgz(resolved) : null;
  try {
    const root = archive ? await findExtractedRoot(archive.dir) : resolved;
    const manifest = await readManifest(root);
    const errors = validateManifestShape(manifest);
    const warnings: string[] = [];

    const expected = new Set<string>();
    for (const file of manifest.files) {
      expected.add(file.bundlePath);
      if (!isSubPath(file.bundlePath) || !file.bundlePath.startsWith("files/")) {
        errors.push(`Invalid bundle path for ${file.path}: ${file.bundlePath}`);
        continue;
      }
      const abs = join(root, file.bundlePath);
      if (!existsSync(abs)) {
        errors.push(`Missing bundled file: ${file.bundlePath}`);
        continue;
      }
      const data = await readFile(abs);
      const actualHash = sha256(data);
      if (actualHash !== file.sha256) errors.push(`Checksum mismatch: ${file.bundlePath}`);
      if (data.byteLength !== file.size) errors.push(`Size mismatch: ${file.bundlePath}`);
    }

    for (const actual of await listFiles(join(root, "files"), root)) {
      if (!expected.has(actual)) errors.push(`Unexpected bundled file: ${actual}`);
    }

    return { valid: errors.length === 0, manifest, errors, warnings };
  } finally {
    if (archive) await archive.cleanup();
  }
}

export function formatInspectResult(result: InspectResult): string {
  const lines = [
    `gitbriefcase bundle: ${result.valid ? "valid" : "invalid"}`,
    `files: ${result.manifest.stats.files}`,
    `skipped: ${result.manifest.stats.skipped}`,
    `redacted files: ${result.manifest.stats.redactedFiles}`,
    `bytes: ${result.manifest.stats.bytes}`
  ];
  for (const warning of result.warnings) lines.push(`warning: ${warning}`);
  for (const error of result.errors) lines.push(`error: ${error}`);
  return `${lines.join("\n")}\n`;
}

function isArchive(path: string): boolean {
  return path.endsWith(".tgz") || path.endsWith(".tar.gz");
}

async function findExtractedRoot(dir: string): Promise<string> {
  const entries = (await readdir(dir)).sort(comparePaths);
  if (entries.length !== 1) throw new GitbriefcaseError("Archive must contain exactly one bundle root directory");
  return join(dir, entries[0]!);
}

async function readManifest(root: string): Promise<BundleManifest> {
  const path = join(root, "manifest.json");
  try {
    return JSON.parse(await readFile(path, "utf8")) as BundleManifest;
  } catch (error) {
    throw new GitbriefcaseError(`Could not read manifest.json: ${(error as Error).message}`);
  }
}

function validateManifestShape(manifest: BundleManifest): string[] {
  const errors: string[] = [];
  if (manifest.schemaVersion !== 1) errors.push("Unsupported manifest schemaVersion");
  if (manifest.tool?.name !== "gitbriefcase") errors.push("Manifest tool.name is not gitbriefcase");
  if (!Array.isArray(manifest.files)) errors.push("Manifest files must be an array");
  if (!Array.isArray(manifest.skipped)) errors.push("Manifest skipped must be an array");
  return errors;
}

async function listFiles(root: string, bundleRoot: string): Promise<string[]> {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  async function visit(abs: string): Promise<void> {
    const stats = await stat(abs);
    if (stats.isDirectory()) {
      for (const entry of (await readdir(abs)).sort(comparePaths)) await visit(join(abs, entry));
    } else if (stats.isFile()) {
      out.push(relativePosix(bundleRoot, abs));
    }
  }
  await visit(root);
  return out.sort(comparePaths);
}
