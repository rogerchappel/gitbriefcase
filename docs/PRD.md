# gitbriefcase

Status: in-progress
Decision: selected for 2026-05-08 OSS factory run

## Scorecard

Total: 84/100
Band: build now
Last scored: 2026-05-08
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 17/20 | Agents and humans often need a clean, portable bundle of repo context without shipping secrets or node_modules. |
| Demand signal | 16/20 | Adjacent demand exists around repo packing, support bundles, CI artifacts, and agent context tools. |
| V1 buildability | 19/20 | Deterministic file walking, ignore handling, redaction, manifests, and archive output are straightforward. |
| Differentiation | 13/15 | Focus on safe local-first handoff bundles with explainable redaction and reproducible manifests. |
| Agentic workflow leverage | 12/15 | Excellent for handing repos to coding agents, bug triage, CI artifact capture, and offline review. |
| Distribution potential | 7/10 | Memorable name; useful README demos and CLI examples can land with developer audiences. |

## Pitch

`gitbriefcase` packs a repository into a deterministic, redacted handoff bundle: source excerpts, git facts, dependency metadata, checksums, and a human-readable manifest — a little suitcase for agents and maintainers. 🧳

## Why It Matters

Copy-pasting giant trees into chats is messy and risky. Support tickets, agent handoffs, and bug reports need enough context to be useful without leaking `.env`, credentials, private caches, or dependency junk. `gitbriefcase` makes that handoff repeatable and inspectable.

## Attribution / Inspiration

Inspired by repo context packers, support bundle tooling, and agentic coding workflows; this project should be original, local-first, and avoid copying implementations.

## V1 Scope

- TypeScript CLI package.
- `gitbriefcase pack <path>` writes a `.tar.gz` or directory bundle.
- Deterministic file selection honoring `.gitignore`, default deny patterns, max file size, and binary detection.
- Secret redaction for common env/key/token patterns with redaction report.
- `manifest.json` with file checksums, sizes, language guesses, git branch/commit/status, command/version, and warnings.
- `SUMMARY.md` with tree overview and notable files for humans/agents.
- `gitbriefcase inspect <bundle>` validates manifest and prints stats.
- Fixture-backed tests for ignore rules, redaction, determinism, and inspect failures.
- README with practical support-ticket and agent-handoff examples.

## Out of Scope

- Cloud upload, background daemons, IDE extension, lossy semantic summarization, or secret scanning claims beyond best-effort local redaction.

## Verification

- `npm test`
- `npm run check`
- `npm run build`
- `npm run smoke`
- Real CLI smoke packing a fixture repo and inspecting the bundle.

## Agent Prompt

Build a polished local-first TypeScript CLI named `gitbriefcase` from this PRD. Keep the MVP functional, deterministic, well-tested, and safe by default. Publish as a public GitHub repo under `rogerchappel/gitbriefcase` when verified.
