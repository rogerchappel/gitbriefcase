import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { relativePosix } from "../src/path-utils.js";
import { walkRepository } from "../src/walk.js";

const fixture = resolve("tests/fixtures/sample-repo");

test("walkRepository skips default deny and gitignored paths", async () => {
  const result = await walkRepository(fixture, { includeGitIgnored: false });
  const files = result.files.map((file) => relativePosix(fixture, file));

  assert.deepEqual(files, [".gitignore", "README.md", "config.txt", "package.json", "src/index.js"]);
  assert.ok(result.skipped.some((file) => file.path === ".env" && file.reason === "default-deny"));
  assert.ok(result.skipped.some((file) => file.path === "ignored.txt" && file.reason === "gitignore"));
  assert.ok(result.skipped.some((file) => file.path === "node_modules" && file.reason === "directory"));
});

test("walkRepository can include root gitignored paths", async () => {
  const result = await walkRepository(fixture, { includeGitIgnored: true });
  const files = result.files.map((file) => relativePosix(fixture, file));
  assert.ok(files.includes("ignored.txt"));
  assert.ok(files.includes("tmp/cache.txt"));
});
