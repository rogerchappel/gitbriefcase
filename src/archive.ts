import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { GitbriefcaseError } from "./errors.js";

export async function createTgz(sourceDir: string, outputPath: string): Promise<void> {
  const target = resolve(outputPath);
  const result = spawnSync("tar", ["--no-xattrs", "-czf", target, "-C", dirname(sourceDir), basename(sourceDir)], {
    encoding: "utf8",
    env: { ...process.env, GZIP: "-n" }
  });
  if (result.status !== 0) {
    throw new GitbriefcaseError(`tar failed: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`);
  }
}

export async function extractTgz(archivePath: string): Promise<{ dir: string; cleanup(): Promise<void> }> {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-inspect-"));
  const result = spawnSync("tar", ["-xzf", resolve(archivePath), "-C", dir], { encoding: "utf8" });
  if (result.status !== 0) {
    await rm(dir, { recursive: true, force: true });
    throw new GitbriefcaseError(`tar extract failed: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`);
  }
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}
