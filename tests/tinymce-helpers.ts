import type { Page } from "@playwright/test";

// tests/doc-crud.spec.ts と tests/doc-content-tinymce.spec.ts で共有する
// TinyMCEエディタ操作用のヘルパー（特定のdocsに対応するテストファイルではないため
// tests/ と docs/spec/detail の1対1対応の対象外）。

export const TINYMCE_IFRAME = "iframe.tox-edit-area__iframe";

// crypto.randomUUID() が発行するID形式にのみマッチさせ、
// 遷移前の "/docs/new" を誤って一致させないようにする。
export const DOC_DETAIL_URL = /\/docs\/[0-9a-f-]{36}$/;

export async function fillContent(page: Page, text: string) {
  const frame = page.frameLocator(TINYMCE_IFRAME);
  await frame.locator("body").click();
  await frame.locator("body").fill(text);
}
