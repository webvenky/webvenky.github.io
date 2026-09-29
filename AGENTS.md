# Website and atlas

The existing site is Jekyll. Preserve its pages, permalinks, and standalone tools.
Quartz is mounted at `/embodied-ai/`; `.github/workflows/pages.yml` owns the single combined Pages deployment.

For atlas builds, publishing changes, credential setup, previews, or upgrades, read [docs/atlas.md](docs/atlas.md).
The authoritative content is in `webvenky/rai_notes`, branch `main`, under `RAI_Notes_Test/rai_notes_obsidian_quartz`.
Keep source notes in that repository and generated output in ignored build directories.

Preserve stable term IDs, canonical filenames, and the author's personal observations. Check for existing concepts before adding terms. Attach primary sources to technical claims and mark uncertainty `review_status: needs-review`.
New notes default to `publish: false`. Preserve the strict staging boundary and explicit attachment approval when modifying the pipeline.
Run `npm test`, both site builds, and `node scripts/validate-artifact.mjs` before considering build changes complete.
