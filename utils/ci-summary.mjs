import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import process from 'node:process';

const label = process.argv[2] ?? 'Playwright tests';
const reportsDir = 'reports';
const summaryFile = process.env.GITHUB_STEP_SUMMARY;

const write = (text) => (summaryFile ? appendFileSync(summaryFile, `${text}\n`) : process.stdout.write(`${text}\n`));

const resultFiles = existsSync(reportsDir)
  ? readdirSync(reportsDir)
      .filter((name) => name.endsWith('.json'))
      .sort()
  : [];

if (resultFiles.length === 0) {
  write(`## ${label}\n\nNo results were produced. The run stopped before any test finished.`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(`${reportsDir}/${resultFiles.at(-1)}`, 'utf8'));
const { expected, unexpected, flaky, skipped, duration } = report.stats;
const total = expected + unexpected + flaky + skipped;

const statusLabel = { expected: 'Passed', unexpected: 'Failed', flaky: 'Flaky', skipped: 'Skipped' };
const rows = [];

const collect = (suite) => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      rows.push({ file: spec.file, title: spec.title, status: statusLabel[test.status] ?? test.status });
    }
  }
  (suite.suites ?? []).forEach(collect);
};
report.suites.forEach(collect);

const cell = (text) => String(text).replace(/\|/g, '\\|');
const minutes = (duration / 60000).toFixed(1);
const failed = rows.filter((row) => row.status === 'Failed');

write(`## ${label}`);
write('');
write('| Total | Passed | Failed | Flaky | Skipped | Duration |');
write('| ----- | ------ | ------ | ----- | ------- | -------- |');
write(`| ${total} | ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${minutes} min |`);

if (failed.length > 0) {
  write('');
  write('### Failed cases');
  write('');
  failed.forEach((row) => write(`- ${cell(row.title)} (${row.file})`));
}

write('');
write(`<details><summary>All ${total} cases</summary>`);
write('');
write('| Status | Case | File |');
write('| ------ | ---- | ---- |');
rows.forEach((row) => write(`| ${row.status} | ${cell(row.title)} | ${row.file} |`));
write('');
write('</details>');
