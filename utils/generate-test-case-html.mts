// Generates documentation/Test-Cases/test-cases.html from test-cases.json (the source of truth).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = path.join(root, 'documentation', 'Test-Cases', 'test-cases.json');
const htmlPath = path.join(root, 'documentation', 'Test-Cases', 'test-cases.html');

const source = readFileSync(jsonPath, 'utf8');
const data: { testCases?: unknown; lastUpdated?: string } = JSON.parse(source);
if (!Array.isArray(data.testCases)) {
  throw new Error('test-cases.json must contain a "testCases" array.');
}

// Update lastUpdated to current date/time in IST
function getCurrentDateIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const hours = String(istTime.getUTCHours()).padStart(2, '0');
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} IST`;
}

data.lastUpdated = getCurrentDateIST();

// Escaping "<" keeps the embedded JSON from closing the <script> element.
const embeddedJson = JSON.stringify(data).replace(/</g, '\\u003c');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cenvic — Test Cases</title>
<style>
  body { font-family: Segoe UI, Arial, sans-serif; margin: 0; background: #f5f7fa; color: #1f2933; }
  header { background: #1f3a5f; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
  header > div:first-child { flex: 1; }
  header h1 { margin: 0; font-size: 22px; }
  header p { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
  main { padding: 16px 24px; }
  section { background: #fff; border: 1px solid #d9e2ec; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; }
  h2 { font-size: 16px; margin: 0 0 10px; }
  .counts { display: flex; flex-wrap: wrap; gap: 8px; }
  .count { background: #eef2f7; border-radius: 4px; padding: 6px 10px; font-size: 13px; }
  .filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
  .filters label { display: flex; flex-direction: column; font-size: 12px; gap: 4px; }
  .filters input, .filters select { padding: 5px; font-size: 13px; min-width: 150px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #d9e2ec; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #eef2f7; }
  .tag { display: inline-block; background: #e3ecfa; border-radius: 3px; padding: 1px 6px; margin: 1px; }
  .status-tag { display: inline-block; border-radius: 3px; padding: 2px 8px; margin: 1px; font-weight: 500; font-size: 12px; white-space: nowrap; }
  .status-passed { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .status-failed { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .status-skipped { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
  .status-not-run { background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db; }
  .legend { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
  .empty { padding: 16px; text-align: center; color: #616e7c; }
  details ul, details ol { margin: 4px 0; padding-left: 20px; }
  button { padding: 6px 12px; font-size: 13px; cursor: pointer; }
  .module-summary-table { width: 100%; border-collapse: collapse; }
  .module-summary-table th { background: #eef2f7; font-weight: 600; }
  .module-summary-table td { padding: 8px; border-bottom: 1px solid #d9e2ec; text-align: center; }
  .module-summary-table td:first-child { text-align: left; font-weight: 500; }
  .pass-rate { font-weight: 600; color: #155724; }
  .pass-rate.low { color: #721c24; }
  .pass-rate.medium { color: #856404; }
  .export-buttons { display: flex; gap: 8px; flex-shrink: 0; }
  .export-buttons button { border: none; border-radius: 4px; padding: 8px 14px; cursor: pointer; font-weight: 500; font-size: 13px; white-space: nowrap; transition: all 0.2s; }
  .export-buttons button.pdf { background: #c41c3b; color: #fff; }
  .export-buttons button.pdf:hover { background: #a01830; transform: translateY(-2px); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  .export-buttons button.excel { background: #217346; color: #fff; }
  .export-buttons button.excel:hover { background: #1a5a38; transform: translateY(-2px); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.6.0/jspdf.plugin.autotable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body>
<header>
  <div>
    <h1 id="title">Test Cases</h1>
    <p id="subtitle"></p>
  </div>
  <div class="export-buttons">
    <button id="downloadPdf" type="button" class="pdf">📥 PDF</button>
    <button id="downloadExcel" type="button" class="excel">📊 Excel</button>
  </div>
</header>
<main>
  <section>
    <h2>Summary</h2>
    <div class="counts" id="counts"></div>
  </section>
  <section>
    <h2>Module Summary</h2>
    <table class="module-summary-table" id="moduleSummary">
      <thead>
        <tr>
          <th>Module</th><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Not Run</th><th>Pass Rate</th>
        </tr>
      </thead>
      <tbody id="moduleSummaryRows"></tbody>
    </table>
  </section>
  <section>
    <h2>Search and Filters</h2>
    <div class="filters">
      <label>Search<input id="search" type="search" placeholder="ID, description, tags..."></label>
      <label>Module<select id="module"></select></label>
      <label>Priority<select id="priority"></select></label>
      <label>Automation Status<select id="automationStatus"></select></label>
      <label>Execution Status<select id="executionStatus"></select></label>
      <label>Lifecycle Status<select id="lifecycleStatus"></select></label>
      <button id="reset" type="button">Reset</button>
    </div>
    <div class="tags" id="tagFilters"></div>
  </section>
  <section>
    <h2 id="resultsTitle">Test Cases</h2>
    <table>
      <thead>
        <tr>
          <th>Test Case ID</th><th>Module</th><th>Test Case</th><th>Tags</th><th>Priority</th>
          <th>Automation Status</th><th>Execution Status</th><th>Lifecycle Status</th><th>Details</th>
        </tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
  </section>
  <section>
    <h2>Status Definitions</h2>
    <div class="legend" id="legend"></div>
  </section>
</main>
<script type="application/json" id="data">${embeddedJson}</script>
<script>/* eslint-disable no-useless-escape */(function () {
  var data = JSON.parse(document.getElementById('data').textContent);
  var cases = data.testCases || [];
  var defs = data.statusDefinitions || {};
  var filterKeys = ['module', 'priority', 'automationStatus', 'executionStatus', 'lifecycleStatus'];
  var selectedTags = new Set();

  function el(tag, text, className) {
    var node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (className) node.className = className;
    return node;
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  document.getElementById('title').textContent = (data.project || 'Project') + ' — Test Cases';
  document.getElementById('subtitle').textContent = 'Last updated: ' + (data.lastUpdated || '-') + ' | Schema ' + (data.schemaVersion || '-');

  filterKeys.forEach(function (key) {
    var select = document.getElementById(key);
    select.appendChild(el('option', 'All'));
    select.options[0].value = '';
    unique(cases.map(function (c) { return c[key]; })).forEach(function (value) {
      select.appendChild(el('option', value));
    });
    select.addEventListener('change', render);
  });

  var tagBox = document.getElementById('tagFilters');
  var allTags = unique([].concat.apply([], cases.map(function (c) { return c.tags || []; })));
  if (allTags.length) tagBox.appendChild(el('span', 'Tags (all selected must match):'));
  allTags.forEach(function (tag) {
    var label = el('label');
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.addEventListener('change', function () {
      if (box.checked) selectedTags.add(tag); else selectedTags.delete(tag);
      render();
    });
    label.appendChild(box);
    label.appendChild(document.createTextNode(' ' + tag));
    tagBox.appendChild(label);
  });

  document.getElementById('search').addEventListener('input', render);
  document.getElementById('reset').addEventListener('click', function () {
    document.getElementById('search').value = '';
    filterKeys.forEach(function (key) { document.getElementById(key).value = ''; });
    selectedTags.clear();
    tagBox.querySelectorAll('input').forEach(function (box) { box.checked = false; });
    render();
  });

  function downloadPdf() {
    try {
      if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert('PDF library is still loading. Please wait a moment and try again.');
        return;
      }
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF('l', 'mm', 'a4');
      var pageWidth = doc.internal.pageSize.getWidth();
      var pageHeight = doc.internal.pageSize.getHeight();
      var margin = 10;
      var yPos = margin;

      doc.setFontSize(16);
      doc.text(data.project || 'Cenvic Test Cases', margin, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.text('Last updated: ' + (data.lastUpdated || '-'), margin, yPos);
      yPos += 6;
      
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      var rows = [];
      cases.forEach(function (c) {
        rows.push([
          c.id || '',
          c.module || '',
          c.testCase || '',
          (c.tags || []).join(', '),
          c.priority || '',
          c.automationStatus || '',
          c.executionStatus || '-',
          c.lifecycleStatus || ''
        ]);
      });

      if (doc.autoTable) {
        doc.autoTable({
          head: [['ID', 'Module', 'Test Case', 'Tags', 'Priority', 'Automation', 'Execution', 'Lifecycle']],
          body: rows,
          startY: yPos,
          margin: margin,
          headStyles: { fillColor: [31, 58, 95], textColor: [255, 255, 255], fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 15 },
            2: { cellWidth: 35 },
            3: { cellWidth: 20 },
            4: { cellWidth: 12 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 15 }
          }
        });
      }

      var filename = 'test-cases-' + new Date().toISOString().split('T')[0] + '.pdf';
      doc.save(filename);
    } catch (err) {
      alert('Error downloading PDF: ' + err.message);
    }
  }

  function downloadExcel() {
    try {
      if (typeof window.XLSX === 'undefined') {
        alert('Excel library is still loading. Please wait a moment and try again.');
        return;
      }
      var XLSX = window.XLSX;
      var wb = XLSX.utils.book_new();

      var summaryData = [
        ['Metric', 'Count'],
        ['Total Test Cases', cases.length]
      ];
      var uniqueModules = unique(cases.map(function (c) { return c.module; }));
      uniqueModules.forEach(function (m) {
        summaryData.push(['Module ' + m, cases.filter(function (c) { return c.module === m; }).length]);
      });
      ['Passed', 'Failed', 'Skipped', 'Not Run'].forEach(function (status) {
        var count = cases.filter(function (c) {
          return status === 'Not Run' ? (c.executionStatus === 'Not Run' || !c.executionStatus) : (c.executionStatus === status);
        }).length;
        summaryData.push([status, count]);
      });
      var summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 30 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

      var moduleSummaryData = [['Module', 'Total', 'Passed', 'Failed', 'Skipped', 'Not Run', 'Pass Rate']];
      uniqueModules.forEach(function (moduleName) {
        var moduleCases = cases.filter(function (c) { return c.module === moduleName; });
        var total = moduleCases.length;
        var passed = moduleCases.filter(function (c) { return c.executionStatus === 'Passed'; }).length;
        var failed = moduleCases.filter(function (c) { return c.executionStatus === 'Failed'; }).length;
        var skipped = moduleCases.filter(function (c) { return c.executionStatus === 'Skipped'; }).length;
        var notRun = moduleCases.filter(function (c) { return c.executionStatus === 'Not Run' || !c.executionStatus; }).length;
        var passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
        moduleSummaryData.push([moduleName, total, passed, failed, skipped, notRun, passRate + '%']);
      });
      var moduleSheet = XLSX.utils.aoa_to_sheet(moduleSummaryData);
      moduleSheet['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, moduleSheet, 'Module Summary');

      var testCasesData = [
        ['ID', 'Module', 'Test Case', 'Tags', 'Priority', 'Automation Status', 'Execution Status', 'Lifecycle Status', 'Preconditions', 'Test Steps', 'Expected Result']
      ];
      cases.forEach(function (c) {
        testCasesData.push([
          c.id || '',
          c.module || '',
          c.testCase || '',
          (c.tags || []).join('; '),
          c.priority || '',
          c.automationStatus || '',
          c.executionStatus || '-',
          c.lifecycleStatus || '',
          (c.preconditions || []).join('; '),
          (c.testSteps || []).join('; '),
          c.expectedResult || '-'
        ]);
      });
      var testCasesSheet = XLSX.utils.aoa_to_sheet(testCasesData);
      testCasesSheet['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 12 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 },
        { wch: 25 }, { wch: 25 }
      ];
      XLSX.utils.book_append_sheet(wb, testCasesSheet, 'Test Cases');

      var filename = 'test-cases-' + new Date().toISOString().split('T')[0] + '.xlsx';
      XLSX.writeFile(wb, filename);
    } catch (err) {
      alert('Error downloading Excel: ' + err.message);
    }
  }

  document.getElementById('downloadPdf').addEventListener('click', downloadPdf);
  document.getElementById('downloadExcel').addEventListener('click', downloadExcel);

  function matches(c) {
    var term = document.getElementById('search').value.trim().toLowerCase();
    if (term) {
      var haystack = [c.id, c.module, c.testCase, (c.tags || []).join(' ')].join(' ').toLowerCase();
      if (haystack.indexOf(term) === -1) return false;
    }
    for (var i = 0; i < filterKeys.length; i++) {
      var value = document.getElementById(filterKeys[i]).value;
      if (value && c[filterKeys[i]] !== value) return false;
    }
    var tags = c.tags || [];
    return Array.from(selectedTags).every(function (tag) { return tags.indexOf(tag) !== -1; });
  }

  function list(tag, items) {
    var node = el(tag);
    (items || []).forEach(function (item) { node.appendChild(el('li', item)); });
    return node;
  }

  function executionStatusCell(status) {
    var td = el('td');
    if (!status) {
      td.textContent = '-';
      return td;
    }
    var known = ['Passed', 'Failed', 'Skipped'].indexOf(status) !== -1;
    td.appendChild(el('span', status, 'status-tag status-' + (known ? status.toLowerCase() : 'not-run')));
    return td;
  }

  function details(c) {
    var d = el('details');
    d.appendChild(el('summary', 'View'));
    d.appendChild(el('strong', 'Preconditions'));
    d.appendChild(list('ul', c.preconditions));
    d.appendChild(el('strong', 'Test Steps'));
    d.appendChild(list('ol', c.testSteps));
    d.appendChild(el('strong', 'Expected Result'));
    d.appendChild(el('p', c.expectedResult || '-'));
    if (c.failureReason) { d.appendChild(el('strong', 'Failure Reason')); d.appendChild(el('p', c.failureReason)); }
    if (c.skipReason) { d.appendChild(el('strong', 'Skip Reason')); d.appendChild(el('p', c.skipReason)); }
    if (c.automationScript) { d.appendChild(el('strong', 'Automation Script')); d.appendChild(el('p', c.automationScript)); }
    var history = c.executionHistory || [];
    d.appendChild(el('strong', 'Execution History (' + history.length + ')'));
    d.appendChild(list('ul', history.map(function (h) {
      return [h.executedAt, h.environment, h.browser, h.status, h.reportName, h.failureReason || h.skipReason || '']
        .filter(Boolean).join(' | ');
    })));
    return d;
  }

  function addCount(box, label, value) {
    box.appendChild(el('span', label + ': ' + value, 'count'));
  }

  function renderModuleSummary() {
    var modules = unique(cases.map(function (c) { return c.module; }));
    var tbody = document.getElementById('moduleSummaryRows');
    tbody.textContent = '';

    modules.forEach(function (moduleName) {
      var moduleCases = cases.filter(function (c) { return c.module === moduleName; });
      var total = moduleCases.length;
      var passed = moduleCases.filter(function (c) { return c.executionStatus === 'Passed'; }).length;
      var failed = moduleCases.filter(function (c) { return c.executionStatus === 'Failed'; }).length;
      var skipped = moduleCases.filter(function (c) { return c.executionStatus === 'Skipped'; }).length;
      var notRun = moduleCases.filter(function (c) { return c.executionStatus === 'Not Run' || !c.executionStatus; }).length;
      var passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
      var passRateClass = passRate === 100 ? '' : (passRate >= 50 ? 'medium' : 'low');

      var tr = el('tr');
      tr.appendChild(el('td', moduleName));
      tr.appendChild(el('td', String(total)));
      tr.appendChild(el('td', String(passed)));
      tr.appendChild(el('td', String(failed)));
      tr.appendChild(el('td', String(skipped)));
      tr.appendChild(el('td', String(notRun)));
      var rateCell = el('td', passRate + '%', 'pass-rate ' + passRateClass);
      tr.appendChild(rateCell);
      tbody.appendChild(tr);
    });
  }

  function addCount(box, label, value) {
    box.appendChild(el('span', label + ': ' + value, 'count'));
  }

  function render() {
    var shown = cases.filter(matches);
    var rows = document.getElementById('rows');
    rows.textContent = '';
    if (!shown.length) {
      var tr = el('tr');
      var td = el('td', cases.length ? 'No test cases match the selected filters.' : 'No test cases have been created yet.', 'empty');
      td.colSpan = 9;
      tr.appendChild(td);
      rows.appendChild(tr);
    }
    shown.forEach(function (c) {
      var tr = el('tr');
      [c.id, c.module, c.testCase].forEach(function (v) { tr.appendChild(el('td', v || '-')); });
      var tagCell = el('td');
      (c.tags || []).forEach(function (t) { tagCell.appendChild(el('span', t, 'tag')); });
      tr.appendChild(tagCell);
      tr.appendChild(el('td', c.priority || '-'));
      tr.appendChild(el('td', c.automationStatus || '-'));
      tr.appendChild(executionStatusCell(c.executionStatus));
      tr.appendChild(el('td', c.lifecycleStatus || '-'));
      var detailCell = el('td');
      detailCell.appendChild(details(c));
      tr.appendChild(detailCell);
      rows.appendChild(tr);
    });

    document.getElementById('resultsTitle').textContent = 'Test Cases (' + shown.length + ' of ' + cases.length + ')';
    var counts = document.getElementById('counts');
    counts.textContent = '';
    addCount(counts, 'Total', cases.length);
    addCount(counts, 'Shown', shown.length);
    ['executionStatus', 'priority', 'lifecycleStatus'].forEach(function (key) {
      (defs[key] || []).forEach(function (d) {
        addCount(counts, d.value, shown.filter(function (c) { return c[key] === d.value; }).length);
      });
    });
    unique(cases.map(function (c) { return c.module; })).forEach(function (m) {
      addCount(counts, 'Module ' + m, shown.filter(function (c) { return c.module === m; }).length);
    });

    renderModuleSummary();
  }

  var legend = document.getElementById('legend');
  [['priority', 'Priority'], ['automationStatus', 'Automation Status — Is the case scripted?'],
   ['executionStatus', 'Execution Status — What happened in the last run?'],
   ['lifecycleStatus', 'Lifecycle Status — Is the case still in use?']].forEach(function (pair) {
    var box = el('div');
    box.appendChild(el('strong', pair[1]));
    var table = el('table');
    (defs[pair[0]] || []).forEach(function (d) {
      var tr = el('tr');
      tr.appendChild(el('td', d.value));
      tr.appendChild(el('td', d.meaning));
      table.appendChild(tr);
    });
    box.appendChild(table);
    legend.appendChild(box);
  });

  render();
})();
</script>
</body>
</html>
`;

writeFileSync(htmlPath, html, 'utf8');
const testCaseCount = data.testCases.length;
console.log(`Generated ${path.relative(root, htmlPath)} with ${testCaseCount} test case(s).`);
