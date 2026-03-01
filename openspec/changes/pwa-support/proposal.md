## Why

ポーカーはカジノや地下室など電波の不安定な環境でプレイされることが多い。現状のアプリはオンライン接続がないと利用できず、毎回ブラウザでURLを入力する必要がある。PWA化によりオフライン動作とホーム画面へのインストールを可能にし、電波状況に依存しない安定した利用体験とリテンション向上を実現する。

## What Changes

- **vite-plugin-pwa 導入**: Vite のビルドパイプラインに PWA プラグインを追加し、Service Worker と manifest.json を自動生成する
- **Web App Manifest**: アプリ名、アイコン、テーマカラー、表示モード（standalone）を定義し、ホーム画面への追加を可能にする
- **Service Worker（precache）**: ビルド成果物（HTML, CSS, JS, フォント）をプリキャッシュし、オフラインでもアプリを起動・操作できるようにする
- **オフラインフォールバック**: ネットワーク不通時にもキャッシュからアプリを提供する
- **PWA アイコン生成**: 192×192 と 512×512 のアイコン画像を用意する

## Capabilities

### New Capabilities
- `pwa`: Service Worker によるプリキャッシュ、Web App Manifest の定義、オフライン動作、ホーム画面インストールに関する機能を包括する

### Modified Capabilities
- `architecture`: 技術スタックに vite-plugin-pwa と Service Worker を追加する

## Impact

- **新規ファイル**: `public/manifest.json`（vite-plugin-pwa が自動生成する場合は不要）、`public/pwa-192x192.png`、`public/pwa-512x512.png`
- **変更ファイル**: `vite.config.ts`（VitePWA プラグイン追加）、`index.html`（meta theme-color, apple-touch-icon 追加）
- **新規依存**: `vite-plugin-pwa`（devDependency）
- **デプロイ**: Cloudflare Pages は静的ファイルホスティングのため、Service Worker ファイルの配信に追加設定は不要

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 4 | 3 | 12 |
| PM-2 | 4 | 4 | 16 |
| TL-1 | 4 | 3 | 12 |
| TL-2 | 4 | 4 | 16 |
| **平均** | **4.0** | **3.5** | **14.0** |

**ティア: A** — Impact 全員 4 で一致。カジノ環境のオフライン対応＋ホーム画面追加でリテンション向上。

## Cross-Feature Dependencies

- **seo-optimization**: 両機能とも `index.html` の `<head>` を変更する。マージコンフリクト回避のため同一ブランチで順番に実装推奨
- **チュートリアル**: 「ホーム画面に追加」のステップをチュートリアルに追加する価値あり → `TUTORIAL_VERSION` インクリメント検討
- **dark-mode-toggle**: PWA の `theme-color` とダークモードの `theme-color` が競合する可能性。ダークモード時に `<meta name="theme-color">` を動的に更新する必要があるか検討
