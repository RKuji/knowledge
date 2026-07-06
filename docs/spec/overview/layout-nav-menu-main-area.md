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

詳細設計は[[../detail/layout-nav-menu-main-area]]を参照。
