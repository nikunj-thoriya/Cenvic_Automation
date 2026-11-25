import { getRoleCredentials, type RoleCredentials } from '../config/roles/roles';
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/login/LoginPage';
import { test as base, expect } from './base.fixture';

interface LoginFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  userCredentials: RoleCredentials;
}

export const test = base.extend<LoginFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page, environment }, use) => {
    await use(new LoginPage(page, environment.loginPath));
  },
  // The account role is not confirmed yet (PT-002), so the USER_ prefix is used.
  userCredentials: async ({}, use) => {
    await use(getRoleCredentials('user'));
  },
});

export { expect };
