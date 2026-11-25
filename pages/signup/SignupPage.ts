import { Page, Locator, expect } from '@playwright/test';

/**
 * SignupPage - Page Object for /get-started (Sign Up)
 * Handles both Company Details and Personal Details sections
 */
export class SignupPage {
  readonly page: Page;
  readonly baseUrl: string;

  // Company Details Section Locators
  readonly companyNameField: Locator;
  readonly industryDropdown: Locator;
  readonly addressField: Locator;

  // Personal Details Section Locators
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly phoneNumberField: Locator;
  readonly messageField: Locator;

  // Checkbox Locators
  readonly agreeToContactCheckbox: Locator;
  readonly agreeToTermsCheckbox: Locator;

  // Button Locators
  readonly submitButton: Locator;

  // Link Locators
  readonly loginLink: Locator;
  readonly termsLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly backToLoginLink: Locator;

  // Alert/Message Locators
  readonly successMessage: Locator;
  readonly companyNameErrorMsg: Locator;
  readonly industryErrorMsg: Locator;
  readonly addressErrorMsg: Locator;
  readonly nameErrorMsg: Locator;
  readonly emailErrorMsg: Locator;
  readonly phoneErrorMsg: Locator;
  readonly agreeToContactErrorMsg: Locator;
  readonly agreeToTermsErrorMsg: Locator;
  readonly phoneFormatErrorMsg: Locator;
  readonly emailExistsErrorMsg: Locator;

  // Section Headings
  readonly companyDetailsHeading: Locator;
  readonly personalDetailsHeading: Locator;
  readonly mainHeading: Locator;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;

    // Company Details Section
    this.companyNameField = page.getByRole('textbox', { name: 'Company Name *' });
    this.industryDropdown = page.getByLabel('Industry *');
    this.addressField = page.getByRole('textbox', { name: 'Address *' });

    // Personal Details Section
    this.nameField = page.getByRole('textbox', { name: 'Name *', exact: true });
    this.emailField = page.getByRole('textbox', { name: 'Email *' });
    this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number *' });
    this.messageField = page.getByRole('textbox', { name: 'Message / Reason for Joining' });

    // Checkboxes
    this.agreeToContactCheckbox = page.getByRole('checkbox', { name: 'I agree to be contacted' });
    this.agreeToTermsCheckbox = page.getByRole('checkbox', { name: 'I agree to the Terms &' });

    // Buttons
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // Links
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.termsLink = page.getByRole('link', { name: 'Terms' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.backToLoginLink = page.getByRole('link', { name: 'Back to Login' });

    // Success/Error Messages
    // A success toast with different wording also appears; matching only the inline alert avoids a strict-mode clash.
    this.successMessage = page.getByText('Thank you! Your request has');
    this.companyNameErrorMsg = page.getByText('Company name is required');
    this.industryErrorMsg = page.getByText('Please select an industry');
    this.addressErrorMsg = page.getByText('Company address is required');
    this.nameErrorMsg = page.getByText('Name is required', { exact: true });
    this.emailErrorMsg = page.locator('#err-email');
    this.phoneErrorMsg = page.getByText('Phone number is required');
    this.agreeToContactErrorMsg = page.getByText('You must agree to be contacted');
    this.agreeToTermsErrorMsg = page.getByText('You must accept the Terms &');
    this.phoneFormatErrorMsg = page.getByText('Enter phone in (555) 555-5555');
    this.emailExistsErrorMsg = page.getByText('Email already exists');

    // Section Headings
    this.companyDetailsHeading = page.getByText('Company Details');
    this.personalDetailsHeading = page.getByText('Personal Details');
    this.mainHeading = page.getByRole('heading', { name: 'Voices That Convert.' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.mainHeading).toBeVisible();
    await expect(this.companyDetailsHeading).toBeVisible();
  }

  async fillCompanyName(name: string): Promise<void> {
    await this.companyNameField.click();
    await this.companyNameField.fill(name);
  }

  async selectIndustry(industry: string): Promise<void> {
    await this.industryDropdown.selectOption(industry);
  }

  async fillAddress(address: string): Promise<void> {
    await this.addressField.click();
    await this.addressField.fill(address);
  }

  async fillName(name: string): Promise<void> {
    await this.nameField.click();
    await this.nameField.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailField.click();
    await this.emailField.fill(email);
  }

  async fillPhoneNumber(phone: string): Promise<void> {
    await this.phoneNumberField.click();
    await this.phoneNumberField.fill(phone);
  }

  async fillMessage(message: string): Promise<void> {
    await this.messageField.click();
    await this.messageField.fill(message);
  }

  async checkAgreeToContact(): Promise<void> {
    await this.agreeToContactCheckbox.check();
  }

  async uncheckAgreeToContact(): Promise<void> {
    await this.agreeToContactCheckbox.uncheck();
  }

  async checkAgreeToTerms(): Promise<void> {
    await this.agreeToTermsCheckbox.check();
  }

  async uncheckAgreeToTerms(): Promise<void> {
    await this.agreeToTermsCheckbox.uncheck();
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async clickTerms(): Promise<void> {
    await this.termsLink.click();
  }

  async clickPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginLink.click();
  }

  async expectValidationError(errorMessage: string, timeout?: number): Promise<void> {
    await expect(this.page.getByText(errorMessage)).toBeVisible({ timeout });
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }

  async expectCompanyNameError(): Promise<void> {
    await expect(this.companyNameErrorMsg).toBeVisible();
  }

  async expectIndustryError(): Promise<void> {
    await expect(this.industryErrorMsg).toBeVisible();
  }

  async expectAddressError(): Promise<void> {
    await expect(this.addressErrorMsg).toBeVisible();
  }

  async expectNameError(): Promise<void> {
    await expect(this.nameErrorMsg).toBeVisible();
  }

  async expectEmailError(errorText?: string, timeout?: number): Promise<void> {
    if (errorText) {
      await expect(this.page.getByText(errorText)).toBeVisible({ timeout });
    } else {
      await expect(this.emailErrorMsg).toBeVisible({ timeout });
    }
  }

  async expectPhoneError(): Promise<void> {
    await expect(this.phoneErrorMsg).toBeVisible();
  }

  async expectAgreeToContactError(): Promise<void> {
    await expect(this.agreeToContactErrorMsg).toBeVisible();
  }

  async expectAgreeToTermsError(): Promise<void> {
    await expect(this.agreeToTermsErrorMsg).toBeVisible();
  }

  async expectPhoneFormatError(): Promise<void> {
    await expect(this.phoneFormatErrorMsg).toBeVisible();
  }

  async expectEmailExistsError(): Promise<void> {
    await expect(this.emailExistsErrorMsg).toBeVisible();
  }

  async fillSignupForm(
    companyName: string,
    industry: string,
    address: string,
    name: string,
    email: string,
    phone: string,
    message?: string
  ): Promise<void> {
    await this.fillCompanyName(companyName);
    await this.selectIndustry(industry);
    await this.fillAddress(address);
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPhoneNumber(phone);
    if (message) {
      await this.fillMessage(message);
    }
    await this.checkAgreeToContact();
    await this.checkAgreeToTerms();
  }

  async submitSignupForm(): Promise<void> {
    await this.clickSubmit();
  }

  async isCompanyNameFieldVisible(): Promise<boolean> {
    return await this.companyNameField.isVisible();
  }

  async isPersonalDetailsHeadingVisible(): Promise<boolean> {
    return await this.personalDetailsHeading.isVisible();
  }
}
