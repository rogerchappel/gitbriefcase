import type { RedactionFinding } from "./types.js";

interface RedactionPattern {
  name: string;
  regex: RegExp;
  replacement(match: string, ...groups: string[]): string;
}

const PATTERNS: RedactionPattern[] = [
  {
    name: "private-key-block",
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gu,
    replacement: () => "[REDACTED:private-key-block]"
  },
  {
    name: "token-assignment",
    regex: /\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|API[_-]?KEY|ACCESS[_-]?KEY)[A-Z0-9_]*\s*[=:]\s*)([^\s#'\"]{8,}|['\"][^'\"]{8,}['\"])/giu,
    replacement: (_match, prefix: string) => `${prefix}[REDACTED:secret]`
  },
  {
    name: "github-token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/gu,
    replacement: () => "[REDACTED:github-token]"
  },
  {
    name: "aws-access-key",
    regex: /\bAKIA[0-9A-Z]{16}\b/gu,
    replacement: () => "[REDACTED:aws-access-key]"
  }
];

export interface RedactionResult {
  content: string;
  findings: RedactionFinding[];
}

export function redactContent(path: string, content: string): RedactionResult {
  let redacted = content;
  const findings: RedactionFinding[] = [];

  for (const pattern of PATTERNS) {
    let count = 0;
    redacted = redacted.replace(pattern.regex, (...args: unknown[]) => {
      count += 1;
      return pattern.replacement(args[0] as string, ...(args.slice(1) as string[]));
    });
    if (count > 0) findings.push({ path, pattern: pattern.name, count });
  }

  return { content: redacted, findings };
}
