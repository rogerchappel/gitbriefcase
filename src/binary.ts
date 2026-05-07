const TEXT_EXTENSIONS = new Set([
  ".c", ".cc", ".conf", ".cpp", ".cs", ".css", ".env", ".go", ".h", ".html",
  ".java", ".js", ".json", ".jsx", ".lock", ".md", ".mjs", ".py", ".rb",
  ".rs", ".sh", ".sql", ".ts", ".tsx", ".txt", ".xml", ".yaml", ".yml"
]);

export function looksBinary(path: string, data: Buffer): boolean {
  const extension = extensionOf(path);
  if (TEXT_EXTENSIONS.has(extension)) return false;
  if (data.length === 0) return false;

  const sample = data.subarray(0, Math.min(data.length, 8_000));
  let suspicious = 0;

  for (const byte of sample) {
    if (byte === 0) return true;
    if (byte < 7 || (byte > 14 && byte < 32)) suspicious += 1;
  }

  return suspicious / sample.length > 0.03;
}

function extensionOf(path: string): string {
  const name = path.split("/").at(-1) ?? path;
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}
