export class GitbriefcaseError extends Error {
  constructor(message: string, readonly exitCode = 1) {
    super(message);
    this.name = "GitbriefcaseError";
  }
}

export function assertNever(value: never): never {
  throw new GitbriefcaseError(`Unexpected value: ${String(value)}`);
}
