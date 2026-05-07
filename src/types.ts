export type BundleFormat = "dir" | "tgz";

export interface PackOptions {
  repoPath: string;
  output?: string;
  format: BundleFormat;
  force: boolean;
  maxFileBytes: number;
  includeGitIgnored: boolean;
  quiet: boolean;
}

export interface SkippedFile {
  path: string;
  reason: "default-deny" | "gitignore" | "directory" | "too-large" | "binary" | "read-error";
  detail?: string;
}

export interface RedactionFinding {
  path: string;
  pattern: string;
  count: number;
}

export interface ManifestFile {
  path: string;
  bundlePath: string;
  size: number;
  originalSize: number;
  sha256: string;
  language: string;
  redacted: boolean;
}

export interface GitFacts {
  branch: string | null;
  commit: string | null;
  isDirty: boolean | null;
  status: string[];
}

export interface BundleManifest {
  schemaVersion: 1;
  tool: {
    name: "gitbriefcase";
    version: string;
    command: string;
  };
  createdAt: string;
  source: {
    rootName: string;
    git: GitFacts;
  };
  options: {
    maxFileBytes: number;
    includeGitIgnored: boolean;
  };
  stats: {
    files: number;
    skipped: number;
    redactedFiles: number;
    bytes: number;
  };
  files: ManifestFile[];
  skipped: SkippedFile[];
  redactions: RedactionFinding[];
  warnings: string[];
}

export interface InspectResult {
  valid: boolean;
  manifest: BundleManifest;
  errors: string[];
  warnings: string[];
}
