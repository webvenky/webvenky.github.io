import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareContent } from './prepare-content.mjs';

function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'atlas-privacy-'));
  const src = path.join(root, 'vault');
  mkdirSync(src);
  const put = (name, text) => { mkdirSync(path.dirname(path.join(src, name)), { recursive: true }); writeFileSync(path.join(src, name), text); };
  put('index.md', '---\npublish: true\n---\nPublic home');
  put('secret.md', '---\npublish: false\n---\nPRIVATE_SENTINEL ![[Attachments/secret.png]]');
  put('missing-flag.md', 'Unpublished by default');
  put('string-flag.md', '---\npublish: "true"\n---\nNot a boolean');
  put('draft.md', '---\npublish: true\ndraft: true\n---\nDraft');
  put('string-draft.md', '---\npublish: true\ndraft: "true"\npublic_attachments: [Attachments/secret.png]\n---\n![[Attachments/secret.png]]');
  put('Templates/leak.md', '---\npublish: true\n---\nExcluded template');
  put('.obsidian/leak.json', 'PRIVATE_CONFIG');
  put('Attachments/secret.png', 'PRIVATE_ATTACHMENT');
  put('Attachments/public.png', 'PUBLIC_ATTACHMENT');
  return { root, src, put, dest: path.join(root, 'staged') };
}
test('strict opt-in excludes private notes, configuration, templates and unreferenced assets', () => {
  const f = fixture();
  const result = prepareContent(f.src, f.dest);
  assert.deepEqual(result, { notes: ['index.md'], assets: [] });
  assert.equal(existsSync(path.join(f.dest, 'secret.md')), false);
  assert.equal(existsSync(path.join(f.dest, 'Attachments')), false);
});
test('only explicitly approved AND referenced attachments are staged', () => {
  const f = fixture();
  f.put('index.md', '---\npublish: true\npublic_attachments: [Attachments/public.png]\n---\n![[Attachments/public.png]]');
  assert.deepEqual(prepareContent(f.src, f.dest).assets, ['Attachments/public.png']);
  assert.equal(readFileSync(path.join(f.dest, 'Attachments/public.png'), 'utf8'), 'PUBLIC_ATTACHMENT');
  assert.equal(existsSync(path.join(f.dest, 'Attachments/secret.png')), false);
});
for (const link of ['[[secret]]', '![[Attachments/secret.png]]', '[secret](secret.md)', '[[../../secret]]']) {
  test(`fails closed on unsafe target ${link}`, () => {
    const f = fixture(); f.put('index.md', `---\npublish: true\n---\n${link}`);
    assert.throws(() => prepareContent(f.src, f.dest));
  });
}
