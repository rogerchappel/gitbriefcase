#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

workdir="$(mktemp -d)"
cleanup() {
  rm -rf "$workdir"
}
trap cleanup EXIT

node dist/src/cli.js --version >/dev/null
node dist/src/cli.js pack tests/fixtures/sample-repo --output "$workdir/sample.bundle" --format dir --force
node dist/src/cli.js inspect "$workdir/sample.bundle"

test -f "$workdir/sample.bundle/manifest.json"
test -f "$workdir/sample.bundle/SUMMARY.md"
test -f "$workdir/sample.bundle/files/config.txt"
if grep -q 'super-secret-token-value' "$workdir/sample.bundle/files/config.txt"; then
  echo "secret was not redacted" >&2
  exit 1
fi

echo "smoke passed: $workdir/sample.bundle"
