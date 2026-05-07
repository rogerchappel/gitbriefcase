#!/usr/bin/env node
import { GitbriefcaseError } from "./errors.js";
import { formatInspectResult, inspectBundle } from "./inspect.js";
import { packRepository } from "./pack.js";
import type { BundleFormat, PackOptions } from "./types.js";
import { getVersion } from "./version.js";

const DEFAULT_MAX_FILE_BYTES = 256 * 1024;

export async function main(argv = process.argv.slice(2)): Promise<number> {
  try {
    const [command, ...rest] = argv;
    if (!command || command === "help" || command === "--help" || command === "-h") {
      process.stdout.write(helpText());
      return 0;
    }
    if (command === "--version" || command === "-v") {
      process.stdout.write(`${getVersion()}\n`);
      return 0;
    }
    if (command === "pack") return await runPack(rest);
    if (command === "inspect") return await runInspect(rest);
    throw new GitbriefcaseError(`Unknown command: ${command}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`gitbriefcase: ${message}\n`);
    return error instanceof GitbriefcaseError ? error.exitCode : 1;
  }
}

async function runPack(args: string[]): Promise<number> {
  const path = args.shift();
  if (!path) throw new GitbriefcaseError("pack requires a repository path");

  const options: PackOptions = {
    repoPath: path,
    format: "dir",
    force: false,
    maxFileBytes: DEFAULT_MAX_FILE_BYTES,
    includeGitIgnored: false,
    quiet: false
  };

  while (args.length > 0) {
    const arg = args.shift()!;
    if (arg === "--output" || arg === "-o") options.output = requireValue(arg, args);
    else if (arg === "--format") options.format = parseFormat(requireValue(arg, args));
    else if (arg === "--force") options.force = true;
    else if (arg === "--include-gitignored") options.includeGitIgnored = true;
    else if (arg === "--max-file-bytes") options.maxFileBytes = parsePositiveInt(requireValue(arg, args), arg);
    else if (arg === "--quiet") options.quiet = true;
    else throw new GitbriefcaseError(`Unknown pack option: ${arg}`);
  }

  const result = await packRepository(options);
  if (!options.quiet) {
    process.stdout.write(`Packed ${result.manifest.stats.files} files into ${result.outputPath}\n`);
    if (result.manifest.stats.redactedFiles > 0) process.stdout.write(`Redacted ${result.manifest.stats.redactedFiles} files\n`);
  }
  return 0;
}

async function runInspect(args: string[]): Promise<number> {
  const path = args.shift();
  if (!path) throw new GitbriefcaseError("inspect requires a bundle path");
  if (args.length > 0) throw new GitbriefcaseError(`Unknown inspect option: ${args[0]}`);
  const result = await inspectBundle(path);
  process.stdout.write(formatInspectResult(result));
  return result.valid ? 0 : 1;
}

function requireValue(flag: string, args: string[]): string {
  const value = args.shift();
  if (!value) throw new GitbriefcaseError(`${flag} requires a value`);
  return value;
}

function parseFormat(value: string): BundleFormat {
  if (value === "dir" || value === "tgz") return value;
  throw new GitbriefcaseError(`Unsupported format: ${value}`);
}

function parsePositiveInt(value: string, flag: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new GitbriefcaseError(`${flag} requires a positive integer`);
  return parsed;
}

function helpText(): string {
  return `gitbriefcase ${getVersion()}\n\n` +
    `Pack deterministic, redacted repository handoff bundles.\n\n` +
    `Usage:\n` +
    `  gitbriefcase pack <path> [--output <path>] [--format dir|tgz] [--force]\n` +
    `  gitbriefcase inspect <bundle>\n\n` +
    `Options:\n` +
    `  --max-file-bytes <n>      Skip files larger than n bytes (default ${DEFAULT_MAX_FILE_BYTES})\n` +
    `  --include-gitignored      Include files matched by root .gitignore\n` +
    `  --quiet                   Suppress pack summary output\n` +
    `  --version                 Print version\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => {
    process.exitCode = code;
  });
}
