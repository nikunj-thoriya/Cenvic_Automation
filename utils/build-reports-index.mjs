// Builds index.html listing every published run (found via meta.json) in the gh-pages checkout.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const root = process.argv[2] ?? '.';

const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

const runs = [];
const walk = (dir, rel) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    if (entry.isDirectory()) {
      walk(join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name);
    } else if (entry.name === 'meta.json') {
      try {
        runs.push({ ...JSON.parse(readFileSync(join(dir, entry.name), 'utf8')), path: rel });
      } catch {
        // Skip unreadable metadata so one bad folder cannot break the index.
      }
    }
  }
};
walk(root, '');

runs.sort((a, b) => String(b.date).localeCompare(String(a.date)));

const rows = runs
  .map((r) => {
    const badge = r.result === 'success' ? 'pass' : 'fail';
    const label = r.result === 'success' ? 'Passed' : r.result === 'failure' ? 'Failed' : esc(r.result);
    return `<tr>
  <td>${esc(r.date)}</td>
  <td>${esc(r.kind)}</td>
  <td>${esc(r.author)}</td>
  <td>${esc(r.title)}</td>
  <td><span class="${badge}">${label}</span></td>
  <td><a href="${esc(r.path)}/">Playwright report</a></td>
  <td><a href="${esc(r.run_url)}">Run #${esc(r.run_number)}</a></td>
</tr>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Cenvic Playwright Reports</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #1f2328; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #d0d7de; padding: 6px 10px; text-align: left; font-size: 14px; }
  th { background: #f6f8fa; }
  .pass { color: #1a7f37; font-weight: 600; }
  .fail { color: #cf222e; font-weight: 600; }
</style>
</head>
<body>
<h1>Cenvic Playwright Reports</h1>
<p>${runs.length} published run(s), newest first.</p>
<table>
<tr><th>Date (UTC)</th><th>Type</th><th>Author</th><th>Title</th><th>Result</th><th>Report</th><th>CI run</th></tr>
${rows}
</table>
</body>
</html>
`;

writeFileSync(join(root, 'index.html'), html);
