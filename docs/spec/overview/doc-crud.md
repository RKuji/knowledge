# Doc CRUD機能の実装

## 目的

`Doc`オブジェクト（プロパティ: `Title` / `Content` / `Author`）に対する作成・一覧表示・詳細表示・更新・削除（CRUD）機能を追加する。

## 画面構成

| ルート | ファイル | 役割 |
| --- | --- | --- |
| `/docs` | `app/docs/page.tsx` | Doc一覧表示、新規作成ページへのリンク |
| `/docs/new` | `app/docs/new/page.tsx` | 新規作成フォーム（`createDocAction`） |
| `/docs/[id]` | `app/docs/[id]/page.tsx` | Doc詳細表示、編集リンクと削除フォーム（`deleteDocAction`） |
| `/docs/[id]/edit` | `app/docs/[id]/edit/page.tsx` | 編集フォーム（`updateDocAction`、`defaultValue`で初期値表示） |

詳細設計は[[../detail/doc-crud]]を参照。
