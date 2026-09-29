import { mkdtempSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { prepareContent } from './prepare-content.mjs';

const source = path.resolve(process.argv[2] ?? '../rai_notes/RAI_Notes_Test/rai_notes_obsidian_quartz');
const quartz = path.resolve('.atlas-cache/quartz');
if (!existsSync(quartz)) throw new Error('Run npm run atlas:setup first');
try {
  const commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  console.log(`Notes commit: ${commit}`);
  const dirty = execFileSync('git', ['-C', source, 'status', '--porcelain'], { encoding: 'utf8' }).trim();
  if (dirty) console.log('Local preview includes uncommitted notes changes. CI builds the checked-out commit.');
} catch {
  if (process.env.CI) throw new Error('CI requires a committed notes checkout');
  console.log('Notes commit: uncommitted local vault (preview only)');
}
const temp = mkdtempSync(path.resolve('.atlas-cache/staging-'));
const content = path.join(temp, 'content');
prepareContent(source, content);
execFileSync(process.execPath, ['quartz/bootstrap-cli.mjs', 'build', '-d', content, '-o', path.resolve('_site/embodied-ai')], { cwd: quartz, stdio: 'inherit' });
