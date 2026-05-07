import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { inspectBundle } from "../src/inspect.js";
import { packRepository } from "../src/pack.js";

const fixture = resolve("tests/fixtures/sample-repo");

test("inspectBundle validates a packed directory", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-inspect-"));
  try {
    const packed = await packRepository({ repoPath: fixture, output: join(dir, "bundle"), format: "dir", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    const result = await inspectBundle(packed.outputPath);
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("inspectBundle reports missing files", async () => {
  const result = await inspectBundle(resolve("tests/fixtures/broken-bundle"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("Missing bundled file")));
});

test("inspectBundle reports unexpected files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-extra-"));
  try {
    const packed = await packRepository({ repoPath: fixture, output: join(dir, "bundle"), format: "dir", force: false, maxFileBytes: 1024, includeGitIgnored: false, quiet: true });
    await writeFile(join(packed.outputPath, "files/extra.txt"), "surprise", "utf8");
    const result = await inspectBundle(packed.outputPath);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("Unexpected bundled file")));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
