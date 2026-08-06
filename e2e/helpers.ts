import { expect, type Page } from "@playwright/test";

/**
 * Navigate and wait until the TanStack Start client router has hydrated and
 * React handlers are attached. Without this, keyboard/aria assertions can run
 * against server-rendered markup that has no event handlers yet.
 */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => "__TSR_ROUTER__" in window, null, { timeout: 60_000 });
  await page.waitForFunction(
    () => {
      const el = document.querySelector("header button");
      return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps$"));
    },
    null,
    { timeout: 60_000 },
  );
  await expect(page.locator("header")).toBeVisible();
}

/**
 * Click a trigger until the overlay it controls is actually mounted. Dev-mode
 * hydration can swallow the very first pointer event, which would otherwise
 * make these tests flaky rather than meaningful.
 */
export async function openOverlay(page: Page, trigger: RegExp | string) {
  const button = page.getByRole("button", { name: trigger }).first();
  await expect(async () => {
    await button.click();
    await expect(page.getByRole("dialog")).toHaveCount(1, { timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
  return page.getByRole("dialog");
}
