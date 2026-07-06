# 技術スタック

## 目的

本リポジトリで採用する技術スタックを分類ごとに一覧化し、開発時の技術選定の指針とする。

## 技術スタック一覧

| 分類 | 要素 | 選定 |
| --- | --- | --- |
| 言語 | javascript | typescript |
| | スキーマ | zod schema |
| フロントアーキテクチャ | ルーティング | AppRouter |
| | レンダリング | SSR |
| | サーバー処理 | Server Actions |
| | 状態管理 | SWR |
| | デザインカタログ | StoryBook |
| | アーキテクチャ | レイヤードアーキテクチャ |
| | スタイリング | tailwind css |
| | デザインシステム | React |
| | システム | Next.JS |
| | 認証 | Cookie & JWT |
| | URIスコープ | サイトコード(テナント) |
| | データ取得 | ルーティング: SSR<br>アクション: ServerActions<br>リロード: SWR |
| | キャッシュ対象 | JS/CSS/フォント |
| | フォーム | React hook form |
| | バリデーター | zod |
| BFF | BFF | Next API Routes |
| | BFF責務 | 集約・整形 |
| | BFF分割単位 | 画面単位 |
| | API設計標準 | RESTFULL |
| | ページング | cursor |
| | BFFバージョニング | なし |
| | HTTP Action | GET/POST/PATCH/DELETE |
| | 冪等性対象 | POST |
| | レート制限/スロットリング | テナント＋ユーザー単位 |
| | データスコープ | サイトコード(テナント) |
| | APIドキュメント | Redoc |
| バックエンドアーキテクチャ | ORM | prisma client |
| | Service単位 | ユースケース |
| テスト | unitテスト | vitest + testing library |
| | e2eテスト | playwrhit |
| | スナップショットテスト | vrt |
| ソース | SCM | Github |
| | 構成 | モノレポ |
| CICD | アプリケーションデプロイ | Github Actions |
| | インフラデプロイ | AWS CDK |
| インフラアーキテクチャ | ホスティング | ECS + fargate + nginx |
| | ルーティング | route53 + ALB |
| | セキュリティ | AWS WAF + GuardDuty |
| | ストレージ | S3 |
| | キュー | SQS |
| | メール | SES |
| | push | SNS |
| | バッチ | ECS Task |
| | DB | Aurora PostgreSQL |
| | ベクターデータ | Aurora PostgreSQL + pgvector |
| | ロギング | croudwatch |
| | 監視| newrelic |
| 認証・認可 | 認証 | ID/PASS |
| | 認可 | OAuth |
| | 二要素 | パスキー |
| データ保全 | バックアップ | AWS Backup |
| 秘匿情報 | 環境変数 | AWS Secrets Manager |
| | 動的環境変数管理 | S3+json |
| ライブラリ | PDF変換 | PDFKit |
| | Excel入力 | ExcelJS |
| | Excelフォーム | React + SheetJS or IgniteUI(商用) |
| 印刷 | ユーザーローカルネットワークプリンタ接続 | windows EXE構築 |
| | ユーザーローカルネットワークプリンタ取得 | windows EXE構築 |
| | ユーザーローカルネットワークプリンタ操作 | windows EXE構築 |
| 成果物管理 | 媒体 | Git |
| | 公開 | nextra + s3 |
