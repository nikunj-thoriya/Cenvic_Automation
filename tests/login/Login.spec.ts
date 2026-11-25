import { autoEmail } from '../../utils/auto-data';
import { expectNoHorizontalOverflow, MOBILE_VIEWPORT } from '../../utils/layout';
import loginTestData from '../../test-data/login/login-test-data.json';
import { expect, test } from '../../fixtures/login.fixture';

const { routes, messages, inputs, emailInput, lockout } = loginTestData;

test.describe('Login', () => {
  test(
    'TC-LOGIN-001: To verify the Login page opens from the home page Get Started link',
    { tag: ['@High', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ homePage, loginPage }) => {
      await homePage.goto(routes.home);
      await homePage.openLogin();
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-002: To verify the Login page displays the logo, heading, fields, Remember Me, Forgot Password link, Login button and Request Access link',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI', '@Regression'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.logo).toBeVisible();
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.emailField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.requestAccessLink).toBeVisible();
    },
  );

  test(
    'TC-LOGIN-003: To verify login with a valid registered email and valid password',
    { tag: ['@High', '@Positive', '@Functional', '@UI', '@E2E', '@Regression'] },
    async ({ page, loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-004: To verify the user is redirected to the dashboard after successful login',
    { tag: ['@High', '@Positive', '@Functional', '@Integration', '@E2E'] },
    async ({ page, loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-005: To verify the Login successfully toast is displayed after successful login',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI'] },
    async ({ loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username, userCredentials.password);
      await loginPage.expectToast(messages.toastTitle, messages.loginSuccessful);
    },
  );

  test(
    'TC-LOGIN-006: To verify login with a valid registered email and an incorrect password',
    { tag: ['@High', '@Negative', '@Functional', '@UI', '@Security'] },
    async ({ loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username, inputs.incorrectPassword);
      await loginPage.expectLoginRejected();
    },
  );

  test(
    'TC-LOGIN-007: To verify the Incorrect password toast is displayed for an incorrect password',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username, inputs.incorrectPassword);
      await loginPage.expectToast(messages.toastTitle, messages.incorrectPassword);
    },
  );

  test(
    'TC-LOGIN-008: To verify login with an unregistered email',
    { tag: ['@High', '@Negative', '@Functional', '@UI', '@Security'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(
        autoEmail(inputs.unregisteredEmailLocalPart, inputs.unregisteredEmailDomain),
        inputs.unregisteredPassword,
      );
      await loginPage.expectLoginRejected();
    },
  );

  test(
    'TC-LOGIN-009: To verify the Email ID not registered toast is displayed for an unregistered email',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(
        autoEmail(inputs.unregisteredEmailLocalPart, inputs.unregisteredEmailDomain),
        inputs.unregisteredPassword,
      );
      await loginPage.expectToast(messages.toastTitle, messages.emailNotRegistered);
    },
  );

  test(
    'TC-LOGIN-010: To verify login with both fields empty shows the required field messages',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.submit();
      await loginPage.expectValidationMessage(messages.emailRequired);
      await loginPage.expectValidationMessage(messages.passwordRequired);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-011: To verify login with an empty email field shows the email required message',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.enterPassword(inputs.unregisteredPassword);
      await loginPage.submit();
      await loginPage.expectValidationMessage(messages.emailRequired);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-012: To verify login with an empty password field shows the password required message',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.enterEmail(userCredentials.username);
      await loginPage.submit();
      await loginPage.expectValidationMessage(messages.passwordRequired);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-013: To verify login with an invalid email format shows the valid email message',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(inputs.invalidEmail, inputs.unregisteredPassword);
      await loginPage.expectValidationMessage(messages.invalidEmail);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-014: To verify the password is masked by default',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI', '@Security'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.enterPassword(inputs.maskedPasswordSample);
      await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
    },
  );

  test(
    'TC-LOGIN-015: To verify Show password reveals the password and Hide password masks it again',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.enterPassword(inputs.maskedPasswordSample);
      await loginPage.showPasswordButton.click();
      await expect(loginPage.passwordField).toHaveAttribute('type', 'text');
      await loginPage.hidePasswordButton.click();
      await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
    },
  );

  test(
    'TC-LOGIN-016: To verify the Remember Me checkbox can be checked and unchecked',
    { tag: ['@Low', '@Positive', '@Functional', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.rememberMeCheckbox.check();
      await expect(loginPage.rememberMeCheckbox).toBeChecked();
      await loginPage.rememberMeCheckbox.uncheck();
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    },
  );

  test(
    'TC-LOGIN-017: To verify clicking the Remember Me label toggles the checkbox',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Regression'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.rememberMeLabel.click();
      await expect(loginPage.rememberMeCheckbox).toBeChecked();
      await loginPage.rememberMeLabel.click();
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    },
  );

  test(
    'TC-LOGIN-018: To verify the Forgot Password link opens its page and Back to Login returns to the Login page',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(routes.forgotPassword);
      await loginPage.backToLoginButton.click();
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-019: To verify the Request Access link opens its page and the Login link returns to the Login page',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.requestAccessLink.click();
      await expect(page).toHaveURL(routes.requestAccess);
      await loginPage.loginLink.click();
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-020: To verify the Back to Home link returns to the home page',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ homePage, loginPage }) => {
      await loginPage.goto();
      await loginPage.backToHomeLink.click();
      await homePage.expectLoaded(routes.home);
    },
  );

  test(
    'TC-LOGIN-021: To verify login with an email missing the domain extension shows the valid email message',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(inputs.emailWithoutDomainExtension, inputs.unregisteredPassword);
      await loginPage.expectValidationMessage(messages.invalidEmail);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-022: To verify login trims leading spaces in the email field and proceeds',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation'] },
    async ({ page, loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(`  ${userCredentials.username}`, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-024: To verify email case sensitivity during login',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation'] },
    async ({ page, loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.login(userCredentials.username.toUpperCase(), userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-025: To verify email addresses containing valid special characters',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation'] },
    async ({ page, loginPage }) => {
      for (const email of inputs.standardSpecialCharacterEmails) {
        await loginPage.goto();
        await loginPage.login(email, inputs.unregisteredPassword);
        // A well-formed email passes the format check and reaches the server, which does not know it.
        await loginPage.expectToast(messages.toastTitle, messages.emailNotRegistered);
        await expect(page.getByText(messages.invalidEmail, { exact: true })).toBeHidden();
      }
    },
  );

  test(
    'TC-LOGIN-027: To verify login prevents SQL injection attempts',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@Security'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginByTyping(inputs.sqlInjectionEmail, inputs.sqlInjectionPassword);
      await loginPage.expectValidationMessage(messages.invalidEmail);
      await loginPage.expectLoaded();
    },
  );

  test(
    'TC-LOGIN-028: To verify the account is not locked after repeated failed login attempts',
    { tag: ['@High', '@Negative', '@Functional', '@Security'] },
    async ({ page, loginPage, userCredentials }) => {
      for (let attempt = 0; attempt < lockout.failedAttempts; attempt++) {
        await loginPage.goto();
        await loginPage.login(userCredentials.username, inputs.incorrectPassword);
        await loginPage.expectLoginRejected();
      }

      // Account lockout is not implemented, so the valid credentials must still work.
      await loginPage.goto();
      await loginPage.login(userCredentials.username, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-029: To verify login keyboard navigation using Tab and Enter',
    { tag: ['@Medium', '@Positive', '@Functional', '@Accessibility'] },
    async ({ page, loginPage, userCredentials }) => {
      await loginPage.goto();
      await loginPage.emailField.focus();
      await page.keyboard.type(userCredentials.username);
      await page.keyboard.press('Tab');
      await expect(loginPage.passwordField).toBeFocused();
      await page.keyboard.type(userCredentials.password);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-030: To verify Remember Me persistence after closing and reopening the browser',
    { tag: ['@Medium', '@Positive', '@Functional', '@Integration', '@Security'] },
    async ({ page, loginPage, userCredentials, browser }) => {
      await loginPage.goto();
      await loginPage.rememberMeCheckbox.check();
      await loginPage.login(userCredentials.username, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);

      // Simulate closing and reopening the browser: carry the saved storage state into a brand-new context.
      const storageState = await page.context().storageState();
      const reopenedContext = await browser.newContext({ storageState });
      const reopenedPage = await reopenedContext.newPage();
      await reopenedPage.goto(routes.dashboard);
      await expect(reopenedPage).toHaveURL(routes.dashboard);
      await reopenedContext.close();
    },
  );

  test(
    'TC-LOGIN-032: To verify the login page is usable on a mobile viewport',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Regression'] },
    async ({ page, loginPage, userCredentials }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await loginPage.goto();
      await expect(loginPage.emailField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await loginPage.login(userCredentials.username, userCredentials.password);
      await expect(page).toHaveURL(routes.dashboard);
    },
  );

  test(
    'TC-LOGIN-033: To verify script input in the login fields is not executed (XSS)',
    { tag: ['@Medium', '@Negative', '@Security', '@Validation'] },
    async ({ page, loginPage }) => {
      let dialogDisplayed = false;
      page.on('dialog', async (dialog) => {
        dialogDisplayed = true;
        await dialog.dismiss();
      });

      await loginPage.goto();
      await loginPage.login(inputs.scriptInjectionEmail, inputs.scriptInjectionPassword);
      await loginPage.expectValidationMessage('Please enter a valid email address');
      await loginPage.expectLoaded();
      expect(dialogDisplayed).toBe(false);
    },
  );

  test(
    'TC-LOGIN-034: To verify double-clicking the Login button does not send duplicate login requests',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation'] },
    async ({ page, loginPage, userCredentials }) => {
      const loginRequests: string[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.postData()?.includes(userCredentials.username)) {
          loginRequests.push(request.url());
        }
      });

      await loginPage.goto();
      await loginPage.enterEmail(userCredentials.username);
      await loginPage.enterPassword(userCredentials.password);
      await loginPage.loginButton.dblclick();
      await expect(page).toHaveURL(routes.dashboard);
      expect(loginRequests).toHaveLength(1);
    },
  );

  test(
    'TC-LOGIN-035: To verify the email field is an email input with its placeholder and autocomplete hint',
    { tag: ['@Low', '@Positive', '@Functional', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.emailField).toHaveAttribute('type', emailInput.type);
      await expect(loginPage.emailField).toHaveAttribute('placeholder', emailInput.placeholder);
      await expect(loginPage.emailField).toHaveAttribute('autocomplete', emailInput.autocomplete);
    },
  );

  test(
    'TC-LOGIN-036: To verify the Login page branding panel displays its heading, logo icon and feature highlights',
    { tag: ['@Low', '@Positive', '@Functional', '@UI'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.brandingHeading).toBeVisible();
      await expect(loginPage.brandingLogoIcon).toBeVisible();
      for (const item of loginPage.brandingFeatureItems) {
        await expect(item).toBeVisible();
      }
    },
  );
});
