# Security Policy

## Supported Versions

`gitbriefcase` is pre-1.0. Security fixes are provided on the latest published version when maintainer capacity allows.

| Version | Supported |
| --- | --- |
| 0.x latest | Best effort |
| Older 0.x | No |

## Reporting a Vulnerability

Please do not report suspected vulnerabilities in public issues, pull requests, discussions, or shared bundles.

Use GitHub private vulnerability reporting for `rogerchappel/gitbriefcase` when available. If it is not available, open a public issue asking for a private reporting path without including exploit details, secrets, personal data, or sensitive technical details.

## Bundle Safety Expectations

`gitbriefcase` is designed to reduce accidental leakage, not to guarantee that a bundle is secret-free.

Before sharing a bundle:

1. Run `gitbriefcase inspect <bundle>`.
2. Review `SUMMARY.md`.
3. Review `manifest.json` redaction and skipped-path sections.
4. Spot-check copied files under `files/` when the bundle leaves your machine or organization.

## In Scope

- Redaction bypasses for supported best-effort patterns.
- Unsafe default inclusion of sensitive local files.
- Bundle inspection accepting tampered files as valid.
- CLI behavior that unexpectedly writes outside the requested output path.
- CI, packaging, or release configuration maintained in this repository.

## Out of Scope

- General support requests.
- Claims that require perfect secret scanning.
- Secrets manually forced into a bundle after generation.
- Downstream tools or services that consume generated bundles.

## Disclosure

Coordinate public disclosure with maintainers. Good-faith reports are appreciated, and maintainers will prioritize practical fixes that improve safe local-first bundle generation.
