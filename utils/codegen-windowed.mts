import { chromium } from '@playwright/test';

const [url] = process.argv.slice(2);
if (!url) {
  console.error('Usage: node utils/codegen-windowed.mts <url>');
  console.error('Example: node utils/codegen-windowed.mts https://cenvicagencydev.alliancetek.net/');
  process.exit(1);
}

const width = parseInt(process.env.CODEGEN_WIDTH ?? '1400', 10);
const height = parseInt(process.env.CODEGEN_HEIGHT ?? '900', 10);

console.log(`Opening Codegen-like recorder at ${url}`);
console.log(`Window size: ${width}x${height}`);
console.log('');
console.log('Note: To use the full Playwright Codegen Inspector, run:');
console.log(`  npx.cmd playwright codegen --browser=chromium "${url}"`);
console.log('Then manually resize the window by dragging the edges.');
console.log('');

// Launch browser WITHOUT full screen
const context = await chromium.launchPersistentContext('', {
  headless: false,
  viewport: { width, height },
  args: [
    '--disable-fullscreen=true',
    '--disable-extensions',
    `--window-size=${width},${height}`,
    '--start-maximized=false',
  ],
  recordVideo: { dir: 'test-results/codegen-recordings' },
});

const page = context.pages()[0] || (await context.newPage());
await page.goto(url, { waitUntil: 'networkidle' });

console.log('Browser opened in windowed mode. Recording video to test-results/codegen-recordings/');
console.log('Close the browser when done.');
console.log('');

// Keep running until browser closes
await context.close();
