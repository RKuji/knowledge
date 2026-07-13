import { test, expect } from "@playwright/test";

// docs/spec/detail/html-lang-ja.md の動作確認に基づくテスト。
test.describe("html lang属性", () => {
  test("lang属性がjaになっている", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
});
