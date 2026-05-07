import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { inspectBundle } from "../src/inspect.js";
import { packRepository } from "../src/pack.js";

const fixture = resolve("tests/fixtures/sample-repo");

test("packRepository writes inspectable tgz archives", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-tgz-"));
  try {
    const packed = await packRepository({ repoPath: fixture, output: join(dir, "sample.briefcase.tar.gz"), format: "tgz", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    assert.match(packed.outputPath, /\.tar\.gz$/);
    const result = await inspectBundle(packed.outputPath);
    assert.equal(result.valid, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
