# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Functional TypeScript CLI with `gitbriefcase pack` and `gitbriefcase inspect`.
- Deterministic local bundle directories with `manifest.json`, `SUMMARY.md`, and redacted copied files.
- Optional `.tar.gz` archive output and archive inspection.
- Safe default exclusions for dependency folders, git metadata, build output, caches, logs, env files, archives, large files, and binary-looking content.
- Best-effort redaction for common token, key, password, GitHub token, AWS key, and private-key patterns.
- Fixture-backed tests, smoke script, CI workflow, examples, and OSS contributor/security docs.

### Security

- Added transparent manifest redaction findings and skipped-file reporting.

## Release Links

- Unreleased: `https://github.com/rogerchappel/gitbriefcase/compare/...HEAD`
- Latest release: `https://github.com/rogerchappel/gitbriefcase/releases/latest`
