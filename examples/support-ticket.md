# Support Ticket Bundle Example

Use this flow when a maintainer asks for repository context but you do not want to upload the whole working tree.

```sh
gitbriefcase pack . --output /tmp/my-project-support.briefcase --format dir --force
gitbriefcase inspect /tmp/my-project-support.briefcase
```

Attach or share the resulting directory after reviewing:

- `/tmp/my-project-support.briefcase/SUMMARY.md`
- `/tmp/my-project-support.briefcase/manifest.json`
- Any sensitive-looking copied files under `files/`

If the maintainer wants a single file, create a `.tar.gz` bundle instead:

```sh
gitbriefcase pack . --output /tmp/my-project-support.briefcase.tar.gz --format tgz --force
gitbriefcase inspect /tmp/my-project-support.briefcase.tar.gz
```
