# Doc Contentの入力方法をTinyMCEに変更

概要は[[../overview/doc-content-tinymce]]を参照。[[doc-crud]]も参照。

## 変更内容

### 依存ライブラリ

- `tinymce`（本体、セルフホスト用） / `@tinymce/tinymce-react`（Reactラッパー） / `isomorphic-dompurify`（保存済みHTMLのサニタイズ用）を`npm install`で追加。
- TinyMCEはTiny CloudのAPIキーなしでセルフホストする方針とし、`scripts/copy-tinymce.mjs`で`node_modules/tinymce`を`public/tinymce`にコピーする。このスクリプトを`package.json`の`postinstall`に登録し、`npm install`のたびに自動実行されるようにした。
  - `public/tinymce`は`node_modules`から生成される成果物のため`.gitignore`に追加し、リポジトリにはコミットしない。

### エディタコンポーネント

- `app/docs/doc-content-field.tsx`（`"use client"`）に`DocContentField`コンポーネントを新設。
  - `@tinymce/tinymce-react`の`<Editor>`を`tinymceScriptSrc="/tinymce/tinymce.min.js"` / `licenseKey="gpl"`でセルフホスト設定して利用。
  - Server Actionが`FormData`経由でフォーム送信を受け取る既存の仕組み（[[doc-crud]]参照）を変えずに使えるよう、エディタの内容を`useState`で保持しつつ`<input type="hidden" name={name} value={value} />`に同期し、`onEditorChange`で更新する。
  - `name`と`defaultValue`（編集時の初期値）をpropsとして受け取る汎用コンポーネントとし、新規作成・編集の両フォームで共用。
- `app/docs/new/page.tsx`・`app/docs/[id]/edit/page.tsx`の`Content`欄の`<textarea>`を`<DocContentField name="content" />`（編集側は`defaultValue={doc.content}`）に置き換え。
  - 既存の`required`属性はhidden inputでは意味を持たない（ブラウザの入力検証はhidden要素をスキップする）ため削除。空文字での送信を防ぎたい場合は別途JS側でのバリデーションが必要（今回は未実装）。

### 保存済みコンテンツの表示

- Contentの保存形式がプレーンテキストからTinyMCEが出力するHTMLに変わったため、`app/docs/[id]/page.tsx`の詳細表示を`<p className="whitespace-pre-wrap">{doc.content}</p>`から、`isomorphic-dompurify`でサニタイズした上で`dangerouslySetInnerHTML`により描画する形に変更。
  - 保存されたHTMLをそのまま描画するとStored XSSのリスクがあるため、表示直前に`DOMPurify.sanitize()`を通す。
- データストア（`app/lib/docs-store.ts`）やServer Actions（`app/lib/actions.ts`）自体には変更なし（`content`は引き続き文字列として保存されるのみで、値がプレーンテキストかHTMLかは関知しない）。

### 開発サーバーへのIPアドレスアクセス時の既知の問題

- `localhost`ではなくIPアドレス（例: `http://172.16.148.22:3000`）で開発サーバーにアクセスすると、Next.jsの開発サーバーが標準で持つクロスオリジン保護機能により、TinyMCE本体（`/tinymce/tinymce.min.js`）を読み込むための動的な`<script>`挿入がサイレントにブロックされ、エディタが初期化されず`<textarea>`のまま表示される事象を確認した。
  - 症状: ネットワークタブに`tinymce.min.js`へのリクエストが一切現れず、コンソールにもエラーが出ない。ただし`/__nextjs_font/...`へのリクエストは403 Forbiddenになり、`Blocked cross-origin request to Next.js dev resource ...`という警告がサーバーログに出力される。
  - 対処として`next.config.ts`に`allowedDevOrigins`を追加し、アクセス元のオリジンを許可した。

    ```ts
    const nextConfig: NextConfig = {
      allowedDevOrigins: ["172.16.148.22"],
    };
    ```

  - `next.config.ts`の変更は開発サーバー起動時にのみ読み込まれるため、設定後は`npm run dev`の再起動が必要。

## 動作確認

- `npm run build`が正常に完了することを確認済み。
- `npm run dev`起動後、Playwright（[[playwright-setup]]参照）で以下を自動操作し、期待通りの結果になることを確認済み。
  1. `/docs/new`でTinyMCEのツールバー・編集領域が表示される。
  2. 本文を入力し、太字（Ctrl+B）を適用してCreateすると、詳細ページ（`/docs/[id]`）にリダイレクトされ、太字を含むリッチテキストが反映される。
  3. `/docs/[id]/edit`を開くと、保存済みのHTML（`<p>Hello from TinyMCE<strong> bold text</strong></p>`）がTinyMCEの編集領域に正しく読み込まれる。
