# 画面レイアウトの変更（左nav / 右メイン）

## 目的

画面を左側のnavmenuと右側のメイン表示エリアの2カラムに分割する。

## レイアウト構造

```
<body class="flex">
  <aside class="w-64 shrink-0 border-r ...">  <!-- 左: navmenu -->
    <nav></nav>
  </aside>
  <main class="flex-1 flex flex-col">          <!-- 右: メイン表示エリア -->
    {children}
  </main>
</body>
```

## 変更内容

- `app/nav-menu.tsx`: 新規作成。左側に固定幅（`w-64`）で表示する`NavMenu`コンポーネント。中身は空の`<nav>`で、今後メニュー項目を追加していく想定
- `app/layout.tsx`: `<body>`を横並びのflexコンテナに変更し、`<NavMenu />`（左）と`<main className="flex-1 flex flex-col">{children}</main>`（右）を配置

## 動作確認

- `npm run build` が正常に完了することを確認済み
- `npm run dev` 起動後、`curl http://localhost:3000` で取得したHTMLに`<aside>`（nav）と`<main>`が意図した構造で出力されていることを確認済み
- Playwright（[[../../setup/playwright-setup]]参照）でスクリーンショットを撮影し、左に境界線付きのnavmenu領域、右に広いメイン表示エリアが視覚的にも意図通り表示されていることを確認済み
