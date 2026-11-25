import { defineConfig } from '@playwright/test';
import { browserProjects } from './config/browsers/browsers';
import { loadEnvironment } from './config/environments/environment';
import { getReportName } from './utils/timestamp';

const environment = loadEnvironment();

// Set once in the main process so worker processes reuse the same report name.
const reportName = (process.env.AUTO_REPORT_NAME ??= getReportName());

export default defineConfig({
  testDir: './tests',
  outputDir: `./test-results/${reportName}`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : environment.retries,
  workers: process.env.CI ? 1 : environment.workers,
  timeout: environment.testTimeout,
  expect: { timeout: environment.expectTimeout },
  reporter: [
    ['list'],
    ['html', { outputFolder: `./reports/${reportName}`, open: 'never' }],
    ['./utils/execution-history-reporter.ts'],
  ],
  metadata: {
    reportName,
    environment: environment.name,
    timeZone: 'IST (Asia/Kolkata)',
  },
  use: {
    baseURL: environment.baseUrl,
    headless: environment.headless,
    actionTimeout: environment.actionTimeout,
    navigationTimeout: environment.navigationTimeout,
    // Stops a service worker from serving an older cached build of the app.
    serviceWorkers: 'block',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: browserProjects,
});
