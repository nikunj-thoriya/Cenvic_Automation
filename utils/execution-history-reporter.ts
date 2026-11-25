import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import { format, resolveConfig } from 'prettier';
import type { FullConfig, Reporter, Suite, TestCase } from '@playwright/test/reporter';
import { getIstDateTime } from './timestamp';

type ExecutionStatus = 'Passed' | 'Failed' | 'Skipped';

interface HistoryEntry {
  reportName: string;
  executedAt: string;
  environment: string;
  browser: string;
  status: ExecutionStatus;
  retries: number;
  failureReason: string;
  skipReason: string;
  reportPath: string;
}

/** Convert report name from AUTO-REPORT-20261125-120148 to 2026-11-25 12:01:48 IST for readability. */
function formatReportName(name: string): string {
  const match = /AUTO-REPORT-(\d{8})-(\d{6})/.exec(name);
  if (!match) return name;
  const [, date, time] = match;
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  const hour = time.slice(0, 2);
  const min = time.slice(2, 4);
  const sec = time.slice(4, 6);
  return `${year}-${month}-${day} ${hour}:${min}:${sec} IST`;
}

interface StoredTestCase {
  id: string;
  executionStatus: string;
  failureReason: string;
  skipReason: string;
  executionHistory: HistoryEntry[];
}

interface TestCaseFile {
  testCases: StoredTestCase[];
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(PROJECT_ROOT, 'documentation', 'Test-Cases', 'test-cases.json');
const HTML_GENERATOR_PATH = path.join(PROJECT_ROOT, 'utils', 'generate-test-case-html.mts');
const TEST_CASE_ID = /^(TC-[A-Z]+(?:-[A-Z]+)*-\d+):/;

function getStatus(test: TestCase): ExecutionStatus {
  const outcome = test.outcome();
  if (outcome === 'skipped') return 'Skipped';
  // A test that failed and then passed on retry counts as Passed; the retry count is recorded separately.
  return outcome === 'unexpected' ? 'Failed' : 'Passed';
}

/** Converts a technical Playwright error into a sentence a non-technical reader can follow. */
function toPlainFailure(technical: string): string {
  const timeoutMs = /Timeout:?\s*(\d+)ms/.exec(technical)?.[1];
  const within = timeoutMs ? ` within ${Number(timeoutMs) / 1000} seconds` : ' in time';
  const expectedMessage = /getByRole\('alert'\)\.filter\(\{ hasText: '([^']+)' \}\)/.exec(technical);
  if (expectedMessage) return `The message "${expectedMessage[1]}" did not appear on the screen${within}.`;
  if (/toHaveURL/.test(technical)) return `The page did not open the expected address${within}.`;
  if (/waitForEvent/.test(technical)) return `The new tab or window did not open${within}.`;
  if (/toBeVisible/.test(technical)) return `An expected item did not appear on the screen${within}.`;
  if (/Timeout/i.test(technical)) return `The page took too long to respond${within}.`;
  return 'The test did not pass. Check the detailed report for more information.';
}

function summarizeError(test: TestCase): string {
  const message = test.results.at(-1)?.error?.message;
  if (!message) return 'The test failed without a reason. Check the detailed report.';
  const lines = stripVTControlCharacters(message)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const callLogIndex = lines.findIndex((line) => line.startsWith('Call log'));
  const technical = lines.slice(0, callLogIndex === -1 ? lines.length : callLogIndex).join(' | ');
  return toPlainFailure(technical);
}

function getSkipReason(test: TestCase): string {
  const annotation = test.annotations.find((item) => item.type === 'skip' || item.type === 'fixme');
  return annotation?.description ?? 'Skipped without a stated reason.';
}

/** Writes each run's result for tests named "TC-<MODULE>-<NNN>: ..." into test-cases.json and regenerates the HTML. */
export default class ExecutionHistoryReporter implements Reporter {
  private config?: FullConfig;
  private suite?: Suite;

  onBegin(config: FullConfig, suite: Suite): void {
    this.config = config;
    this.suite = suite;
  }

  async onEnd(): Promise<void> {
    try {
      await this.recordResults();
    } catch (error) {
      console.error('Execution history was not updated:', error);
    }
  }

  private async recordResults(): Promise<void> {
    const metadata = this.config?.metadata as { reportName?: string; environment?: string } | undefined;
    if (!this.suite || !metadata?.reportName || !metadata.environment) {
      throw new Error('Report name or environment is missing from the Playwright metadata.');
    }

    const data = JSON.parse(readFileSync(JSON_PATH, 'utf8')) as TestCaseFile;
    let updated = 0;

    for (const test of this.suite.allTests()) {
      const id = TEST_CASE_ID.exec(test.title)?.[1];
      const stored = data.testCases.find((testCase) => testCase.id === id);
      // A test without results never ran, so its status stays as it was.
      if (!stored || test.results.length === 0) continue;

      const status = getStatus(test);
      const failureReason = status === 'Failed' ? summarizeError(test) : '';
      const skipReason = status === 'Skipped' ? getSkipReason(test) : '';

      stored.executionStatus = status;
      stored.failureReason = failureReason;
      stored.skipReason = skipReason;
      stored.executionHistory.push({
        reportName: formatReportName(metadata.reportName),
        executedAt: getIstDateTime(test.results[0].startTime),
        environment: metadata.environment,
        browser: test.parent.project()?.name ?? 'unknown',
        status,
        retries: test.results.length - 1,
        failureReason,
        skipReason,
        reportPath: `reports/${metadata.reportName}/index.html`,
      });
      updated++;
    }

    if (updated === 0) return;

    const options = (await resolveConfig(JSON_PATH)) ?? {};
    writeFileSync(JSON_PATH, await format(JSON.stringify(data), { ...options, filepath: JSON_PATH }));
    execFileSync(process.execPath, [HTML_GENERATOR_PATH], { stdio: 'ignore' });
  }
}
