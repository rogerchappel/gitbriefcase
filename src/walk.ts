import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { defaultDenyReason } from "./default-deny.js";
import { loadGitignore } from "./gitignore.js";
import { comparePaths, relativePosix } from "./path-utils.js";
import type { SkippedFile } from "./types.js";

export interface WalkOptions {
  includeGitIgnored: boolean;
}

export interface WalkResult {
  files: string[];
  skipped: SkippedFile[];
}

export async function walkRepository(root: string, options: WalkOptions): Promise<WalkResult> {
  const isGitIgnored = loadGitignore(root);
  const files: string[] = [];
  const skipped: SkippedFile[] = [];

  async function visit(absPath: string): Promise<void> {
    const rel = relativePosix(root, absPath);
    const stats = await stat(absPath);
    const isRoot = rel === "";
    const isDirectory = stats.isDirectory();

    if (!isRoot) {
      const deny = defaultDenyReason(rel, isDirectory);
      if (deny) {
        skipped.push({ path: rel, reason: isDirectory ? "directory" : "default-deny", detail: deny });
        return;
      }

      if (!options.includeGitIgnored && isGitIgnored(rel, isDirectory)) {
        skipped.push({ path: rel, reason: "gitignore", detail: "matched root .gitignore" });
        return;
      }
    }

    if (isDirectory) {
      const entries = (await readdir(absPath)).sort(comparePaths);
      for (const entry of entries) await visit(join(absPath, entry));
      return;
    }

    if (stats.isFile()) files.push(absPath);
  }

  await visit(root);
  files.sort((a, b) => comparePaths(relativePosix(root, a), relativePosix(root, b)));
  skipped.sort((a, b) => comparePaths(a.path, b.path));
  return { files, skipped };
}
