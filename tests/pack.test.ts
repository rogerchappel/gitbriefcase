import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { packRepository } from "../src/pack.js";

const fixture = resolve("tests/fixtures/sample-repo");

test("packRepository writes manifest, summary, and redacted files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-pack-"));
  try {
    const result = await packRepository({ repoPath: fixture, output: join(dir, "bundle"), format: "dir", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    assert.equal(result.manifest.stats.files, 5);
    assert.equal(result.manifest.stats.redactedFiles, 1);
    assert.ok(result.manifest.skipped.some((file) => file.path === ".env"));
    assert.ok(result.manifest.skipped.some((file) => file.path === "assets/blob.bin"));
    assert.match(await readFile(join(result.outputPath, "SUMMARY.md"), "utf8"), /Redactions/);
    const config = await readFile(join(result.outputPath, "files/config.txt"), "utf8");
    assert.match(config, /\[REDACTED:secret\]/);
    assert.doesNotMatch(config, /super-secret-token-value/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("packRepository output is deterministic for identical inputs", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-deterministic-"));
  try {
    const a = await packRepository({ repoPath: fixture, output: join(dir, "a"), format: "dir", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    const b = await packRepository({ repoPath: fixture, output: join(dir, "b"), format: "dir", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    assert.deepEqual(a.manifest.files, b.manifest.files);
    assert.deepEqual(a.manifest.skipped, b.manifest.skipped);
    assert.deepEqual(a.manifest.redactions, b.manifest.redactions);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
