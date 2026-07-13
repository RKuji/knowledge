# Doc ContentのTinyMCE入力

概要は[[../overview/doc-content-tinymce]]を参照。[[doc-crud]]も参照。

## 依存ライブラリ

- `tinymce`（本体、セルフホスト用） / `@tinymce/tinymce-react`（Reactラッパー） / `isomorphic-dompurify`（保存済みHTMLのサニタイズ用）を使用する。
- TinyMCEはTiny CloudのAPIキーなしでセルフホストする。`scripts/copy-tinymce.mjs`が`node_modules/tinymce`を`public/tinymce`にコピーし、`package.json`の`postinstall`により`npm install`のたびに自動実行される。
  - `public/tinymce`は`node_modules`から生成される成果物のため`.gitignore`の対象であり、リポジトリにはコミットしない。

## エディタコンポーネント

- `app/docs/doc-content-field.tsx`（`"use client"`）の`DocContentField`コンポーネントは、`@tinymce/tinymce-react`の`<Editor>`を`tinymceScriptSrc="/tinymce/tinymce.min.js"` / `licenseKey="gpl"`でセルフホスト設定して描画する。
  - Server ActionsがFormData経由でフォーム送信を受け取る仕組み（[[doc-crud]]参照）と組み合わせるため、エディタの内容は`useState`で保持しつつ`<input type="hidden" name={name} value={value} />`に同期し、`onEditorChange`で更新する。
  - `name`と`defaultValue`（編集時の初期値）をpropsとして受け取る汎用コンポーネントで、新規作成・編集の両フォームで共用する。
- `app/docs/new/page.tsx`・`app/docs/[id]/edit/page.tsx`のContent欄は`<DocContentField name="content" />`（編集側は`defaultValue={doc.content}`）を使う。hidden inputはブラウザの入力検証の対象にならないため`required`属性は持たない。空文字での送信を防ぐ場合は別途JS側でのバリデーションが必要（未実装）。

## 保存済みコンテンツの表示

- Contentの保存形式はTinyMCEが出力するHTMLであるため、`app/docs/[id]/page.tsx`の詳細表示は`isomorphic-dompurify`でサニタイズした上で`dangerouslySetInnerHTML`により描画する。
  - 保存されたHTMLをそのまま描画するとStored XSSのリスクがあるため、表示直前に必ず`DOMPurify.sanitize()`を通す。
- データストア（`app/lib/docs-store.ts`）やServer Actions（`app/lib/actions.ts`）は`content`を単なる文字列として保存するのみで、値がプレーンテキストかHTMLかは関知しない。

## クロスオリジンアクセス時の設定

- 開発サーバーに`localhost`ではなくIPアドレス等の別オリジンからアクセスすると、Next.jsのクロスオリジン保護機能により、TinyMCE本体（`/tinymce/tinymce.min.js`）を読み込むための動的な`<script>`挿入がサイレントにブロックされ、エディタが初期化されず`<textarea>`のまま表示される（ネットワークタブに`tinymce.min.js`へのリクエストが現れず、`/__nextjs_font/...`が403、サーバーログに`Blocked cross-origin request to Next.js dev resource ...`と出力される）。
- これを避けるため、`next.config.ts`の`allowedDevOrigins`にアクセス元のオリジンを設定する。

  ```ts
  const nextConfig: NextConfig = {
    allowedDevOrigins: ["172.16.148.22"],
  };
  ```

  `next.config.ts`の変更は開発サーバー起動時にのみ読み込まれるため、設定後は`npm run dev`の再起動が必要。

## 動作確認

- `npm run build`が正常に完了することを確認済み。
- `npm run dev`起動後、Playwright（[[../../setup/playwright-setup]]参照）で以下を自動操作し、期待通りの結果になることを確認済み。
  1. `/docs/new`でTinyMCEのツールバー・編集領域が表示される。
  2. 本文を入力し、太字（Ctrl+B）を適用してCreateすると、詳細ページ（`/docs/[id]`）にリダイレクトされ、太字を含むリッチテキストが反映される。
  3. `/docs/[id]/edit`を開くと、保存済みのHTML（`<p>Hello from TinyMCE<strong> bold text</strong></p>`）がTinyMCEの編集領域に正しく読み込まれる。
