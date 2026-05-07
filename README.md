# gitbriefcase

Pack a repository into a deterministic, redacted handoff bundle for support tickets, maintainer review, and coding agents. 🧳

`gitbriefcase` is local-first: it walks your repo, applies safe default exclusions, redacts common secret-looking values, writes copied text files under `files/`, and emits both a machine-readable `manifest.json` and human-readable `SUMMARY.md`.

## Install

```sh
npm install -g gitbriefcase
```

For local development:

```sh
npm install
npm run build
node dist/src/cli.js --help
```

## Quick Start

Create a directory bundle:

```sh
gitbriefcase pack ./my-repo --output ./my-repo.briefcase --format dir
```

Inspect the bundle before sharing it:

```sh
gitbriefcase inspect ./my-repo.briefcase
```

Create a compressed archive:

```sh
gitbriefcase pack ./my-repo --output ./my-repo.briefcase.tar.gz --format tgz
```

## What a Bundle Contains

```text
my-repo.briefcase/
├── SUMMARY.md
├── manifest.json
└── files/
    └── ...redacted copied text files...
```

The manifest records selected files, checksums, sizes, language guesses, git facts, skipped paths, redaction findings, and warnings.

## Safe Defaults

By default, `gitbriefcase` excludes common risky or noisy paths:

- `.git`, dependency directories, build output, coverage, caches, logs, archives, and local env files.
- Files matched by the repository root `.gitignore`.
- Binary-looking files.
- Files larger than `--max-file-bytes` (default: 262144 bytes).

Redaction is best-effort and explainable, not a replacement for a dedicated secret scanner. Always inspect generated bundles before sharing.

## Examples

Support ticket bundle:

```sh
gitbriefcase pack . --output /tmp/project-support.briefcase --format dir --force
gitbriefcase inspect /tmp/project-support.briefcase
```

Agent handoff archive:

```sh
gitbriefcase pack . --output /tmp/project-agent.briefcase.tar.gz --format tgz --force
```

Include `.gitignore` matches when you intentionally need them:

```sh
gitbriefcase pack . --include-gitignored --output /tmp/expanded.briefcase --force
```

## CLI

```text
gitbriefcase pack <path> [--output <path>] [--format dir|tgz] [--force]
gitbriefcase inspect <bundle>
```

Options:

- `--max-file-bytes <n>`: skip files larger than `n` bytes.
- `--include-gitignored`: include paths matched by the root `.gitignore`.
- `--quiet`: suppress pack summary output.
- `--version`: print version.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please keep changes small, tested, and reviewable.

## Security

See [SECURITY.md](SECURITY.md). Do not publish sensitive bundle contents in public issues.

## License

MIT
