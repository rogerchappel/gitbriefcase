import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let cachedVersion: string | undefined;

export function getVersion(): string {
  if (cachedVersion) return cachedVersion;

  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", "package.json"),
    join(here, "..", "..", "package.json")
  ];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(readFileSync(candidate, "utf8")) as { version?: string };
      if (parsed.version) {
        cachedVersion = parsed.version;
        return cachedVersion;
      }
    } catch {
      // Try the next package.json location.
    }
  }

  cachedVersion = "0.0.0-dev";
  return cachedVersion;
}
