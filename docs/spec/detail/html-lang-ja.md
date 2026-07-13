# html lang属性

## 仕様

- `app/layout.tsx`のルートレイアウトの`<html>`要素は`lang="ja"`を持つ。アプリケーションの画面文言・ドキュメントが日本語であるため、支援技術（スクリーンリーダー等）やブラウザの言語判定が正しく行われるようにする。

## 動作確認

- `npm run build`が正常に完了することを確認済み。
- `npm run test:e2e`で[[../../../tests/html-lang-ja.spec.ts]]が成功し、`/docs`ページの`<html>`要素の`lang`属性が`ja`であることを確認済み。
