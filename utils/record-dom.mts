import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';

// Usage: node utils/record-dom.mts <url> <module> <page>
const [url, moduleName, pageName] = process.argv.slice(2);
if (!url || !moduleName || !pageName) {
  console.error('Usage: node utils/record-dom.mts <url> <module> <page>');
  process.exit(1);
}

const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(new Date())
    .map((part) => [part.type, part.value]),
);
const compact = `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
const captured = `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second} IST`;

const slug = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, '-');

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

const rl = createInterface({ input: process.stdin, output: process.stdout });
await rl.question('Bring the page to the state to record (log in if needed), then press Enter to capture... ');
rl.close();

const html = await page.content();
await browser.close();

const folder = join(process.cwd(), 'dom', slug(moduleName));
const file = join(folder, `${slug(pageName)}-dom-${compact}.html`);
const header = `<!-- Module: ${moduleName} | Page: ${pageName} | URL: ${url} | Captured (IST): ${captured} -->\n`;

await mkdir(folder, { recursive: true });
await writeFile(file, header + html, { flag: 'wx' });
console.log(`DOM saved: ${file}`);
