# Doc Contentの入力方法をTinyMCEに変更

## 目的

[[doc-crud]]で実装したDoc作成・編集フォームの`Content`欄を、プレーンテキストの`<textarea>`からリッチテキストエディタ（TinyMCE）に変更する。

## 概要

- 新設の`DocContentField`コンポーネントにより、`Content`欄をTinyMCEのリッチテキストエディタに置き換える。
- 保存されるコンテンツはプレーンテキストからHTMLに変わるため、詳細表示側はサニタイズした上でHTMLとして描画する。

詳細設計は[[../detail/doc-content-tinymce]]を参照。
