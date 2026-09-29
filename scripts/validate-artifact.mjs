import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[2] ?? '_site');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const atlas = path.join(root, 'embodied-ai');
assert.ok(existsSync(path.join(atlas, 'index.html')), 'Atlas landing page missing');
const paths = walk(root);
for (const file of paths) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  assert.ok(!/(^|\/)(\.atlas-cache|\.obsidian|Templates|Inbox|node_modules|vendor|scripts|atlas)(\/|$)/i.test(relative), `Build/private directory leaked: ${relative}`);
  assert.ok(!/\.(md|ya?ml|tsx?|lock)$/i.test(relative), `Source file leaked: ${relative}`);
  if (/\.(html|json|xml|txt)$/i.test(file)) {
    assert.ok(!/PRIVATE_SENTINEL|PRIVATE_ATTACHMENT|PRIVATE_CONFIG/.test(readFileSync(file, 'utf8')), `Privacy sentinel leaked: ${relative}`);
  }
}
let checked = 0;
for (const file of paths.filter(p => p.startsWith(atlas + path.sep) && p.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const base = new URL(path.relative(root, file).replaceAll('\\', '/'), 'https://webvenky.github.io/');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base);
    if (url.origin !== base.origin || !url.pathname.startsWith('/embodied-ai')) continue;
    const target = path.join(root, decodeURIComponent(url.pathname));
    assert.ok([target, `${target}.html`, path.join(target, 'index.html')].some(existsSync), `Broken atlas URL ${url.pathname} in ${path.relative(root, file)}`);
    checked++;
  }
}
const home = readFileSync(path.join(atlas, 'index.html'), 'utf8');
assert.match(home, /search-button/);
assert.match(home, /Terminology/);
const contentIndex = JSON.parse(readFileSync(path.join(atlas, 'static/contentIndex.json'), 'utf8'));
assert.ok(Object.keys(contentIndex).length > 0, 'Search/graph index empty');
console.log(`Validated ${checked} atlas links/assets, ${Object.keys(contentIndex).length} indexed notes, and ${paths.length} artifact files for source/private leaks.`);
