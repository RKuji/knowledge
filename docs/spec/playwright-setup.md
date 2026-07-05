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
