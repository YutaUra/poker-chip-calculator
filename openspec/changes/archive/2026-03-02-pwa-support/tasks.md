## 1. 依存関係の追加

- [x] 1.1 `vite-plugin-pwa` を devDependency としてインストールする

## 2. PWA アイコンの準備

- [x] 2.1 192×192 と 512×512 のポーカーチップモチーフの PNG アイコンを作成し、`public/pwa-192x192.png` と `public/pwa-512x512.png` に配置する

## 3. Vite 設定の更新

- [x] 3.1 `vite.config.ts` に VitePWA プラグインを追加し、`registerType: 'autoUpdate'`、マニフェスト設定（name, short_name, theme_color, background_color, display, icons）を構成する

## 4. HTML メタタグの追加

- [x] 4.1 `index.html` に `<meta name="theme-color" content="#09090b">` と `<link rel="apple-touch-icon" href="/pwa-192x192.png">` を追加する

## 5. 動作確認

- [x] 5.1 `pnpm build` を実行し、`dist/` に Service Worker ファイル（`sw.js`）と `manifest.webmanifest` が出力されることを確認する
- [x] 5.2 ビルド後のアプリをローカルで起動し、DevTools の Application タブで Service Worker の登録とキャッシュの動作を確認する
