import { expect, type Page } from "@playwright/test";

/**
 * Navigate and wait until the TanStack Start client router has hydrated.
 * Without this, keyboard/aria assertions can run against server-rendered
 * markup that has no React event handlers attached yet.
 */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => "__TSR_ROUTER__" in window, null, { timeout: 60_000 });
  await expect(page.locator("header")).toBeVisible();
}
