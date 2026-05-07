# gitbriefcase MVP Tasks

Status: complete for the initial OSS factory MVP.

## Delivery Slices

1. Product and orchestration docs
   - Keep `docs/PRD.md` as the source of truth.
   - Add task inventory, orchestration notes, and machine-readable delivery metadata.
2. CLI foundation
   - TypeScript package metadata, compiler config, executable bin, and public API surface.
3. Deterministic repository walking
   - Stable path sorting, default deny rules, `.gitignore` support, max-size skips, and binary detection.
4. Redaction pipeline
   - Best-effort common secret redaction with per-file redaction findings.
5. Bundle writer
   - Local-first bundle directory with `files/`, `manifest.json`, `SUMMARY.md`, and optional deterministic `.tar.gz` archive.
6. Inspect validator
   - Validate manifest shape, checksums, missing files, unexpected files, and archive extraction.
7. Tests and fixtures
   - Fixture repositories covering ignore behavior, redaction, determinism, archive inspect, and broken bundle failures.
8. Documentation and examples
   - README, SECURITY, CONTRIBUTING, examples, and maintainer workflow docs.
9. Verification and release prep
   - `npm test`, `npm run check`, `npm run build`, `npm run smoke`, `bash scripts/validate.sh`, and real CLI smoke.
10. GitHub publication
   - Public repo `rogerchappel/gitbriefcase`, pushed `main`, topics, and best-effort branch protection.

## Acceptance Checklist

- [x] Functional `gitbriefcase pack <path>` command.
- [x] Functional `gitbriefcase inspect <bundle>` command.
- [x] Deterministic output for identical inputs.
- [x] Default safe exclusions for `.git`, dependency folders, caches, logs, and env files.
- [x] Explainable redaction report in the manifest.
- [x] Fixture-backed automated tests.
- [x] CLI smoke script and validation script.
- [x] Public-facing OSS docs.
- [x] GitHub publication attempted from verified `main`.
