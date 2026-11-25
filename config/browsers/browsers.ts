import { devices, type Project } from '@playwright/test';

const allBrowserProjects: Project[] = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
];

export const DEFAULT_BROWSER = 'chromium';

/** Browser is selected with BROWSER=chromium | firefox | webkit (defaults to chromium). */
const selectedBrowser = process.env.BROWSER?.trim().toLowerCase() || DEFAULT_BROWSER;
const selectedProject = allBrowserProjects.find((project) => project.name === selectedBrowser);
if (!selectedProject) {
  throw new Error(
    `BROWSER must be one of: ${allBrowserProjects.map((p) => p.name).join(', ')}. Received "${selectedBrowser}".`,
  );
}

export const browserProjects: Project[] = [selectedProject];
