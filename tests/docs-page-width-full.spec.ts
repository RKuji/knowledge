import { test, expect } from "@playwright/test";
import { DOC_DETAIL_URL } from "./tinymce-helpers";

// docs/spec/detail/docs-page-width-full.md の動作確認に基づくテスト。
// /docs/[id] と /docs/[id]/edit の確認に既存Docが必要なため、
// test.describe.serial で1つのDocを作成してから確認し、最後に削除する。

test.describe.serial("Docsページの表示幅（max-w-full）", () => {
  let docId = "";

  test("一覧ページ・新規作成ページのラッパーがmax-w-fullを持つ", async ({
    page,
  }) => {
    await page.goto("/docs");
    const listWrapper = page.locator("main > div").first();
    await expect(listWrapper).toHaveClass(/max-w-full/);
    await expect(listWrapper).not.toHaveClass(/max-w-2xl/);

    await page.goto("/docs/new");
    const newWrapper = page.locator("main > div").first();
    await expect(newWrapper).toHaveClass(/max-w-full/);
    await expect(newWrapper).not.toHaveClass(/max-w-2xl/);
  });

  test("詳細ページ・編集ページのラッパーがmax-w-fullを持つ", async ({
    page,
  }) => {
    await page.goto("/docs/new");
    await page.getByLabel("Title").fill("Width Test Doc");
    await page.getByLabel("Author").fill("Width Tester");
    await page.getByRole("button", { name: "Create" }).click();

    // 動的ルートの初回コンパイル（Turbopack）で数秒かかることがあるため、
    // 遷移待ちのタイムアウトを長めに取る。
    await page.waitForURL(DOC_DETAIL_URL, { timeout: 20_000 });
    docId = new URL(page.url()).pathname.split("/").pop() ?? "";
    expect(docId).not.toBe("");

    const detailWrapper = page.locator("main > div").first();
    await expect(detailWrapper).toHaveClass(/max-w-full/);
    await expect(detailWrapper).not.toHaveClass(/max-w-2xl/);

    await page.goto(`/docs/${docId}/edit`);
    const editWrapper = page.locator("main > div").first();
    await expect(editWrapper).toHaveClass(/max-w-full/);
    await expect(editWrapper).not.toHaveClass(/max-w-2xl/);
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
