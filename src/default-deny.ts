import { normalizeInputPath } from "./path-utils.js";

const DEFAULT_DENY_SEGMENTS = new Set([
  ".git",
  ".hg",
  ".svn",
  ".cache",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "build",
  "node_modules",
  "vendor"
]);

const DEFAULT_DENY_SUFFIXES = [
  ".briefcase",
  ".bundle",
  ".DS_Store",
  ".log",
  ".pem",
  ".p12",
  ".pfx",
  ".key",
  ".sqlite",
  ".sqlite3",
  ".tar",
  ".tgz",
  ".tar.gz",
  ".zip"
];

export function defaultDenyReason(path: string, isDirectory: boolean): string | null {
  const normalized = normalizeInputPath(path);
  const parts = normalized.split("/").filter(Boolean);
  const name = parts.at(-1) ?? normalized;

  if (parts.some((part) => DEFAULT_DENY_SEGMENTS.has(part))) {
    return "matches built-in generated/cache/dependency deny list";
  }

  if (name === ".env" || name.startsWith(".env.")) {
    return "local environment files are denied by default";
  }

  if (!isDirectory && DEFAULT_DENY_SUFFIXES.some((suffix) => name.endsWith(suffix))) {
    return "matches built-in sensitive or generated file suffix deny list";
  }

  return null;
}
