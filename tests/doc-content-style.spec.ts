import { test, expect } from "@playwright/test";
import { DOC_DETAIL_URL, TINYMCE_IFRAME } from "./tinymce-helpers";

// docs/spec/detail/doc-content-style.md の動作確認に基づくテスト。
// docs-store がプロセス内メモリを共有するため、1つのDocに対する
// 一連の操作を test.describe.serial で順序保証しながら実行し、
// 他のテストファイルに影響しないよう最後に作成したDocを削除する。

test.describe.serial("プレビュー画面とTinyMCEの表示スタイル統一", () => {
  let docId = "";

  test("TinyMCEの編集領域に共通スタイル（doc-contentクラス）が適用される", async ({
    page,
  }) => {
    await page.goto("/docs/new");

    const frameBody = page.frameLocator(TINYMCE_IFRAME).locator("body");
    await expect(frameBody).toBeVisible();
    await expect(frameBody).toHaveClass(/doc-content/);
  });

  test("見出しと箇条書きを含む本文を作成するとプレビュー画面に共通スタイルが反映される", async ({
    page,
  }) => {
    await page.goto("/docs/new");

    await page.getByLabel("Title").fill("Style Doc");
    const frame = page.frameLocator(TINYMCE_IFRAME);
    await frame.locator("body").click();
    // Heading 2 を選択してから見出しを入力し、Enterで段落に戻して箇条書きを追加する。
    await page.getByRole("button", { name: "Block Paragraph" }).click();
    await page.getByRole("menuitemcheckbox", { name: "Heading 2" }).click();
    await page.keyboard.type("Section Title");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Bullet list" }).click();
    await page.keyboard.type("Item One");
    await page.getByLabel("Author").fill("Tester");
    await page.getByRole("button", { name: "Create" }).click();

    // 動的ルートの初回コンパイル（Turbopack）で数秒かかることがあるため、
    // 遷移待ちのタイムアウトを長めに取る。
    await page.waitForURL(DOC_DETAIL_URL, { timeout: 20_000 });
    docId = new URL(page.url()).pathname.split("/").pop() ?? "";
    expect(docId).not.toBe("");

    const content = page.locator("main .doc-content");
    await expect(content).toBeVisible();
    await expect(
      content.locator("h2", { hasText: "Section Title" }),
    ).toBeVisible();
    await expect(content.locator("li", { hasText: "Item One" })).toBeVisible();
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
