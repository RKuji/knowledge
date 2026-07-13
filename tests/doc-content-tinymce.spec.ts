import { test, expect } from "@playwright/test";
import { DOC_DETAIL_URL, TINYMCE_IFRAME, fillContent } from "./tinymce-helpers";

// docs/spec/detail/doc-content-tinymce.md の動作確認に基づくテスト。
// docs-store がプロセス内メモリを共有するため、1つのDocに対する
// 一連の操作を test.describe.serial で順序保証しながら実行し、
// 他のテストファイルに影響しないよう最後に作成したDocを削除する。

test.describe.serial("Doc ContentのTinyMCE入力", () => {
  let docId = "";

  test("/docs/new でTinyMCEのツールバーと編集領域が表示される", async ({
    page,
  }) => {
    await page.goto("/docs/new");

    // 実装依存のCSSクラスではなく、アクセシビリティロールで存在確認する。
    await expect(page.getByRole("toolbar").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Bold" })).toBeVisible();
    await expect(
      page.frameLocator(TINYMCE_IFRAME).locator("body"),
    ).toBeVisible();
  });

  test("本文を入力し太字を適用してCreateすると詳細ページに反映される", async ({
    page,
  }) => {
    await page.goto("/docs/new");

    await page.getByLabel("Title").fill("TinyMCE Doc");
    await fillContent(page, "Hello from TinyMCE");
    const frame = page.frameLocator(TINYMCE_IFRAME);
    await frame.locator("body").click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("ControlOrMeta+B");
    await page.getByLabel("Author").fill("Tester");
    await page.getByRole("button", { name: "Create" }).click();

    // 動的ルートの初回コンパイル（Turbopack）で数秒かかることがあるため、
    // 遷移待ちのタイムアウトを長めに取る。
    await page.waitForURL(DOC_DETAIL_URL, { timeout: 20_000 });
    docId = new URL(page.url()).pathname.split("/").pop() ?? "";
    expect(docId).not.toBe("");

    await expect(
      page.locator("main strong", { hasText: "Hello from TinyMCE" }),
    ).toBeVisible();
  });

  test("編集ページを開くと保存済みHTMLがTinyMCEに読み込まれる", async ({
    page,
  }) => {
    await page.goto(`/docs/${docId}/edit`);

    await expect(
      page.frameLocator(TINYMCE_IFRAME).locator("strong", {
        hasText: "Hello from TinyMCE",
      }),
    ).toBeVisible();
  });

  test.afterAll(async ({ browser }) => {
    if (!docId) return;
    const page = await browser.newPage();
    await page.goto(`/docs/${docId}`);
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForURL("/docs", { timeout: 20_000 });
    await page.close();
  });
});
