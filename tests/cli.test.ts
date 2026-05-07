import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const fixture = resolve("tests/fixtures/sample-repo");

test("CLI prints help", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "--help"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /gitbriefcase/);
  assert.match(result.stdout, /pack <path>/);
});

test("CLI packs and inspects a fixture repository", async () => {
  const dir = await mkdtemp(join(tmpdir(), "gitbriefcase-cli-"));
  try {
    const output = join(dir, "bundle");
    const pack = spawnSync(process.execPath, ["dist/src/cli.js", "pack", fixture, "--output", output], { encoding: "utf8" });
    assert.equal(pack.status, 0, pack.stderr);
    assert.match(pack.stdout, /Packed/);

    const inspect = spawnSync(process.execPath, ["dist/src/cli.js", "inspect", output], { encoding: "utf8" });
    assert.equal(inspect.status, 0, inspect.stderr);
    assert.match(inspect.stdout, /valid/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
