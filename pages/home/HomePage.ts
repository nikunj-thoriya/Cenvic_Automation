import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly getStartedLink: Locator;
  readonly navLogoLink: Locator;
  readonly featuresNavLink: Locator;
  readonly howItWorksNavLink: Locator;
  readonly heroHeading: Locator;
  readonly startNowLink: Locator;
  readonly statVideoReviews: Locator;
  readonly statTrustedCustomers: Locator;
  readonly statAverageRating: Locator;
  readonly statActiveCampaigns: Locator;
  readonly whyChooseHeading: Locator;
  readonly whyChooseSubheading: Locator;
  readonly contactUsButton: Locator;
  readonly contactDialogCloseButton: Locator;
  readonly featuresSectionHeading: Locator;
  readonly qrCodeGenerationHeading: Locator;
  readonly customerManagementHeading: Locator;
  readonly secureAndCompliantHeading: Locator;
  readonly videoTestimonialsHeading: Locator;
  readonly advancedAnalyticsHeading: Locator;
  readonly howItWorksSectionHeading: Locator;
  readonly createCampaignHeading: Locator;
  readonly shareQrCodeHeading: Locator;
  readonly collectReviewsHeading: Locator;
  readonly teamsSectionHeading: Locator;
  readonly ctaHeading: Locator;
  readonly ctaGetStartedLink: Locator;
  readonly footerLogo: Locator;
  readonly footerText: Locator;
  readonly footerProductsHeading: Locator;
  readonly footerFeaturesButton: Locator;
  readonly footerHowItWorksButton: Locator;
  readonly footerCompanyHeading: Locator;
  readonly footerAboutUsLink: Locator;
  readonly footerContactButton: Locator;
  readonly footerPrivacyLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly instagramLink: Locator;
  readonly skipToContentLink: Locator;
  readonly navbarToggler: Locator;

  constructor(private readonly page: Page) {
    const navigation = page.getByRole('navigation');
    this.getStartedLink = navigation.getByRole('link', { name: 'Get Started' });
    this.navLogoLink = navigation.getByRole('link', { name: 'Logo' });
    this.featuresNavLink = navigation.getByRole('link', { name: 'Features' });
    this.howItWorksNavLink = navigation.getByRole('link', { name: 'How It Works' });
    this.heroHeading = page.getByRole('heading', { name: 'The Future of Customer' });
    this.startNowLink = page.getByRole('link', { name: 'Start Now' });
    this.statVideoReviews = page.getByRole('heading', { name: '500k+' });
    this.statTrustedCustomers = page.getByRole('heading', { name: '50k+' });
    this.statAverageRating = page.getByRole('heading', { name: '4.9k' });
    this.statActiveCampaigns = page.getByRole('heading', { name: '10k+' });
    this.whyChooseHeading = page.getByRole('heading', { name: 'The Smart Choice' });
    this.whyChooseSubheading = page.getByRole('heading', { name: 'Why Choose Us?' });
    this.contactUsButton = page.getByRole('button', { name: 'Contact Us' });
    this.contactDialogCloseButton = page.getByRole('button', { name: 'Close' });
    this.featuresSectionHeading = page.getByRole('heading', { name: 'All in One Place' });
    this.qrCodeGenerationHeading = page.getByRole('heading', { name: 'QR Code Generation' });
    this.customerManagementHeading = page.getByRole('heading', { name: 'Customer Management' });
    this.secureAndCompliantHeading = page.getByRole('heading', { name: 'Secure & Compliant' });
    this.videoTestimonialsHeading = page.getByRole('heading', { name: 'Video Testimonials', exact: true });
    this.advancedAnalyticsHeading = page.getByRole('heading', { name: 'Advanced Analytics' });
    this.howItWorksSectionHeading = page.getByRole('heading', { name: 'Fast. Easy. Done.' });
    this.createCampaignHeading = page.getByRole('heading', { name: 'Create Campaign' });
    this.shareQrCodeHeading = page.getByRole('heading', { name: 'Share QR Code' });
    this.collectReviewsHeading = page.getByRole('heading', { name: 'Collect Reviews' });
    this.teamsSectionHeading = page.getByRole('heading', { name: 'How Teams Use Campaigns' });
    this.ctaHeading = page.getByRole('heading', { name: 'Ready to Transform Your' });
    this.ctaGetStartedLink = page.locator('#main-content').getByRole('link', { name: 'Get Started' });
    const footer = page.getByRole('contentinfo');
    this.footerLogo = footer.getByRole('img', { name: 'Logo' });
    this.footerText = footer.getByText('The complete platform for');
    this.footerProductsHeading = footer.getByRole('heading', { name: 'Products' });
    this.footerFeaturesButton = footer.getByRole('button', { name: 'Features' });
    this.footerHowItWorksButton = footer.getByRole('button', { name: 'How It Works' });
    this.footerCompanyHeading = footer.getByRole('heading', { name: 'Company' });
    this.footerAboutUsLink = footer.getByRole('link', { name: 'About Us' });
    this.footerContactButton = footer.getByRole('button', { name: 'Contact', exact: true });
    this.footerPrivacyLink = footer.getByRole('link', { name: 'Privacy' });
    this.facebookLink = footer.getByRole('link', { name: 'Facebook (opens in a new tab)' });
    this.linkedinLink = footer.getByRole('link', { name: 'LinkedIn (opens in a new tab)' });
    this.instagramLink = footer.getByRole('link', { name: 'Instagram (opens in a new tab)' });
    this.skipToContentLink = page.getByRole('link', { name: 'Skip to main content' });
    this.navbarToggler = page.getByRole('button', { name: 'Toggle navigation' });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await expect(this.getStartedLink).toBeVisible();
  }

  async openLogin(): Promise<void> {
    await this.getStartedLink.click();
  }

  async openRequestAccess(): Promise<void> {
    await this.startNowLink.click();
  }

  async openCtaGetStarted(): Promise<void> {
    await this.ctaGetStartedLink.click();
  }

  async expectLoaded(path: string): Promise<void> {
    await expect(this.page).toHaveURL(path);
    await expect(this.getStartedLink).toBeVisible();
  }

  async expectContactDialogVisible(): Promise<void> {
    await expect(this.contactDialogCloseButton).toBeVisible();
  }

  async closeContactDialog(): Promise<void> {
    await this.contactDialogCloseButton.click();
    await expect(this.contactDialogCloseButton).toBeHidden();
  }

  async expectPopupUrlContains(trigger: Locator, urlSubstring: string): Promise<void> {
    const popupPromise = this.page.waitForEvent('popup');
    await trigger.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toContain(urlSubstring);
    await popup.close();
  }
}
