# Contributing

Thanks for helping improve `gitbriefcase`.

This project values small, reviewable contributions with clear verification and safe defaults.

## Development Setup

```sh
git clone https://github.com/rogerchappel/gitbriefcase.git
cd gitbriefcase
npm install
npm test
```

## Project Shape

- `src/cli.ts` — command-line entrypoint.
- `src/pack.ts` — bundle generation.
- `src/inspect.ts` — manifest and checksum validation.
- `src/redact.ts` — best-effort redaction rules.
- `tests/fixtures/` — sample repos and broken bundles.
- `docs/PRD.md` — product source of truth.

## Pull Requests

Pull requests should:

- Focus on one reviewable intent.
- Follow Conventional Commits.
- Include tests or a clear reason tests are not applicable.
- Update documentation when behavior changes.
- Avoid unrelated formatting, dependency churn, or generated artifacts.
- Avoid committing secrets or private repository bundles.

## Verification

Run the smallest useful check while developing, then the full gate before review:

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

If a command cannot be run, explain why and include the exact command a maintainer should run.

## Redaction Changes

Redaction rules must be conservative and explainable. New rules should include:

- A targeted fixture or unit test.
- A clear pattern name for `manifest.json` findings.
- No claim of comprehensive secret scanning unless backed by a dedicated scanner.

## Review Pack

Use this summary for meaningful changes:

```md
## Review Pack
Repo: gitbriefcase
Branch:
PR:
Task:
Status: done / blocked / needs review
Summary:
Commits:
Files changed:
Verification:
Risk level:
Rollback plan:
Human decision needed:
Next recommended task:
```
