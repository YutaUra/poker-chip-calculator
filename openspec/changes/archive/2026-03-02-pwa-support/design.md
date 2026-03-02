## Context

現在のアプリは純粋な SPA として Cloudflare Pages にデプロイされている。Service Worker やマニフェストは未導入のため、オフラインでは一切動作せず、ホーム画面への追加もサポートされていない。

ポーカーはカジノ、地下室、郊外の友人宅など電波が不安定な環境でプレイされることが多く、オフライン対応のニーズが高い。このアプリはサーバーサイド API を持たない完全クライアントサイドの SPA であるため、ビルド成果物をプリキャッシュするだけでオフライン対応が可能である。

## Goals / Non-Goals

**Goals:**
- ビルド成果物をプリキャッシュし、オフラインでもアプリが起動・操作できる
- Web App Manifest を提供し、ホーム画面への追加（A2HS）をサポートする
- 既存のビルド・デプロイフローへの変更を最小限にする

**Non-Goals:**
- Push 通知の実装
- バックグラウンド同期
- アプリ内のインストールプロンプト UI（ブラウザネイティブのバナーに委ねる）
- アプリストア（TWA/PWABuilder）への配布

## Decisions

### 1. vite-plugin-pwa の採用

Workbox を直接設定するのではなく、vite-plugin-pwa を使用する。Vite のビルドパイプラインと統合されており、Service Worker の生成・プリキャッシュマニフェストの作成・manifest.json の出力を一括で行える。

**代替案**: Workbox CLI を直接使う → Vite のビルド後に追加ステップが必要になり、ビルドフローが複雑化する。vite-plugin-pwa は内部で Workbox を使っているため機能面で劣るわけではない。

### 2. Service Worker 戦略: generateSW + precache のみ

`generateSW` モードで Service Worker を自動生成し、ビルド成果物を全量プリキャッシュする。ランタイムキャッシュ戦略は設定しない。

理由: このアプリは外部 API を呼ばない完全な静的 SPA であるため、プリキャッシュだけで十分。ランタイムキャッシュが必要なケースがない。

**代替案**: `injectManifest` モードでカスタム Service Worker を書く → 外部リソースへのフェッチがないため不要な複雑性。将来 API 通信が追加された場合にアップグレードすればよい。

### 3. Service Worker 登録方式: autoUpdate

`registerType: 'autoUpdate'` を使用し、新しいバージョンのデプロイ時に自動でService Workerを更新する。ユーザーへの更新通知 UI は実装しない。

理由: このアプリはセッション中のデータ整合性が問われるようなリアルタイム通信を行わない。自動更新で問題が起きるケースが想定しにくい。

**代替案**: `prompt` モードで更新確認ダイアログを出す → 実装コストが増えるが、ユーザー体験に大きなメリットがない。

### 4. マニフェスト設定

```json
{
  "name": "Poker Chip Calculator",
  "short_name": "Chip Calc",
  "description": "ポーカーチップスタック計算機",
  "theme_color": "#09090b",
  "background_color": "#09090b",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    { "src": "pwa-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "pwa-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

テーマカラーは既存の背景色 `#09090b`（zinc-950）に合わせる。`display: standalone` でブラウザの UI を隠し、ネイティブアプリに近い体験を提供する。

### 5. アイコン

192×192 と 512×512 の2サイズを用意する。シンプルなポーカーチップのモチーフを使用する。画像ファイルは `public/` ディレクトリに配置する。

## Risks / Trade-offs

- **[キャッシュの陳腐化]** → `autoUpdate` モードにより、ページ再読み込み時に最新のService Workerが取得され、次回アクセスから新バージョンが適用される。クリティカルな問題ではない。
- **[Cloudflare Pages のキャッシュヘッダーとの競合]** → Cloudflare Pages はデフォルトで適切なキャッシュヘッダーを設定する。Service Worker のプリキャッシュは `Cache API` を使うため、HTTP キャッシュとは独立して動作し、競合しない。
- **[ビルドサイズの増加]** → Service Worker ファイルと manifest.json の追加は数KB程度。プリキャッシュリスト自体もビルド成果物の総量に依存するが、SPA としては小規模であり問題にならない。
