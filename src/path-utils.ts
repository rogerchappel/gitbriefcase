import { relative, sep } from "node:path";

export function toPosixPath(value: string): string {
  return value.split(sep).join("/").replace(/^\.\//, "");
}

export function relativePosix(root: string, path: string): string {
  return toPosixPath(relative(root, path));
}

export function normalizeInputPath(value: string): string {
  return toPosixPath(value).replace(/^\/+/, "").replace(/\/+$/, "");
}

export function comparePaths(a: string, b: string): number {
  return a.localeCompare(b, "en", { sensitivity: "variant" });
}

export function isSubPath(path: string): boolean {
  return !path.startsWith("../") && path !== ".." && !path.startsWith("/");
}
