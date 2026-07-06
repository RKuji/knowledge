# アプリケーションのリセット（まっさらな状態への変更）

## 目的

`create-next-app`で生成されたデフォルトの表示・機能を取り除き、まっさらなアプリケーションにする。

## 変更内容

- `app/page.tsx`: デフォルトのロゴ・見出し・説明文・リンク群をすべて削除し、空のコンテナのみを返すように変更
- `app/layout.tsx`: `metadata`の`title`・`description`を空文字に変更
- `public/`: 未使用となったデフォルトのSVGファイルを削除
  - `next.svg`
  - `vercel.svg`
  - `globe.svg`
  - `file.svg`
  - `window.svg`

## 変更しなかった箇所

- `app/globals.css`: テーマ変数（`--background` / `--foreground`）のみのシンプルな内容のため変更なし
- フォント設定（Geist / Geist Mono）は維持

## 動作確認

- `npm run build` が正常に完了することを確認済み
