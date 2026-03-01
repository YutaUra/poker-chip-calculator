## Why

「ポーカー チップ 計算」「poker chip calculator」等のキーワードでの検索発見性を高めたい。また、SNS でアプリの URL をシェアした際に、OGP 画像とタイトル・説明文が表示されることで、クリック率とユーザー獲得が向上する。現在の `index.html` には最低限の meta description のみで、OGP タグや構造化データが未実装。

## What Changes

- **title / meta description の最適化**: 日本語と英語の両方のキーワードを含むタイトルと説明文に更新する
- **OGP タグ追加**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` および Twitter Card タグを追加する
- **OGP 画像の作成**: SNS シェア時に表示される 1200×630 の OGP 画像を用意する
- **構造化データ追加**: JSON-LD 形式の `WebApplication` スキーマを追加し、検索エンジンにアプリの種類と用途を伝える
- **lang 属性と hreflang**: `<html lang="ja">` を維持し、主要ターゲットが日本語ユーザーであることを明示する

## Capabilities

### New Capabilities
- `seo`: meta タグ、OGP タグ、構造化データの定義に関する機能を包括する

### Modified Capabilities

なし

## Impact

- **変更ファイル**: `index.html`（meta タグ、OGP タグ、構造化データの追加）
- **新規ファイル**: `public/og-image.png`（OGP 画像 1200×630）
- **依存関係**: 追加なし
- **デプロイ**: Cloudflare Pages で静的ファイルとして配信されるため追加設定不要

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 3 | 5 | 15 |
| PM-2 | 5 | 5 | 25 |
| TL-1 | 3 | 5 | 15 |
| TL-2 | 3 | 5 | 15 |
| **平均** | **3.5** | **5.0** | **17.5** |

**ティア: S** — index.html 編集のみで依存追加ゼロ。唯一のオーガニック獲得チャネルを開通。

## Cross-Feature Dependencies

- **pwa-support**: 両機能とも `index.html` の `<head>` を変更する。PWA の `<link rel="manifest">`, `<meta name="theme-color">` と SEO の OGP タグが同時に追加される。並列実装するとマージコンフリクトが発生するため、同一ブランチで順番に実装するか統合を検討
- **dark-mode-toggle**: `index.html` にちらつき防止の inline script も追加される。index.html 変更が3機能で重複するため、Phase 1 で一括適用が効率的
