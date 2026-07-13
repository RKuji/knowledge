import { test, expect } from "@playwright/test";
import { DOC_DETAIL_URL } from "./tinymce-helpers";

// docs/spec/detail/doc-title-truncate.md の動作確認に基づくテスト。
// docs-store がプロセス内メモリを共有するため、1つのDocに対する
// 一連の操作を test.describe.serial で順序保証しながら実行し、
// 他のテストファイルに影響しないよう最後に作成したDocを削除する。

// CJKフォントが入っていない実行環境でも確実に折り返し無しで幅が出るよう、
// スペースを含まないASCII文字列を使う。
const LONG_TITLE = "VeryLongDocTitleWithoutAnySpaces".repeat(10);

test.describe.serial("Docタイトルのtruncate表示", () => {
  let docId = "";

  test("作成すると一覧ページでタイトルが1行に省略表示される", async ({
    page,
  }) => {
    await page.goto("/docs/new");
    await page.getByLabel("Title").fill(LONG_TITLE);
    await page.getByLabel("Author").fill("Truncate Tester");
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(DOC_DETAIL_URL, { timeout: 20_000 });
    docId = new URL(page.url()).pathname.split("/").pop() ?? "";
    expect(docId).not.toBe("");

    await page.goto("/docs");
    const link = page.getByRole("link", { name: LONG_TITLE });
    await expect(link).toHaveClass(/truncate/);
    const overflowing = await link.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    );
    expect(overflowing).toBe(true);
  });

  test("詳細ページでタイトルが省略され、Edit/Deleteボタンが表示される", async ({
    page,
  }) => {
    await page.goto(`/docs/${docId}`);

    const heading = page.getByRole("heading", { name: LONG_TITLE });
    await expect(heading).toHaveClass(/truncate/);
    const overflowing = await heading.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    );
    expect(overflowing).toBe(true);

    await expect(page.getByRole("link", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
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
