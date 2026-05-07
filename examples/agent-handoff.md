# Agent Handoff Bundle Example

Use this flow to give a coding agent enough context to reason about a repository without shipping dependency folders, build artifacts, or local environment files.

```sh
gitbriefcase pack . --output /tmp/agent-handoff.briefcase --format dir --force
cat /tmp/agent-handoff.briefcase/SUMMARY.md
```

Suggested handoff prompt:

```text
Review the attached gitbriefcase bundle. Start with SUMMARY.md and manifest.json. Treat redactions as intentional and ask before relying on skipped files.
```

If the agent environment accepts archives:

```sh
gitbriefcase pack . --output /tmp/agent-handoff.briefcase.tar.gz --format tgz --force
```
