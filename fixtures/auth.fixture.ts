import fs from 'node:fs';
import path from 'node:path';
import { loadEnvironment } from '../config/environments/environment';
import { getRoleCredentials, type RoleCredentials } from '../config/roles/roles';
import { LoginPage } from '../pages/login/LoginPage';
import { test as base, expect } from './base.fixture';

// Only one role exists today; rename once real roles are confirmed (PT-002, deferred).
const AUTH_ROLE = 'user';

interface AuthFixtures {
  userCredentials: RoleCredentials;
}

interface AuthWorkerFixtures {
  workerStorageState: string;
}

/**
 * Authenticated fixture: logs in via the UI once per worker and reuses the resulting
 * storage state for every test's page, instead of repeating the UI login per test.
 * Modules that need to exercise the login screen itself (Login, Forgot/Reset Password)
 * must keep extending `base.fixture` directly, not this fixture.
 */
export const test = base.extend<AuthFixtures, AuthWorkerFixtures>({
  userCredentials: async ({}, use) => {
    await use(getRoleCredentials(AUTH_ROLE));
  },

  storageState: async ({ workerStorageState }, use) => {
    await use(workerStorageState);
  },

  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const fileName = path.resolve(
        workerInfo.project.outputDir,
        `.auth/${AUTH_ROLE}-${workerInfo.parallelIndex}.json`,
      );

      if (fs.existsSync(fileName)) {
        await use(fileName);
        return;
      }

      const environment = loadEnvironment();
      const credentials = getRoleCredentials(AUTH_ROLE);

      // storageState: undefined guarantees a clean, logged-out context for the login steps.
      const page = await browser.newPage({ storageState: undefined, baseURL: environment.baseUrl });
      const loginPage = new LoginPage(page, environment.loginPath);
      await loginPage.goto();
      await loginPage.login(credentials.username, credentials.password);
      await page.waitForURL('**/app/dashboard');

      fs.mkdirSync(path.dirname(fileName), { recursive: true });
      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: 'worker' },
  ],
});

export { expect };
