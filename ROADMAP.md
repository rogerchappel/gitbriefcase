# Roadmap

This roadmap describes intended direction, not a binding delivery promise.

## Now

- Stabilize the MVP CLI based on real support-ticket and agent-handoff usage.
- Keep redaction defaults conservative, transparent, and easy to audit.
- Improve documentation from user feedback and issue reports.

## Next

- Add nested `.gitignore` support and richer ignore explanations.
- Add optional JSON output for `inspect`.
- Add configurable redaction patterns through a local config file.
- Improve language detection and notable-file summaries.
- Explore reproducible archive metadata across more tar implementations.

## Later

- Optional integration recipes for CI artifact capture.
- Optional support for signing manifests.
- Optional bundle diffing for comparing two support captures.

## Not Planned

- Cloud upload or hosted storage.
- Telemetry or background daemons.
- Claims of comprehensive secret scanning without a dedicated scanner.
- IDE extensions before the CLI workflow proves useful.

## Roadmap Review

Before each meaningful release:

- Move completed user-visible work into `CHANGELOG.md`.
- Remove stale commitments.
- Promote only the next reviewable set of work into `Now`.
