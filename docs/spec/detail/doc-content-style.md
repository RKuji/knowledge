# プレビュー画面とTinyMCEの表示スタイル統一

概要は[[../overview/doc-content-style]]を参照。[[doc-content-tinymce]]も参照。

## 共通スタイルファイル

- `public/styles/doc-content.css`は、プレビュー画面とTinyMCEエディタの編集領域の両方から読み込む共通スタイルファイルである。
  - TinyMCEの編集領域（iframe）はURL経由でしかCSSを読み込めないため、`app/`配下ではなく静的配信される`public/`配下に置く。
  - `.doc-content`クラスをスコープとして、見出し（`h1`〜`h6`）・段落・箇条書き（`ul`/`ol`）・リンク・表（`table`/`th`/`td`）・インラインコード（`code`）のスタイルを定義する。TinyMCEのツールバー構成（`blocks | bold italic | bullist numlist | link table | code`）で入力できる要素に対応する。

## 適用箇所

- TinyMCEエディタ（`app/docs/doc-content-field.tsx`）
  - `init`の`content_css: "/styles/doc-content.css"`により、編集領域のiframe内にスタイルを読み込む。
  - `init`の`body_class: "doc-content"`により、iframeの`<body>`に`doc-content`クラスを付与し、プレビュー画面と同じCSSスコープが効くようにする。
- プレビュー画面（`app/docs/[id]/page.tsx`）
  - `<link rel="stylesheet" href="/styles/doc-content.css" />`でスタイルを読み込む（React 19では`<link>`をコンポーネント内に直接書ける）。
  - `dangerouslySetInnerHTML`で保存済みHTMLを描画している`<div>`は`className="doc-content"`を持ち、TinyMCE側と同じクラスのスコープでスタイルが適用される。

## 動作確認

- `npm run build`が正常に完了することを確認済み。
- `npm run dev`起動後、Playwright（[[../../setup/playwright-setup]]参照）で以下を自動操作し、期待通りの結果になることを確認済み。
  1. `/docs/new`で見出し（Heading 2）と箇条書きを含む本文を入力してCreateすると、詳細ページに文字サイズや箇条書きの記号が反映された状態で表示される。
  2. TinyMCEの編集領域（iframe）の`<body>`に`doc-content`クラスが付与されている。
  3. プレビュー画面の本文コンテナに`doc-content`クラスが付与されている。
