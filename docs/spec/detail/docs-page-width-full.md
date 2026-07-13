# Docsページの表示幅

## 仕様

- `app/docs/page.tsx`・`app/docs/[id]/page.tsx`・`app/docs/[id]/edit/page.tsx`・`app/docs/new/page.tsx`は、いずれもページ最上位のラッパー`<div className="flex flex-col gap-6 p-8 max-w-full">`に`max-w-full`を持つ。4ページとも同じ幅指定で統一されており、`<main>`（`app/layout.tsx`の`flex-1`領域）の幅いっぱいまで表示される。

## 動作確認

- `npm run build`が正常に完了することを確認済み。
- `npm run test:e2e`で[[../../../tests/docs-page-width-full.spec.ts]]が成功し、4ページのラッパーdivがいずれも`max-w-full`クラスを持ち、`max-w-2xl`を含まないことを確認済み。
