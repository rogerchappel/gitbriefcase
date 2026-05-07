import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { normalizeInputPath } from "./path-utils.js";

interface IgnoreRule {
  raw: string;
  negated: boolean;
  directoryOnly: boolean;
  anchored: boolean;
  matcher: RegExp;
}

export function loadGitignore(root: string): (path: string, isDirectory: boolean) => boolean {
  const file = join(root, ".gitignore");
  if (!existsSync(file)) return () => false;

  const rules = readFileSync(file, "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map(parseRule);

  return (path, isDirectory) => {
    const normalized = normalizeInputPath(path);
    let ignored = false;
    for (const rule of rules) {
      if (rule.directoryOnly && !isDirectory && !normalized.includes(`${stripSlashes(rule.raw)}/`)) continue;
      if (rule.matcher.test(normalized)) ignored = !rule.negated;
    }
    return ignored;
  };
}

function parseRule(rawLine: string): IgnoreRule {
  const negated = rawLine.startsWith("!");
  let raw = negated ? rawLine.slice(1) : rawLine;
  const directoryOnly = raw.endsWith("/");
  raw = stripSlashes(raw);
  const anchored = rawLine.startsWith("/") || raw.includes("/");
  const matcher = globToRegExp(raw, anchored, directoryOnly);
  return { raw, negated, directoryOnly, anchored, matcher };
}

function stripSlashes(value: string): string {
  return value.replace(/^\/+/, "").replace(/\/+$/, "");
}

function globToRegExp(glob: string, anchored: boolean, directoryOnly: boolean): RegExp {
  const source = glob.split("").map((char) => {
    if (char === "*") return "[^/]*";
    if (char === "?") return "[^/]";
    return escapeRegExp(char);
  }).join("");

  const prefix = anchored ? "^" : "(^|.*/)";
  const suffix = directoryOnly ? "(/.*)?$" : "($|/.*$)";
  return new RegExp(`${prefix}${source}${suffix}`, "u");
}

function escapeRegExp(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}
