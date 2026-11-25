import { expect, type FrameLocator, type Page } from '@playwright/test';

const YOPMAIL_DOMAIN = '@yopmail.com';
// The recorded code is 6 characters (e.g. 1MDKZ9); requiring a digit avoids matching words such as CENVIC.
const VERIFICATION_CODE = /\b(?=[A-Z0-9]*\d)[A-Z0-9]{6}\b/;
const MAIL_ARRIVAL_TIMEOUT = 90_000;

/** Returns the YOPmail mailbox name (the part before @yopmail.com). */
export function getYopmailMailbox(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!normalized.endsWith(YOPMAIL_DOMAIN)) {
    throw new Error(`"${email}" is not a YOPmail address (expected name${YOPMAIL_DOMAIN}).`);
  }
  return normalized.slice(0, -YOPMAIL_DOMAIN.length);
}

/** Reads verification codes from a public YOPmail inbox. Selectors are not DOM-verified yet (see PT-020). */
export class YopmailInbox {
  private readonly inboxFrame: FrameLocator;
  private readonly mailFrame: FrameLocator;

  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
    private readonly mailbox: string,
  ) {
    this.inboxFrame = page.frameLocator('#ifinbox');
    this.mailFrame = page.frameLocator('#ifmail');
  }

  async open(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/?${this.mailbox}`);
    await expect(this.inboxFrame.locator('body')).toBeAttached();
  }

  /** ID of the newest message, or null for an empty inbox. Call before requesting a code. */
  async getLatestMailId(): Promise<string | null> {
    const newest = this.inboxFrame.locator('div.m').first();
    return (await newest.count()) > 0 ? newest.getAttribute('id') : null;
  }

  /** Waits for a message newer than previousMailId and returns the verification code it contains. */
  async waitForVerificationCode(previousMailId: string | null): Promise<string> {
    await expect
      .poll(
        async () => {
          await this.page.locator('#refresh').click();
          return this.getLatestMailId();
        },
        { timeout: MAIL_ARRIVAL_TIMEOUT, intervals: [3_000] },
      )
      .not.toBe(previousMailId);

    await this.inboxFrame.locator('div.m').first().click();
    const body = await this.mailFrame.locator('#mail').innerText();
    const code = VERIFICATION_CODE.exec(body)?.[0];
    if (!code) {
      throw new Error('A verification code was not found in the newest YOPmail message.');
    }
    return code;
  }
}
