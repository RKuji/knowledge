# Playwrightのインストール（画面確認用）

## 目的

UI変更を実際のブラウザで視覚的に確認できるようにする。

## 変更内容

- `npm install -D playwright` により devDependencies に追加（`package.json` / `package-lock.json`）
- `npx playwright install chromium` によりChromiumブラウザ本体（実行ファイル）を `~/.cache/ms-playwright/` にダウンロード
- Chromiumの起動に必要なOS共有ライブラリが不足していたため、以下をシステムに追加インストール（プロジェクト外・OSレベルの変更、ユーザー自身の端末で`sudo`実行）
  - `libatk1.0-0`
  - `libatk-bridge2.0-0`
  - `libcups2`
  - `libasound2t64`
  - `libxdamage1`
  - `libatspi2.0-0`

## 使い方

開発サーバー起動後、以下のようなNode.jsスクリプトでスクリーンショットを撮影できる。

```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/screenshot.png' });
  await browser.close();
})();
```

## 動作確認

- `chromium.launch()` でエラーなく起動し、スクリーンショットが撮影できることを確認済み

## 自動テストランナー（@playwright/test）の追加

`docs/spec/detail/`配下の各詳細設計書に記載された「動作確認」の手順を自動化するため、テストランナーの`@playwright/test`を追加した。

### 変更内容

- `npm install -D @playwright/test@1.61.1`（既存の`playwright`と同じバージョン）によりdevDependenciesに追加（`package.json` / `package-lock.json`）。ブラウザ本体は上記でインストール済みのChromiumをそのまま利用する。
- `playwright.config.ts`を新規作成。
  - `testDir: "./tests"`。テストは`app/lib/docs-store.ts`のインメモリストアを共有するため、`fullyParallel: false` / `workers: 1`で直列実行にしている。
  - `webServer`で`npm run dev`をテスト実行時に自動起動・終了する（`reuseExistingServer: !process.env.CI`によりローカルでは起動済みのdevサーバーがあれば再利用）。
- `tests/`配下のテストファイルは`docs/spec/detail/`配下のドキュメントと1対1で対応させる（AGENTS.md参照）。
  - `tests/layout-nav-menu-main-area.spec.ts`: [[../spec/detail/layout-nav-menu-main-area]]の動作確認に対応。左nav（`<aside>`）・右メイン（`<main>`）の構成と、navmenuからの画面遷移を確認する。
  - `tests/doc-crud.spec.ts`: [[../spec/detail/doc-crud]]の動作確認に対応。`test.describe.serial`で1つのDocに対する一連の操作（空一覧の表示→新規作成→一覧表示→タイトル変更→削除）を順番に検証する。
  - `tests/doc-content-tinymce.spec.ts`: [[../spec/detail/doc-content-tinymce]]の動作確認に対応。TinyMCEのツールバー・編集領域の表示、太字入力を含む新規作成、編集画面での保存済みHTMLの読み込みを検証する。他のテストファイルに影響しないよう、`test.afterAll`で作成したDocを削除する。
  - `tests/tinymce-helpers.ts`: 上記2ファイルで共有するTinyMCE操作用ヘルパー（特定のドキュメントに対応しない共通コードのため1対1対応の対象外）。
    - TinyMCEの編集領域は`page.frameLocator("iframe.tox-edit-area__iframe")`でiframe内にアクセスする。
    - ツールバーの存在確認は実装依存のCSSクラス（`.tox-toolbar`）ではなく、アクセシビリティロール（`getByRole("toolbar")` / `getByRole("button", { name: "Bold" })`）で行う。
    - Doc詳細ページのURL（`/docs/<uuid>`）を待つ際は、`/docs/new`自体を誤ってマッチさせないよう`crypto.randomUUID()`の形式（36文字のハイフン区切り）に限定した正規表現を用いている。
- `package.json`に`"test:e2e": "playwright test"`スクリプトを追加。
- `.gitignore`にテスト実行で生成される`/test-results/`・`/playwright-report/`・`/blob-report/`を追加。

### 注意点

- `app/lib/docs-store.ts`のストアはNext.jsサーバープロセスのメモリ上にあるため、テスト実行中に同じdevサーバー（同じポート）へ他のプロセスから同時にアクセスしてDocの作成・削除を行うと、テストの前提（一覧が空である等）が崩れて失敗することがある。テスト実行前にポートを使用している既存のdevサーバーが他の作業と無関係であれば停止しておくこと。
- Turbopackの開発サーバーでは動的ルート（`/docs/[id]`等）への初回アクセス時にコンパイルが走り数秒かかることがあるため、フォーム送信後の画面遷移待ちは`page.waitForURL(..., { timeout: 20_000 })`のように長めのタイムアウトを指定している。

## 動作確認（自動テスト）

- `npm run test:e2e`で`tests/layout-nav-menu-main-area.spec.ts`・`tests/doc-crud.spec.ts`・`tests/doc-content-tinymce.spec.ts`の計10テストがすべて成功することを確認済み。
