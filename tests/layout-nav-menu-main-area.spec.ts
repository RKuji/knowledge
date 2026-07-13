import { test, expect } from "@playwright/test";

// docs/spec/detail/layout-nav-menu-main-area.md の動作確認に基づくテスト。
test.describe("画面レイアウト（左nav / 右メイン）", () => {
  test("左に固定幅のnavmenu、右にメイン表示エリアが表示される", async ({
    page,
  }) => {
    await page.goto("/");

    const aside = page.locator("body > aside");
    const main = page.locator("body > main");

    await expect(aside).toBeVisible();
    await expect(main).toBeVisible();
    await expect(aside).toHaveClass(/w-64/);
    await expect(main).toHaveClass(/flex-1/);
  });

  test("navmenuの「Docs」リンクから一覧ページへ遷移できる", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("aside nav").getByRole("link", { name: "Docs" }).click();

    await expect(page).toHaveURL(/\/docs$/);
  });
});
