# gitbriefcase OSS Factory Orchestration

## Operating Model

`gitbriefcase` is delivered as small, reviewable slices. Each slice should have a clear commit, a verification command, and a rollback path. The MVP is intentionally local-first: no network upload, no telemetry, and no cloud service dependency.

## Roles

- Product source of truth: `docs/PRD.md`
- Task inventory: `docs/TASKS.md`
- Maintainer workflow: `AGENTS.md`
- Machine-readable factory metadata: `docs/orchestration.json`

## Build Sequence

1. Documentation contract and task inventory.
2. TypeScript package foundation.
3. Pure utility modules for paths, checksums, ignore matching, and binary detection.
4. Redaction and manifest modeling.
5. Pack command.
6. Inspect command.
7. CLI argument parsing and help text.
8. Fixtures and tests.
9. README/examples/security/contributing polish.
10. Verification, GitHub publication, and branch protection.

## Safety Defaults

- Exclude `.git`, dependencies, caches, local env files, archives, generated bundles, and logs by default.
- Redact common secret-looking assignments and key blocks before writing copied text.
- Preserve original files only as redacted copies under `files/`.
- Record skipped and redacted paths in `manifest.json`.
- Fail inspection on checksum mismatches or malformed manifests.

## Verification Gates

Run before publishing:

```sh
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
node dist/cli.js pack tests/fixtures/sample-repo --output /tmp/gitbriefcase-smoke --format dir --force
node dist/cli.js inspect /tmp/gitbriefcase-smoke
```

## Release Notes Seed

The first MVP release should emphasize:

- Deterministic local repo bundles.
- Human-readable `SUMMARY.md`.
- Machine-readable `manifest.json`.
- Best-effort redaction with transparent findings.
- Bundle inspection for support and agent handoff workflows.
