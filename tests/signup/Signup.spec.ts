import signupTestData from '../../test-data/signup/signup-test-data.json';
import { expect, test } from '../../fixtures/signup.fixture';
import { autoEmail, getUniqueSuffix } from '../../utils/auto-data';
import type { SignupPage } from '../../pages/signup/SignupPage';

const { routes, companyDetails, invalidData, fieldLimits, specialCharacters, validationMessages } = signupTestData;

// The app rejects an email that already signed up, so every test needs its own address.
let uniqueEmail = '';
const personalDetails = {
  ...signupTestData.personalDetails,
  get email(): string {
    return uniqueEmail;
  },
};

// The app validates max lengths only on Submit (verified: typing, fill, Tab and blur show nothing).
async function fillValidForm(
  signupPage: SignupPage,
  overrides: { companyName?: string; address?: string; name?: string; email?: string } = {},
): Promise<void> {
  await signupPage.fillSignupForm(
    overrides.companyName ?? companyDetails.companyName,
    companyDetails.industry,
    overrides.address ?? companyDetails.address,
    overrides.name ?? personalDetails.name,
    overrides.email ?? personalDetails.email,
    personalDetails.phone,
    personalDetails.message,
  );
}

test.describe('Signup', () => {
  test.beforeEach(async ({ page, signupPage }) => {
    uniqueEmail = autoEmail('signup', 'example.com');
    await signupPage.goto();
    await page.waitForURL(routes.signup);
  });

  test(
    'TC-SIGNUP-001: To verify Sign Up page loads with all required sections visible',
    { tag: ['@High', '@Positive', '@Functional', '@UI', '@Regression'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await expect(signupPage.companyDetailsHeading).toBeVisible();
      await expect(signupPage.personalDetailsHeading).toBeVisible();
      await expect(signupPage.submitButton).toBeVisible();
    },
  );

  test(
    'TC-SIGNUP-002: To verify all Company Details form fields are visible',
    { tag: ['@High', '@Positive', '@Functional', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await expect(signupPage.companyNameField).toBeVisible();
      await expect(signupPage.industryDropdown).toBeVisible();
      await expect(signupPage.addressField).toBeVisible();
    },
  );

  test(
    'TC-SIGNUP-003: To verify all Personal Details form fields are visible',
    { tag: ['@High', '@Positive', '@Functional', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await expect(signupPage.nameField).toBeVisible();
      await expect(signupPage.emailField).toBeVisible();
      await expect(signupPage.phoneNumberField).toBeVisible();
      await expect(signupPage.messageField).toBeVisible();
    },
  );

  test(
    'TC-SIGNUP-004: To verify Company Name field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectCompanyNameError();
    },
  );

  test(
    'TC-SIGNUP-005: To verify Industry field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectIndustryError();
    },
  );

  test(
    'TC-SIGNUP-006: To verify Address field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectAddressError();
    },
  );

  test(
    'TC-SIGNUP-007: To verify Name field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectNameError();
    },
  );

  test(
    'TC-SIGNUP-008: To verify Email field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectEmailError();
    },
  );

  test(
    'TC-SIGNUP-009: To verify Phone Number field is required (validation)',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.checkAgreeToContact();
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectPhoneError();
    },
  );

  test(
    'TC-SIGNUP-010: To verify phone number format validation (555) 555-5555',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillPhoneNumber(invalidData.invalidPhone);
      await signupPage.clickSubmit();
      await signupPage.expectPhoneFormatError();
    },
  );

  test(
    'TC-SIGNUP-011: To verify "I agree to be contacted" checkbox is required',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToTerms();
      await signupPage.clickSubmit();
      await signupPage.expectAgreeToContactError();
    },
  );

  test(
    'TC-SIGNUP-012: To verify "I agree to Terms & Conditions" checkbox is required',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillCompanyName(companyDetails.companyName);
      await signupPage.selectIndustry(companyDetails.industry);
      await signupPage.fillAddress(companyDetails.address);
      await signupPage.fillName(personalDetails.name);
      await signupPage.fillEmail(personalDetails.email);
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await signupPage.checkAgreeToContact();
      await signupPage.clickSubmit();
      await signupPage.expectAgreeToTermsError();
    },
  );

  test(
    'TC-SIGNUP-013: To verify user can toggle "I agree to be contacted" checkbox',
    { tag: ['@Low', '@Positive', '@Functional', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.checkAgreeToContact();
      await expect(signupPage.agreeToContactCheckbox).toBeChecked();
      await signupPage.uncheckAgreeToContact();
      await expect(signupPage.agreeToContactCheckbox).not.toBeChecked();
    },
  );

  test(
    'TC-SIGNUP-014: To verify user can toggle "I agree to Terms & Conditions" checkbox',
    { tag: ['@Low', '@Positive', '@Functional', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.checkAgreeToTerms();
      await expect(signupPage.agreeToTermsCheckbox).toBeChecked();
      await signupPage.uncheckAgreeToTerms();
      await expect(signupPage.agreeToTermsCheckbox).not.toBeChecked();
    },
  );

  test(
    'TC-SIGNUP-015: To verify Terms link is clickable and opens Terms page',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ page, signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.clickTerms();
      await expect(page).toHaveURL(/terms/i);
    },
  );

  test(
    'TC-SIGNUP-016: To verify Privacy Policy link is clickable',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ page, signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.clickPrivacyPolicy();
      await expect(page).toHaveURL(/privacy|policy/i);
    },
  );

  test(
    'TC-SIGNUP-017: To verify Login link navigates to login page',
    { tag: ['@Low', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ page, signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.clickLogin();
      await page.waitForURL(/login|auth/);
    },
  );

  test(
    'TC-SIGNUP-018: To verify successful signup form submission with valid data',
    { tag: ['@High', '@Positive', '@Functional', '@UI', '@Integration'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-019: To verify email field accepts valid email format',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillEmail(personalDetails.email);
      await expect(signupPage.emailField).toHaveValue(personalDetails.email);
    },
  );

  test(
    'TC-SIGNUP-020: To verify phone field accepts valid phone format (555) 555-5555',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillPhoneNumber(personalDetails.phone);
      await expect(signupPage.phoneNumberField).toHaveValue(personalDetails.phone);
    },
  );

  test(
    'TC-SIGNUP-021: To verify email duplicate detection (same email cannot be used twice)',
    { tag: ['@High', '@Negative', '@Functional', '@Validation', '@UI', '@Integration'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        invalidData.duplicateEmail,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.clickSubmit();
      await signupPage.expectEmailExistsError();
    },
  );

  test(
    'TC-SIGNUP-022: To verify leading and trailing spaces in the company name are trimmed or validated',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        `  ${companyDetails.companyName}  `,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await expect(signupPage.successMessage.or(signupPage.companyNameErrorMsg)).toBeVisible();
    },
  );

  test(
    'TC-SIGNUP-025: To verify supported email formats are accepted and invalid email formats are rejected',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      for (const email of invalidData.invalidEmailFormats) {
        await signupPage.goto();
        await signupPage.fillSignupForm(
          companyDetails.companyName,
          companyDetails.industry,
          companyDetails.address,
          personalDetails.name,
          email,
          personalDetails.phone,
          personalDetails.message,
        );
        await signupPage.submitSignupForm();
        await signupPage.expectEmailError();
        await expect(signupPage.successMessage).toBeHidden();
      }

      await signupPage.goto();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.emailWithTag.replace('+tag', `+${getUniqueSuffix()}`),
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-028: To verify that double-clicking the signup button does not create duplicate submissions',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Integration'] },
    async ({ page, signupPage }) => {
      const signupRequests: string[] = [];
      page.on('request', (request) => {
        if (request.method() === 'POST' && request.postData()?.includes(personalDetails.email)) {
          signupRequests.push(request.url());
        }
      });

      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitButton.dblclick();
      await signupPage.expectSuccessMessage();
      expect(signupRequests).toHaveLength(1);
    },
  );

  test(
    'TC-SIGNUP-029: To verify a clear success message is displayed after a successful signup',
    { tag: ['@Medium', '@Positive', '@Functional', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
      await expect(signupPage.successMessage).toContainText('Thank you');
    },
  );

  test(
    'TC-SIGNUP-030: To verify a SQL injection payload entered in the signup form is safely rejected',
    { tag: ['@High', '@Negative', '@Security', '@Validation'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        invalidData.sqlInjectionMessage,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-031: To verify a script injection payload entered in the signup form is not executed (XSS)',
    { tag: ['@High', '@Negative', '@Security', '@Validation'] },
    async ({ page, signupPage }) => {
      let dialogDisplayed = false;
      page.on('dialog', async (dialog) => {
        dialogDisplayed = true;
        await dialog.dismiss();
      });

      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        invalidData.scriptInjectionMessage,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
      expect(dialogDisplayed).toBe(false);
    },
  );

  test(
    'TC-SIGNUP-023: To verify that special characters in the company name are accepted',
    { tag: ['@Low', '@Positive', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        specialCharacters.companyName,
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-024: To verify that special characters in the name field are accepted',
    { tag: ['@Low', '@Positive', '@Functional', '@Validation', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        specialCharacters.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-032: To verify that a company name of exactly 250 characters is accepted',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        'A'.repeat(fieldLimits.companyNameMax),
        companyDetails.industry,
        companyDetails.address,
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-033: To verify that an address of exactly 500 characters is accepted',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        'A'.repeat(fieldLimits.addressMax),
        personalDetails.name,
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-034: To verify that a name of exactly 150 characters is accepted',
    { tag: ['@Medium', '@Positive', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillSignupForm(
        companyDetails.companyName,
        companyDetails.industry,
        companyDetails.address,
        'A'.repeat(fieldLimits.nameMax),
        personalDetails.email,
        personalDetails.phone,
        personalDetails.message,
      );
      await signupPage.submitSignupForm();
      await signupPage.expectSuccessMessage();
    },
  );

  test(
    'TC-SIGNUP-027: To verify that the signup message field enforces its 2000 character limit',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await signupPage.fillMessage('A'.repeat(fieldLimits.messageMax + 1));
      await signupPage.messageField.blur();
      await signupPage.expectValidationError(validationMessages.messageTooLong);
    },
  );

  test(
    'TC-SIGNUP-035: To verify that a company name longer than 250 characters is limited or rejected',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await fillValidForm(signupPage, { companyName: 'A'.repeat(fieldLimits.companyNameMax + 1) });
      await signupPage.clickSubmit();
      await signupPage.expectValidationError(validationMessages.companyNameTooLong, 50_000);
    },
  );

  test(
    'TC-SIGNUP-036: To verify that an address longer than 500 characters is limited or rejected',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await fillValidForm(signupPage, { address: 'A'.repeat(fieldLimits.addressMax + 1) });
      await signupPage.clickSubmit();
      await signupPage.expectValidationError(validationMessages.addressTooLong, 50_000);
    },
  );

  test(
    'TC-SIGNUP-037: To verify that a name longer than 150 characters is limited or rejected',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      await fillValidForm(signupPage, { name: 'A'.repeat(fieldLimits.nameMax + 1) });
      await signupPage.clickSubmit();
      await signupPage.expectValidationError(validationMessages.nameTooLong, 50_000);
    },
  );

  test(
    'TC-SIGNUP-038: To verify that an email longer than 50 characters is limited or rejected',
    { tag: ['@Medium', '@Negative', '@Functional', '@Validation', '@Boundary', '@UI'] },
    async ({ signupPage }) => {
      await signupPage.expectLoaded();
      const { emailMax, emailDomain } = fieldLimits;
      await fillValidForm(signupPage, { email: 'a'.repeat(emailMax + 1 - emailDomain.length) + emailDomain });
      await signupPage.clickSubmit();
      // Shown as a toast, not the inline #err-email element used for other email errors.
      await signupPage.expectValidationError(validationMessages.emailTooLong, 50_000);
    },
  );
});
