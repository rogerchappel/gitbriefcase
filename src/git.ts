import { spawnSync } from "node:child_process";
import type { GitFacts } from "./types.js";

export function readGitFacts(root: string): GitFacts {
  const commit = git(root, ["rev-parse", "HEAD"]);
  const branch = git(root, ["branch", "--show-current"]);
  const status = git(root, ["status", "--short"]);

  if (commit === null && branch === null && status === null) {
    return { branch: null, commit: null, isDirty: null, status: [] };
  }

  const lines = status ? status.split(/\r?\n/u).filter(Boolean).sort() : [];
  return {
    branch: branch || null,
    commit: commit || null,
    isDirty: lines.length > 0,
    status: lines
  };
}

function git(cwd: string, args: string[]): string | null {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}
