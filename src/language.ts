const EXTENSION_LANGUAGE = new Map<string, string>([
  [".c", "C"],
  [".cc", "C++"],
  [".cpp", "C++"],
  [".cs", "C#"],
  [".css", "CSS"],
  [".go", "Go"],
  [".html", "HTML"],
  [".java", "Java"],
  [".js", "JavaScript"],
  [".json", "JSON"],
  [".jsx", "JavaScript JSX"],
  [".md", "Markdown"],
  [".mjs", "JavaScript"],
  [".py", "Python"],
  [".rb", "Ruby"],
  [".rs", "Rust"],
  [".sh", "Shell"],
  [".ts", "TypeScript"],
  [".tsx", "TypeScript JSX"],
  [".txt", "Text"],
  [".yaml", "YAML"],
  [".yml", "YAML"]
]);

const BASENAME_LANGUAGE = new Map<string, string>([
  ["Dockerfile", "Dockerfile"],
  ["Makefile", "Makefile"],
  ["LICENSE", "License"],
  ["README", "Markdown"]
]);

export function guessLanguage(path: string): string {
  const name = path.split("/").at(-1) ?? path;
  if (BASENAME_LANGUAGE.has(name)) return BASENAME_LANGUAGE.get(name)!;
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "Text";
  return EXTENSION_LANGUAGE.get(name.slice(dot).toLowerCase()) ?? "Text";
}
