# Doc CRUD機能の実装

概要は[[../overview/doc-crud]]を参照。

## データストア

- 本プロジェクトにはDB/ORM関連の依存が存在しないため、新規ライブラリを追加せず、`app/lib/docs-store.ts`にモジュールスコープの配列によるインメモリストアを実装した。
- `Doc`型: `id`（`crypto.randomUUID()`で発行） / `title` / `content` / `author` / `createdAt` / `updatedAt`
- 提供する関数: `listDocs` / `getDoc` / `createDoc` / `updateDoc` / `deleteDoc`
- 制約: サーバープロセスのメモリ上にのみ保持されるため、開発サーバーの再起動（ホットリロードによるモジュール再評価を含む）やデプロイ環境のプロセス再起動でデータは失われる。永続化が必要になった場合はDB導入に置き換える想定。

## Server Actions

`app/lib/actions.ts`に`"use server"`ディレクティブ付きで以下を実装（[Mutating Data](../../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md)の規約に準拠）。

- `createDocAction(formData)`: `docs-store`の`createDoc`を呼び出し、`/docs`を`revalidatePath`した上で作成したDocの詳細ページへ`redirect`
- `updateDocAction(formData)`: `updateDoc`を呼び出し、`/docs`と`/docs/[id]`を`revalidatePath`した上で詳細ページへ`redirect`
- `deleteDocAction(formData)`: `deleteDoc`を呼び出し、`/docs`を`revalidatePath`した上で一覧ページへ`redirect`

いずれも`<form action={...}>`から`FormData`を受け取る形で、フォームからの直接呼び出し（プログレッシブエンハンスメント）に対応する。

## 画面構成の補足

- `[id]`のダイナミックセグメントは`params: Promise<{ id: string }>`として受け取り、`await`してから使用（Next.js 15以降の規約）。
- 存在しない`id`の場合は`notFound()`で404を返す。
- `app/nav-menu.tsx`に`/docs`へのリンクを追加し、左ナビからDoc一覧へ遷移できるようにした。

## 動作確認

- `npm run build`が正常に完了することを確認済み（`/docs`は静的、`/docs/[id]`・`/docs/[id]/edit`は動的ルートとして出力）
- `npm run dev`起動後、Playwright（[[playwright-setup]]参照）で以下のフローを自動操作し、期待通りの結果になることを確認済み
  1. `/docs`が空の場合に「No docs yet.」と表示される
  2. `/docs/new`からTitle・Content・Authorを入力して作成すると、詳細ページ（`/docs/[id]`）にリダイレクトされ、入力した内容が表示される
  3. `/docs`一覧に作成したDocのタイトルが表示される
  4. `/docs/[id]/edit`でTitleを変更して保存すると、詳細ページに変更後のタイトルが反映される
  5. 詳細ページの「Delete」から削除すると`/docs`にリダイレクトされ、Docが一覧から消える
