import { readdirSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, lstatSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const excluded = new Set(['templates', 'inbox', 'node_modules']);
export function files(root, prefix = '') {
  return readdirSync(path.join(root, prefix), { withFileTypes: true }).flatMap(entry => {
    const name = path.posix.join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${name}`);
    if (entry.name.startsWith('.') || excluded.has(entry.name.toLowerCase())) return [];
    return entry.isDirectory() ? files(root, name) : [name];
  });
}

export function prepareContent(source, destination) {
  source = path.resolve(source);
  destination = path.resolve(destination);
  if (existsSync(destination)) throw new Error('Staging destination must be new and empty');
  const all = files(source);
  const notes = new Map();
  const ids = new Set();
  for (const name of all.filter(n => /\.md$/i.test(n) && !/^(README|AGENTS)\.md$/i.test(path.basename(n)))) {
    const parsed = matter(readFileSync(path.join(source, name), 'utf8'));
    if (parsed.data.publish !== true || (parsed.data.draft !== undefined && parsed.data.draft !== false)) continue;
    for (const value of [parsed.data.permalink, ...([parsed.data.aliases ?? []].flat())].filter(Boolean)) {
      if (typeof value !== 'string' || value.includes('\\') || value.startsWith('/') || value.split('/').includes('..') || /^[a-z]+:/i.test(value)) throw new Error(`Unsafe alias/permalink in ${name}`);
    }
    if (name.startsWith('Terms/')) {
      const id = parsed.data.id;
      if (typeof id !== 'string' || !/^EA-\d{3,}$/.test(id) || ids.has(id)) throw new Error(`Missing, invalid or duplicate term ID in ${name}`);
      ids.add(id);
    }
    notes.set(name, parsed);
  }
  if (!notes.has('index.md')) throw new Error('The vault needs index.md with publish: true and draft: false');
  const assets = new Set();
  const approved = new Set();
  for (const [name, note] of notes) {
    const entries = note.data.public_attachments ?? [];
    if (!Array.isArray(entries)) throw new Error(`public_attachments must be a list: ${name}`);
    for (const asset of entries) {
      if (typeof asset !== 'string' || !asset.startsWith('Attachments/') || path.posix.normalize(asset) !== asset || !all.includes(asset) || !/\.(png|jpe?g|gif|webp|avif|pdf|mp4|webm|mp3|wav)$/i.test(asset)) {
        throw new Error(`Invalid public attachment in ${name}: ${asset}`);
      }
      approved.add(asset);
    }
  }
  function check(raw, from, wiki = false) {
    let target = raw.trim();
    if (/^(https?:|mailto:|tel:)/i.test(target) || target.startsWith('#')) return;
    target = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!target) return;
    if (/^[a-z]+:/i.test(target) || target.includes('\\') || target.startsWith('/')) throw new Error(`Use vault-relative paths in ${from}: ${raw}`);
    const resolved = wiki ? path.posix.normalize(target) : path.posix.normalize(path.posix.join(path.posix.dirname(from), target));
    if (resolved.startsWith('../')) throw new Error(`Link escapes vault: ${from}`);
    if (notes.has(resolved) || notes.has(`${resolved}.md`)) return;
    if (approved.has(resolved)) { assets.add(resolved); return; }
    throw new Error(`Unpublished, missing or unapproved target in ${from}: ${raw}`);
  }
  for (const [name, note] of notes) {
    // Code examples and Obsidian comments are not navigable references.
    const body = note.content.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|%%[\s\S]*?%%/g, '');
    for (const match of body.matchAll(/!?\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) check(match[1], name, true);
    for (const match of body.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*["'])?\s*\)/g)) check(match[1].replace(/^<|>$/g, ''), name);
    for (const match of body.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) check(match[1], name);
    // Raw HTML asset paths bypass Markdown link handling; require Markdown instead.
    if (/<(?:img|video|audio|source|iframe|object|link|script)\b/i.test(body)) throw new Error(`Use Markdown embeds instead of raw HTML resources: ${name}`);
  }
  mkdirSync(destination, { recursive: true });
  for (const [name, note] of notes) {
    const target = path.join(destination, name);
    mkdirSync(path.dirname(target), { recursive: true });
    // Quartz renders the frontmatter title; keep the Obsidian H1 in the source only.
    const heading = note.content.match(/^\s*# ([^\n]+)\r?\n/);
    if (heading && heading[1].trim() === note.data.title) note.content = note.content.slice(heading[0].length);
    writeFileSync(target, matter.stringify(note.content, note.data));
  }
  for (const asset of assets) {
    const target = path.join(destination, asset);
    mkdirSync(path.dirname(target), { recursive: true });
    if (!lstatSync(path.join(source, asset)).isFile()) throw new Error(`Not a regular attachment: ${asset}`);
    copyFileSync(path.join(source, asset), target);
  }
  console.log(`Staged ${notes.size} published notes and ${assets.size} approved, referenced attachments`);
  return { notes: [...notes.keys()], assets: [...assets] };
}
