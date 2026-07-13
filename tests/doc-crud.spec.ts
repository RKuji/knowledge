import { test, expect } from "@playwright/test";
import { DOC_DETAIL_URL, fillContent } from "./tinymce-helpers";

// docs/spec/detail/doc-crud.md の動作確認に基づくテスト。
// docs-store がプロセス内メモリを共有するため、1つのDocに対する
// 一連の操作を test.describe.serial で順序保証しながら実行する。

test.describe.serial("Doc CRUD", () => {
  let docId = "";

  test("一覧が空のとき「No docs yet.」と表示される", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.getByText("No docs yet.")).toBeVisible();
  });

  test("Title・Content・Authorを入力して作成すると詳細ページに反映される", async ({
    page,
  }) => {
    await page.goto("/docs/new");

    await page.getByLabel("Title").fill("Test Doc Title");
    await fillContent(page, "Test content body");
    await page.getByLabel("Author").fill("Test Author");
    await page.getByRole("button", { name: "Create" }).click();

    // 動的ルートの初回コンパイル（Turbopack）で数秒かかることがあるため、
    // 遷移待ちのタイムアウトを長めに取る。
    await page.waitForURL(DOC_DETAIL_URL, { timeout: 20_000 });
    docId = new URL(page.url()).pathname.split("/").pop() ?? "";
    expect(docId).not.toBe("");

    await expect(
      page.getByRole("heading", { name: "Test Doc Title" }),
    ).toBeVisible();
    await expect(page.getByText("by Test Author")).toBeVisible();
    await expect(page.getByText("Test content body")).toBeVisible();
  });

  test("一覧にDocのタイトルが表示される", async ({ page }) => {
    await page.goto("/docs");

    await expect(
      page.getByRole("link", { name: "Test Doc Title" }),
    ).toBeVisible();
  });

  test("編集でTitleを変更して保存すると詳細ページに反映される", async ({
    page,
  }) => {
    await page.goto(`/docs/${docId}/edit`);

    await page.getByLabel("Title").fill("Updated Doc Title");
    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForURL(`/docs/${docId}`, { timeout: 20_000 });
    await expect(
      page.getByRole("heading", { name: "Updated Doc Title" }),
    ).toBeVisible();
  });

  test("詳細ページのDeleteから削除すると一覧から消える", async ({ page }) => {
    await page.goto(`/docs/${docId}`);

    await page.getByRole("button", { name: "Delete" }).click();

    await page.waitForURL("/docs", { timeout: 20_000 });
    await expect(
      page.getByRole("link", { name: "Updated Doc Title" }),
    ).toHaveCount(0);
  });
});
