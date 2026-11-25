import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly logo: Locator;
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly showPasswordButton: Locator;
  readonly hidePasswordButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly rememberMeLabel: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;
  readonly requestAccessLink: Locator;
  readonly backToHomeLink: Locator;
  readonly backToLoginButton: Locator;
  readonly loginLink: Locator;
  readonly alerts: Locator;
  readonly brandingHeading: Locator;
  readonly brandingLogoIcon: Locator;
  readonly brandingFeatureItems: Locator[];

  constructor(
    private readonly page: Page,
    private readonly loginPath: string,
  ) {
    this.logo = page.getByRole('img', { name: 'Cenvic Logo' });
    this.heading = page.getByRole('heading', { name: 'Welcome Back.' });
    this.emailField = page.getByRole('textbox', { name: 'Email Address *' });
    // A password input has no textbox role; the exact label avoids matching the "Show password" button.
    this.passwordField = page.getByLabel('Password *', { exact: true });
    this.showPasswordButton = page.getByRole('button', { name: 'Show password' });
    this.hidePasswordButton = page.getByRole('button', { name: 'Hide password' });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember Me' });
    this.rememberMeLabel = page.getByText('Remember Me', { exact: true });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.requestAccessLink = page.getByRole('link', { name: 'Request Access.' });
    this.backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
    // "Back to Login" sits on the Forgot Password page; the "Login" link sits on the Request Access page (not recorded, PT-010).
    this.backToLoginButton = page.getByRole('button', { name: 'Back to Login' });
    this.loginLink = page.getByRole('link', { name: 'Login', exact: true });
    this.alerts = page.getByRole('alert');
    this.brandingHeading = page.getByRole('heading', { name: 'Voices That Convert.' });
    this.brandingLogoIcon = page.getByRole('img', { name: 'Logo Icon' });
    this.brandingFeatureItems = [
      page.getByText('QR-based video collection'),
      page.getByText('Powerful analytics dashboard'),
      page.getByText('Secure & compliant platform'),
    ];
  }

  async goto(): Promise<void> {
    await this.page.goto(this.loginPath);
    await expect(this.heading).toBeVisible();
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
  }

  /** Types each character like a user, for cases where fill() gives a different result than manual entry. */
  async loginByTyping(email: string, password: string): Promise<void> {
    await this.emailField.click();
    await this.emailField.pressSequentially(email);
    await this.passwordField.click();
    await this.passwordField.pressSequentially(password);
    await this.submit();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.loginPath);
    await expect(this.heading).toBeVisible();
  }

  async expectToast(title: string, message: string): Promise<void> {
    const toast = this.alerts.filter({ hasText: message });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(title);
  }

  async expectValidationMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  /** Waits for the server response (shown as a toast) before confirming the user stayed on the Login page. */
  async expectLoginRejected(): Promise<void> {
    await expect(this.alerts.first()).toBeVisible();
    await this.expectLoaded();
  }
}
