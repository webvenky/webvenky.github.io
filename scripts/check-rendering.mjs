// Browser smoke test against the combined preview server.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const failed = [];
    page.on('response', r => { if (r.url().startsWith('http://localhost:8080') && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
    await page.goto('http://localhost:8080/embodied-ai/', { waitUntil: 'networkidle' });
    await page.locator('.search-button').click();
    await page.locator('.search-bar').fill('MPJPE');
    await page.locator('.result-card').first().waitFor();
    await page.locator('.result-card').first().click();
    await page.locator('.katex-display').waitFor();
    assert.ok(await page.locator('.backlinks').count(), 'Backlinks missing');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflows viewport');
    await page.screenshot({ path: `.atlas-cache/atlas-${width}.png`, fullPage: true });
    assert.deepEqual(failed, []);
    console.log(`Search, internal navigation, equations, backlinks and assets passed at ${width}px`);
    await page.close();
  }
} finally { await browser.close(); }
