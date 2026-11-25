import { SignupPage } from '../pages/signup/SignupPage';
import { test as base, expect } from './base.fixture';

interface SignupFixtures {
  signupPage: SignupPage;
}

export const test = base.extend<SignupFixtures>({
  signupPage: async ({ page, environment }, use) => {
    await use(new SignupPage(page, environment.baseUrl + '/get-started'));
  },
});

export { expect };
