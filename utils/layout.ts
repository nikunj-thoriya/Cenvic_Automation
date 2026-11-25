import { expect, type Page } from '@playwright/test';

/** Mobile viewport used by the responsive test cases (390 x 844). */
export const MOBILE_VIEWPORT = { width: 390, height: 844 };

/** Asserts the page content fits the viewport width, i.e. there is no horizontal scrolling. */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);
}
