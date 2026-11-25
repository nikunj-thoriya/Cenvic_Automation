import { test as base, expect } from '@playwright/test';
import { loadEnvironment, type EnvironmentConfig } from '../config/environments/environment';

interface BaseFixtures {
  environment: EnvironmentConfig;
  cleanBrowserState: void;
}

export const test = base.extend<BaseFixtures>({
  environment: async ({}, use) => {
    await use(loadEnvironment());
  },
  cleanBrowserState: [
    async ({ context, browserName, storageState }, use) => {
      // Tests that load a saved login keep their cookies; all others start with none.
      if (!storageState) {
        await context.clearCookies();
      }
      if (browserName === 'chromium') {
        const tempPage = await context.newPage();
        const cdp = await context.newCDPSession(tempPage);
        await cdp.send('Network.clearBrowserCache');
        await cdp.detach();
        await tempPage.close();
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
