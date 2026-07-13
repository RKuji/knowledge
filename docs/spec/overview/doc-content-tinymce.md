# Doc ContentのTinyMCE入力

## 目的

[[doc-crud]]のDoc作成・編集フォームで、`Content`欄をリッチテキストエディタ（TinyMCE）による入力とする。

## 概要

- `Content`欄は、新設の`DocContentField`コンポーネントによりTinyMCEのリッチテキストエディタで入力する。
- 保存されるコンテンツはHTMLであり、詳細表示側はサニタイズした上でHTMLとして描画する。

詳細設計は[[../detail/doc-content-tinymce]]を参照。
