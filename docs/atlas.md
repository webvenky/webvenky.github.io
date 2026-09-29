# Robotics and Embodied AI Atlas

The personal site remains Jekyll. Quartz 4.5.2 (exact commit in `atlas/version.json`) builds into `_site/embodied-ai/` after Jekyll. Only `_site` is uploaded; a single Pages workflow deploys it. The existing tracked `build/` directory is left intact for compatibility, but is not the deployment source.

## First publication: required GitHub setup

The notes remote initially accepted authenticated SSH but advertised no commits or branches; the existing local vault has now been committed and pushed to `main` (initial commit `d1dc0c0`). Unauthenticated GitHub returned 404, consistent with a private repository. Its 31-term vault is at `RAI_Notes_Test/rai_notes_obsidian_quartz`; retain that path. No source notes are copied into the website repository.

1. The initial vault and publication workflow are already pushed to `webvenky/rai_notes` on `main`. Check that private files are appropriate for the repository's visibility; website filtering does not hide source in a public repository.
2. Create a fine-grained personal access token restricted to **webvenky/rai_notes**, with repository **Contents: read** (Metadata read is automatic). In the **website repository**, Settings → Secrets and variables → Actions → New repository secret, save it as **ATLAS_NOTES_READ_TOKEN**. If notes are made public, this secret can be omitted. The workflow's default token cannot read a different private repository.
3. Create a separate fine-grained token restricted to **webvenky/webvenky.github.io**, with **Contents: read and write**, the minimum permission GitHub requires for `repository_dispatch`. Save it in the **notes repository** as **WEBSITE_DISPATCH_TOKEN**. No Pages, Administration, or Workflows permission is needed to dispatch. Set token expiry reminders and renew secrets when needed. A GitHub App installation token with the same permissions is an alternative.
4. Commit and push the website integration to **master**, its current default branch. Dispatch and manual workflows must exist on the default branch. If the default branch changes, update `pages.yml` too.
5. Website Settings → Pages → Build and deployment → Source: **GitHub Actions**. This replaces the current `pages-build-deployment` branch build. Keep `pages.yml` as the only deploying workflow; the notes workflow only sends a rebuild event. If the `github-pages` environment restricts branches, allow `master`.
6. Under website Actions → **Build and deploy website and atlas**, choose **Run workflow**. Check the logged notes commit, successful build, and deployment URL. Notes pushes to `main` then request publication automatically. Dispatch payloads cannot choose a different checkout: builds always read current `main`.

The `pages` concurrency group serializes combined builds/deployments. No workflow writes commits, so there is no publication loop. A failed notes checkout or build stops deployment and leaves the previous site online.

SSH push access alone cannot set Actions secrets or switch the Pages source. Those settings must be configured by an account with repository settings access.

## Open and write in Obsidian

Open folder as vault: `rai_notes/RAI_Notes_Test/rai_notes_obsidian_quartz` (not the parent repository). Enable the built-in Templates plugin and select `Templates`. The existing structure includes Terms, Topics, Papers, Articles and Inbox. Create `Attachments` as needed. Obsidian configuration and templates are excluded from publication.

Duplicate `Templates/Term.md` into `Terms`. Allocate the next unused `EA-###` ID after inspecting existing notes (EA-001 through EA-031 currently exist). Keep one canonical note per concept and preserve its filename and ID. Add aliases for synonyms, a short definition, technical explanation/formula, concrete example, limitations, related concepts, primary sources, and your own observations. Preserve uncertainty with `review_status: needs-review`; a publishing choice does not imply verification.

Use vault-relative wikilinks such as `[[Terms/ea-008-policy|Policy]]` and `[[Topics/control|Control]]`. Standard Markdown links are relative to the current file. Add the term to the alphabetical index and relevant topic guide. Link articles and paper notes to canonical terms rather than duplicating definitions. Equations use `$...$` or `$$...$$`; diagrams use fenced `mermaid` blocks; code fences should name their language.

Set boolean `publish: true` and `draft: false` to publish, and update `updated`. Missing flags, string `"true"`, and drafts stay unpublished. Links from public notes to private or missing notes fail the build: remove the public link or deliberately publish its target.

For attachments, explicitly approve each public file in a published note:

```yaml
public_attachments:
  - Attachments/robot.png
```

Then embed `![[Attachments/robot.png]]`. Only approved **and referenced** attachments are staged. Supported formats are PNG, JPEG, GIF, WebP, AVIF, PDF, MP4, WebM, MP3, WAV. Raw HTML resource embeds are rejected; use Markdown. A private note's attachment is never copied just because it exists. Approving a shared attachment makes that file public, so use separate files for private material. Remove metadata from sensitive photos/PDFs before explicitly publishing them.

## Local preview

Install Git, Node 22 or later, npm 10.9.2 or later, Ruby 3.3 and Bundler. On Windows use RubyInstaller **with DevKit** and complete its MSYS2 development-tools setup (Jekyll's live-reload dependencies need native compilation). From the website repository:

```sh
npm ci
bundle install
npm run atlas:setup
npm test
bundle exec jekyll build --destination _site
npm run atlas:build
node scripts/validate-artifact.mjs
npm run preview
```

Open **http://localhost:8080/** and **http://localhost:8080/embodied-ai/**. The default notes path is the sibling checkout described above; override with `npm run atlas:build -- /absolute/path/to/vault`. Rebuild after editing. Run Jekyll **before** Quartz, since Jekyll cleans `_site`. An uncommitted local vault is allowed for preview and labeled in logs; CI requires a notes commit. Temporary staging and the Quartz checkout remain in ignored `.atlas-cache/`.

Optional browser checks: `npx playwright install chromium`, then, with the preview running, `node scripts/check-rendering.mjs`. Privacy and feature integration checks: `node scripts/integration-check.mjs` (builds a temporary fixture outside the deployment output).

## Publish and troubleshoot

Commit and push notes to `main`. The notes action requests a website rebuild; watch both repositories' Actions tabs. To republish without content changes, run either workflow manually. The website build logs the exact notes commit.

- Checkout 404/403 or missing main: push the initial notes commit; check token repository selection, Contents read permission, expiry and organization approval if applicable.
- Dispatch 401/403: check `WEBSITE_DISPATCH_TOKEN`, target repository, Contents write permission and expiry. A successful dispatch returns HTTP 204; the receiving workflow must be on the website default branch.
- Invalid or duplicate ID, missing target, or unapproved attachment: fix the named source note. Publish only what you intend; do not bypass the staging filter.
- Deployment denied: select Pages → GitHub Actions and check the `github-pages` environment's branch policy.
- Wrong paths or missing styles: serve `_site`, not `_site/embodied-ai`, and check `baseUrl` includes `/embodied-ai`. Re-run the artifact and browser checks.
- Quartz pin mismatch: remove only the disposable `.atlas-cache/quartz` checkout and rerun setup. Preserve the source vault.

## Update Quartz

Review the official release/tag and versioned documentation. Update `atlas/version.json` with a stable release and its resolved commit, create a fresh cached checkout, and adjust the two configuration files and CSS to that release. `npm run atlas:setup` uses the upstream committed lockfile via `npm ci`. Run privacy tests, integration checks, both builds and browser checks before pushing. Do not run `quartz sync` or deploy Quartz separately. Version 5 has a different configuration/plugin model; upgrading requires migration, not just changing the tag.

## Revert a published update

In the notes repository, `git revert <bad-commit>` then push `main`; the dispatcher rebuilds from the reverted content. To withdraw a note, set `publish: false`, remove public links to it and remove unneeded attachment approvals, then push. Quartz recreates its output each build, removing withdrawn pages and assets. Revert website changes in the website repository when the error is in styling/configuration. Do not merely rerun an old workflow to roll back content: it still reads current notes `main`.

## Official references consulted

- [Quartz 4.5.2 release/tag](https://github.com/jackyzha0/quartz/releases/tag/v4.5.2) and [versioned configuration](https://github.com/jackyzha0/quartz/blob/v4.5.2/docs/configuration.md)
- [Current Quartz hosting documentation](https://quartz.jzhao.xyz/hosting) (currently describes v5; this integration deliberately uses v4 configuration)
- [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Repository dispatch permissions](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) and [workflow event behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#repository_dispatch)
