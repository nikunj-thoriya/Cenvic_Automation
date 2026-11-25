// Generates documentation/RTM/rtm.html from rtm-requirements.json and test-cases.json (the sources of truth).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Requirement {
  requirementId: string;
  module: string;
  feature: string;
  description: string;
  testCaseIds: string[];
  remarks: string;
}

interface RtmSource {
  project: string;
  title: string;
  version: string;
  lastUpdated: string;
  scope: string[];
  note: string;
  requirements: Requirement[];
}

interface TestCase {
  id: string;
  module: string;
  testCase: string;
  automationStatus: string;
  executionStatus: string;
  automationScript: string;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rtmPath = path.join(root, 'documentation', 'RTM', 'rtm-requirements.json');
const casesPath = path.join(root, 'documentation', 'Test-Cases', 'test-cases.json');
const htmlPath = path.join(root, 'documentation', 'RTM', 'rtm.html');

const rtm: RtmSource = JSON.parse(readFileSync(rtmPath, 'utf8'));
const casesFile: { testCases?: TestCase[] } = JSON.parse(readFileSync(casesPath, 'utf8'));
if (!Array.isArray(rtm.requirements)) throw new Error('rtm-requirements.json must contain a "requirements" array.');
if (!Array.isArray(casesFile.testCases)) throw new Error('test-cases.json must contain a "testCases" array.');

const caseById = new Map(casesFile.testCases.map((tc) => [tc.id, tc]));

const mappedBy = new Map<string, string>();
for (const req of rtm.requirements) {
  for (const id of req.testCaseIds) {
    const tc = caseById.get(id);
    if (!tc) throw new Error(`"${req.feature}" maps ${id}, which is not in test-cases.json.`);
    if (tc.module !== req.module)
      throw new Error(`${id} belongs to module "${tc.module}" but is mapped under "${req.module}".`);
    if (mappedBy.has(id)) throw new Error(`${id} is mapped twice ("${mappedBy.get(id)}" and "${req.feature}").`);
    mappedBy.set(id, req.feature);
  }
}

const unmapped = casesFile.testCases.filter((tc) => rtm.scope.includes(tc.module) && !mappedBy.has(tc.id));

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const delivered = new Set(['Automated', 'Manual']);

function coverageOf(cases: TestCase[]): string {
  const done = cases.filter((tc) => delivered.has(tc.automationStatus)).length;
  if (done === 0) return 'Not Covered';
  return done === cases.length ? 'Covered' : 'Partially Covered';
}

function executionOf(cases: TestCase[]): string {
  if (cases.some((tc) => tc.executionStatus === 'Failed')) return 'Failed';
  if (cases.every((tc) => tc.executionStatus === 'Passed')) return 'Passed';
  if (cases.some((tc) => tc.executionStatus === 'Passed' || tc.executionStatus === 'Skipped')) return 'Partially Run';
  return 'Not Run';
}

function countBy(cases: TestCase[], status: string): number {
  return cases.filter((tc) => tc.automationStatus === status).length;
}

interface Row {
  req: Requirement;
  cases: TestCase[];
  coverage: string;
  execution: string;
}

const rows: Row[] = rtm.requirements.map((req) => {
  const cases = req.testCaseIds.map((id) => caseById.get(id) as TestCase);
  return { req, cases, coverage: coverageOf(cases), execution: executionOf(cases) };
});

const allMapped = rows.flatMap((r) => r.cases);

function istNow(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())} ${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())} IST`;
}

const statusClass = (value: string): string => `status-${slug(value)}`;

const summaryCounts: [string, number][] = [
  ['Requirements', rows.length],
  ['Test cases mapped', allMapped.length],
  ['Automated', countBy(allMapped, 'Automated')],
  ['Manual', countBy(allMapped, 'Manual')],
  ['Planned', countBy(allMapped, 'Planned')],
  ['Covered', rows.filter((r) => r.coverage === 'Covered').length],
  ['Partially Covered', rows.filter((r) => r.coverage === 'Partially Covered').length],
  ['Not Covered', rows.filter((r) => r.coverage === 'Not Covered').length],
  ['Requirement IDs assigned', rows.filter((r) => r.req.requirementId.trim() !== '').length],
];

const moduleRows = rtm.scope
  .map((moduleName) => {
    const moduleReqs = rows.filter((r) => r.req.module === moduleName);
    const moduleCases = moduleReqs.flatMap((r) => r.cases);
    const total = casesFile.testCases?.filter((tc) => tc.module === moduleName).length ?? 0;
    return `<tr><td>${escapeHtml(moduleName)}</td><td>${moduleReqs.length}</td><td>${moduleCases.length} of ${total}</td><td>${countBy(moduleCases, 'Automated')}</td><td>${countBy(moduleCases, 'Manual')}</td><td>${countBy(moduleCases, 'Planned')}</td><td>${moduleReqs.filter((r) => r.coverage === 'Covered').length}</td><td>${moduleReqs.filter((r) => r.coverage === 'Partially Covered').length}</td><td>${moduleReqs.filter((r) => r.coverage === 'Not Covered').length}</td></tr>`;
  })
  .join('\n');

const gapItems: string[] = [
  `<li>Test cases without a requirement mapping: ${unmapped.length === 0 ? 'None' : unmapped.map((tc) => escapeHtml(tc.id)).join(', ')}</li>`,
  `<li>Requirements without automation: ${
    rows
      .filter((r) => countBy(r.cases, 'Automated') === 0)
      .map((r) => escapeHtml(r.req.feature))
      .join('; ') || 'None'
  }</li>`,
  `<li>Requirements with failed tests: ${
    rows
      .filter((r) => r.execution === 'Failed')
      .map((r) => escapeHtml(r.req.feature))
      .join('; ') || 'None'
  }</li>`,
  `<li>Requirements without a Requirement ID: ${rows.filter((r) => r.req.requirementId.trim() === '').length} of ${rows.length}</li>`,
];

const tableRows = rows
  .map(({ req, cases, coverage, execution }) => {
    const ids = cases
      .map((tc) => `<span class="tc" title="${escapeHtml(tc.testCase)}">${escapeHtml(tc.id)}</span>`)
      .join(' ');
    const scripts = [...new Set(cases.map((tc) => tc.automationScript).filter((s) => s))]
      .map((s) => escapeHtml(s))
      .join('<br>');
    const automation = `Automated ${countBy(cases, 'Automated')}, Manual ${countBy(cases, 'Manual')}, Planned ${countBy(cases, 'Planned')}`;
    const search = [req.requirementId, req.module, req.feature, req.description, ...req.testCaseIds]
      .join(' ')
      .toLowerCase();
    return `<tr data-module="${escapeHtml(req.module)}" data-coverage="${escapeHtml(coverage)}" data-search="${escapeHtml(search)}">
  <td>${req.requirementId.trim() === '' ? '<span class="blank">Not assigned</span>' : escapeHtml(req.requirementId)}</td>
  <td>${escapeHtml(req.module)}</td>
  <td><strong>${escapeHtml(req.feature)}</strong><br>${escapeHtml(req.description)}</td>
  <td>${ids}</td>
  <td>${scripts || '-'}</td>
  <td>${escapeHtml(automation)}</td>
  <td><span class="status-tag ${statusClass(execution)}">${escapeHtml(execution)}</span></td>
  <td><span class="status-tag ${statusClass(coverage)}">${escapeHtml(coverage)}</span></td>
  <td>${req.remarks ? escapeHtml(req.remarks) : '-'}</td>
</tr>`;
  })
  .join('\n');

const options = (values: string[]): string =>
  [
    '<option value="">All</option>',
    ...values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`),
  ].join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(rtm.project)} — ${escapeHtml(rtm.title)}</title>
<style>
  body { font-family: Segoe UI, Arial, sans-serif; margin: 0; background: #f5f7fa; color: #1f2933; }
  header { background: #1f3a5f; color: #fff; padding: 16px 24px; }
  header h1 { margin: 0; font-size: 22px; }
  header p { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
  main { padding: 16px 24px; }
  section { background: #fff; border: 1px solid #d9e2ec; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; }
  h2 { font-size: 16px; margin: 0 0 10px; }
  .counts { display: flex; flex-wrap: wrap; gap: 8px; }
  .count { background: #eef2f7; border-radius: 4px; padding: 6px 10px; font-size: 13px; }
  .note { background: #fff3cd; border: 1px solid #ffeeba; color: #533f03; border-radius: 4px; padding: 8px 12px; font-size: 13px; }
  .filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
  .filters label { display: flex; flex-direction: column; font-size: 12px; gap: 4px; }
  .filters input, .filters select { padding: 5px; font-size: 13px; min-width: 150px; }
  button { padding: 6px 12px; font-size: 13px; cursor: pointer; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #d9e2ec; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #eef2f7; }
  .tc { display: inline-block; background: #e3ecfa; border-radius: 3px; padding: 1px 6px; margin: 1px; white-space: nowrap; }
  .blank { color: #616e7c; font-style: italic; }
  .status-tag { display: inline-block; border-radius: 3px; padding: 2px 8px; font-weight: 500; font-size: 12px; white-space: nowrap; }
  .status-passed, .status-covered { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .status-failed, .status-not-covered { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .status-partially-run, .status-partially-covered { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
  .status-not-run { background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db; }
  .legend { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; font-size: 13px; }
  ul { margin: 4px 0; padding-left: 20px; }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(rtm.project)} — ${escapeHtml(rtm.title)}</h1>
  <p>Scope: ${rtm.scope.map(escapeHtml).join(', ')} | Version ${escapeHtml(rtm.version)} | Last updated ${escapeHtml(istNow())}</p>
</header>
<main>
  <section>
    <div class="note">${escapeHtml(rtm.note)}</div>
  </section>
  <section>
    <h2>Summary</h2>
    <div class="counts">
${summaryCounts.map(([label, value]) => `      <div class="count">${escapeHtml(label)}: <strong>${value}</strong></div>`).join('\n')}
    </div>
  </section>
  <section>
    <h2>Module Summary</h2>
    <table>
      <thead>
        <tr><th>Module</th><th>Requirements</th><th>Test Cases Mapped</th><th>Automated</th><th>Manual</th><th>Planned</th><th>Covered</th><th>Partially Covered</th><th>Not Covered</th></tr>
      </thead>
      <tbody>
${moduleRows}
      </tbody>
    </table>
  </section>
  <section>
    <h2>Traceability Gaps</h2>
    <ul>
${gapItems.join('\n')}
    </ul>
  </section>
  <section>
    <h2>Search and Filters</h2>
    <div class="filters">
      <label>Search<input id="search" type="search" placeholder="Feature, description, test case ID..."></label>
      <label>Module<select id="module">${options(rtm.scope)}</select></label>
      <label>Coverage Status<select id="coverage">${options(['Covered', 'Partially Covered', 'Not Covered'])}</select></label>
      <button id="reset" type="button">Reset</button>
    </div>
  </section>
  <section>
    <h2 id="resultsTitle">Requirement Traceability</h2>
    <table>
      <thead>
        <tr><th>Requirement ID</th><th>Module</th><th>Requirement</th><th>Test Case IDs</th><th>Automation Script</th><th>Automation</th><th>Execution Status</th><th>Coverage Status</th><th>Remarks</th></tr>
      </thead>
      <tbody id="rows">
${tableRows}
      </tbody>
    </table>
  </section>
  <section>
    <h2>Definitions</h2>
    <div class="legend">
      <div><strong>Covered</strong>: every mapped test case is Automated or Manual.</div>
      <div><strong>Partially Covered</strong>: some mapped test cases are Automated or Manual and the rest are not yet.</div>
      <div><strong>Not Covered</strong>: no mapped test case is Automated or Manual.</div>
      <div><strong>Execution Status</strong>: Failed if any mapped case failed; Passed if all passed; Partially Run if some passed or were skipped; otherwise Not Run. Manual cases are not run by the automation.</div>
    </div>
  </section>
</main>
<script>(function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll('#rows tr'));
  var search = document.getElementById('search');
  var moduleSelect = document.getElementById('module');
  var coverage = document.getElementById('coverage');
  function apply() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (row) {
      var ok = (!q || row.getAttribute('data-search').indexOf(q) !== -1) &&
        (!moduleSelect.value || row.getAttribute('data-module') === moduleSelect.value) &&
        (!coverage.value || row.getAttribute('data-coverage') === coverage.value);
      row.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    document.getElementById('resultsTitle').textContent = 'Requirement Traceability (' + shown + ' of ' + rows.length + ')';
  }
  [search, moduleSelect, coverage].forEach(function (el) { el.addEventListener('input', apply); });
  document.getElementById('reset').addEventListener('click', function () {
    search.value = ''; moduleSelect.value = ''; coverage.value = ''; apply();
  });
  apply();
})();</script>
</body>
</html>
`;

writeFileSync(htmlPath, html, 'utf8');
console.log(
  `Generated ${path.relative(root, htmlPath)} with ${rows.length} requirement(s) and ${allMapped.length} mapped test case(s).`,
);
if (unmapped.length > 0) console.warn(`Unmapped test cases: ${unmapped.map((tc) => tc.id).join(', ')}`);
