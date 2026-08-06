import { test, expect } from "@playwright/test";

test.describe("Top bar — keyboard & aria", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/affiliate-manager");
  });

  test("universal search is a labelled search landmark that submits with Enter", async ({
    page,
  }) => {
    const form = page.getByRole("search");
    const input = form.getByRole("textbox", { name: "Universal search" });
    await expect(input).toBeVisible();

    await input.click();
    await input.fill("acme");
    await expect(form.getByRole("button", { name: "Clear search" })).toBeVisible();

    await input.press("Enter");
    await expect(page).toHaveURL(/\/affiliate-manager\/search\?.*q=acme/);
  });

  test("clear-search button empties the field and keeps it reachable by keyboard", async ({
    page,
  }) => {
    const input = page.getByRole("textbox", { name: "Universal search" });
    await input.fill("payouts");

    const clear = page.getByRole("button", { name: "Clear search" });
    await clear.focus();
    await expect(clear).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(input).toHaveValue("");
    await expect(page.getByRole("button", { name: "Clear search" })).toHaveCount(0);
  });

  test("command palette opens with the keyboard shortcut and from its labelled button", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Open command palette/ }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog")).toBeVisible();

    const palette = page.getByRole("dialog");
    await expect(palette.getByRole("combobox").or(palette.getByRole("textbox")).first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("icon-only actions all expose accessible names", async ({ page }) => {
    const header = page.locator("header");
    for (const name of [
      "Open command palette (Command or Control + K)",
      "Help & keyboard shortcuts",
    ]) {
      await expect(header.getByRole("button", { name })).toBeVisible();
    }

    const unnamed = await header.evaluate((el) =>
      Array.from(el.querySelectorAll("button")).filter(
        (b) =>
          !b.getAttribute("aria-label")?.trim() &&
          !b.getAttribute("aria-labelledby") &&
          !b.textContent?.trim(),
      ).length,
    );
    expect(unnamed).toBe(0);
  });

  test("workspace nav marks the current wall and is keyboard navigable", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Affiliate manager workspaces" });
    await expect(nav).toBeVisible();

    const current = nav.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText("Dashboard");

    const affiliates = nav.getByRole("link", { name: "Affiliates", exact: true });
    await affiliates.focus();
    await expect(affiliates).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/affiliate-manager\/affiliates/);
    await expect(
      nav.getByRole("link", { name: "Affiliates", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  });
});
