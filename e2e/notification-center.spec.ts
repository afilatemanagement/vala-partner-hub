import { test, expect, type Page } from "@playwright/test";

const TABS = ["All", "Mentions", "Approvals", "Payouts", "System"] as const;

async function openNotifications(page: Page) {
  await page.goto("/affiliate-manager");
  await page.getByRole("button", { name: /^Notifications/ }).click();
  const panel = page.getByRole("dialog");
  await expect(panel.getByRole("heading", { name: "Notifications" })).toBeVisible();
  return panel;
}

test.describe("Notification center — keyboard & aria", () => {
  test("bell trigger exposes an accessible name and a polite status region", async ({ page }) => {
    await page.goto("/affiliate-manager");
    const bell = page.getByRole("button", { name: /^Notifications/ });
    await expect(bell).toBeVisible();

    const status = bell.getByRole("status", { includeHidden: true });
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(status).toHaveAttribute("aria-atomic", "true");
  });

  test("tablist exposes roles, single selected tab and roving tabindex", async ({ page }) => {
    const panel = await openNotifications(page);

    const tablist = panel.getByRole("tablist", { name: "Notification categories" });
    await expect(tablist).toBeVisible();

    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(TABS.length);
    for (const [i, name] of TABS.entries()) {
      await expect(tabs.nth(i)).toHaveText(name);
    }

    await expect(panel.getByRole("tab", { selected: true })).toHaveCount(1);
    await expect(panel.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "true");
    await expect(panel.getByRole("tab", { name: "All" })).toHaveAttribute("tabindex", "0");
    await expect(panel.getByRole("tab", { name: "System" })).toHaveAttribute("tabindex", "-1");

    const panelRegion = panel.getByRole("tabpanel");
    await expect(panelRegion).toHaveAttribute("aria-labelledby", "notif-tab-All");
    await expect(panel.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-controls",
      "notif-panel",
    );
  });

  test("arrow keys, Home and End move selection through the tablist", async ({ page }) => {
    const panel = await openNotifications(page);
    await panel.getByRole("tab", { name: "All" }).focus();

    await page.keyboard.press("ArrowRight");
    await expect(panel.getByRole("tab", { name: "Mentions" })).toBeFocused();
    await expect(panel.getByRole("tab", { name: "Mentions" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.keyboard.press("End");
    await expect(panel.getByRole("tab", { name: "System" })).toBeFocused();
    await expect(panel.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "notif-tab-System",
    );

    // Wraps forward from the last tab back to the first.
    await page.keyboard.press("ArrowRight");
    await expect(panel.getByRole("tab", { name: "All" })).toBeFocused();

    // Wraps backward from the first tab to the last.
    await page.keyboard.press("ArrowLeft");
    await expect(panel.getByRole("tab", { name: "System" })).toBeFocused();

    await page.keyboard.press("Home");
    await expect(panel.getByRole("tab", { name: "All" })).toBeFocused();
    await expect(panel.getByRole("tab", { selected: true })).toHaveCount(1);
  });

  test("header actions are labelled and the panel announces via a live region", async ({ page }) => {
    const panel = await openNotifications(page);

    await expect(
      panel.getByRole("button", { name: "Mark all notifications as read" }),
    ).toBeVisible();
    await expect(panel.getByRole("button", { name: "Notification settings" })).toBeVisible();

    const live = panel.locator('p[role="status"]');
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toHaveAttribute("aria-atomic", "true");
  });

  test("empty state is announced with a heading, not an empty listbox", async ({ page }) => {
    const panel = await openNotifications(page);

    await expect(panel.getByRole("heading", { name: "You're all caught up" })).toBeVisible();
    await expect(panel.getByRole("listbox", { name: "Notifications" })).toHaveCount(0);
  });

  test("Escape closes the sheet and returns focus to the bell trigger", async ({ page }) => {
    await openNotifications(page);
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Notifications/ })).toBeFocused();
  });
});
