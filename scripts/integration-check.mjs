import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import handler from 'serve-handler';
import assert from 'node:assert/strict';
import { prepareContent } from './prepare-content.mjs';

const temp = mkdtempSync(path.resolve('.atlas-cache/integration-'));
const vault = path.join(temp, 'vault');
const put = (name, data) => { const file = path.join(vault, name); mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, data); };
put('index.md', `---
title: Feature checks
publish: true
public_attachments: [Attachments/public.png]
---
## Terminology
[[example|Example]]
![[Attachments/public.png]]
`);
put('example.md', '---\ntitle: Example\npublish: true\ntags: [test]\n---\n$$\nx^2+y^2=z^2\n$$\n\n```mermaid\ngraph LR\n  A[Perception] --> B[Action]\n```\n\n```python\nprint("robot")\n```\n\n[[index|Home]]');
put('private.md', '---\npublish: false\n---\nPRIVATE_SENTINEL ![[Attachments/private.png]]');
put('Templates/secret.md', '---\npublish: true\n---\nPRIVATE_CONFIG');
put('.obsidian/private.json', 'PRIVATE_CONFIG');
put('Attachments/private.png', 'PRIVATE_ATTACHMENT');
put('Attachments/public.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7ioAAAAASUVORK5CYII=', 'base64'));
const content = path.join(temp, 'content');
prepareContent(vault, content);
const output = path.join(temp, 'site');
const atlas = path.join(output, 'embodied-ai');
execFileSync(process.execPath, ['quartz/bootstrap-cli.mjs', 'build', '-d', content, '-o', atlas], { cwd: path.resolve('.atlas-cache/quartz'), stdio: 'inherit' });
function audit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) audit(file);
    else assert.ok(!/PRIVATE_SENTINEL|PRIVATE_ATTACHMENT|PRIVATE_CONFIG/.test(readFileSync(file).toString()), `Private bytes leaked: ${file}`);
  }
}
audit(output);
assert.ok(!existsSync(path.join(atlas, 'private.html')));
assert.ok(!existsSync(path.join(atlas, 'Attachments/private.png')));
const index = JSON.parse(readFileSync(path.join(atlas, 'static/contentIndex.json')));
assert.deepEqual(Object.keys(index).sort(), ['example', 'index']);
const server = http.createServer((req, res) => handler(req, res, { public: output, cleanUrls: true }));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const base = `http://127.0.0.1:${server.address().port}/embodied-ai/`;
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.ok(await page.locator('article img').evaluate(img => img.complete && img.naturalWidth > 0));
  await page.locator('article a', { hasText: 'Example' }).click();
  await page.locator('.katex-display').waitFor();
  await page.locator('svg[id^="mermaid"]').first().waitFor({ timeout: 30000 });
  assert.ok(await page.locator('pre code').count());
  assert.ok(await page.locator('.backlinks a').count());
  console.log('PASS: subpath attachment, equation, Mermaid, code, backlinks; unpublished note and private attachment absent from every artifact file, search and graph index.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
