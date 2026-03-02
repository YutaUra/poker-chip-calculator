## Context

現在の `index.html` には `<title>Poker Chip Calculator</title>` と英語の meta description が設定されているが、OGP タグや構造化データは未実装。アプリは日本語 UI で、主要ターゲットは日本語ユーザーだが、英語圏のポーカープレイヤーにも使われる可能性がある。

Cloudflare Pages の静的ホスティングであるため、サーバーサイドでの動的 meta タグ生成は不要。すべて `index.html` に静的に記述する。

## Goals / Non-Goals

**Goals:**
- 「ポーカー チップ 計算」「poker chip calculator」等のキーワードで検索にヒットしやすくする
- SNS シェア時に見栄えの良い OGP プレビューを表示する
- 検索エンジンにアプリの種類と用途を構造化データで伝える

**Non-Goals:**
- サーバーサイドレンダリング（SSR）や動的 OGP 生成
- sitemap.xml / robots.txt の生成（SPA で1ページのため不要）
- 多言語対応（i18n）
- Google Search Console の設定

## Decisions

### 1. meta タグの内容

```html
<title>Poker Chip Calculator - ポーカーチップスタック計算機</title>
<meta name="description" content="ポーカーチップの枚数からスタック合計額とBB（ビッグブラインド）換算を即座に計算。キャッシュゲーム・トーナメント対応。Poker chip stack calculator with Big Blind conversion.">
```

日本語と英語を併記することで、両言語の検索クエリに対応する。title は50文字以内に収まるよう調整。description は120文字程度にまとめる。

### 2. OGP タグ

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Poker Chip Calculator">
<meta property="og:description" content="ポーカーチップスタック計算機 - チップ枚数からBB換算を即座に計算">
<meta property="og:image" content="https://poker-chip-calculator.pages.dev/og-image.png">
<meta property="og:url" content="https://poker-chip-calculator.pages.dev/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Poker Chip Calculator">
<meta name="twitter:description" content="ポーカーチップスタック計算機 - チップ枚数からBB換算を即座に計算">
<meta name="twitter:image" content="https://poker-chip-calculator.pages.dev/og-image.png">
```

`og:url` と `og:image` は Cloudflare Pages の本番 URL を設定する。

**代替案**: `og:url` を相対パスにする → OGP クローラーは絶対 URL を要求するため不可。

### 3. OGP 画像

1200×630 のPNG画像を作成する。背景はアプリのテーマカラー（ダーク系）で、ポーカーチップのイラストとアプリ名を配置する。`public/og-image.png` に配置する。

### 4. 構造化データ（JSON-LD）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Poker Chip Calculator",
  "description": "ポーカーチップスタック計算機 - チップ枚数からBB換算を即座に計算",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

`WebApplication` スキーマを使い、無料のユーティリティアプリであることを明示する。

**代替案**: `SoftwareApplication` → `WebApplication` はそのサブタイプでより適切。

## Risks / Trade-offs

- **[OGP画像の URL がハードコード]** → 本番 URL が変わった場合に修正が必要。ただし Cloudflare Pages の URL は安定しているため、当面問題にならない。
- **[SPA の SEO 限界]** → クライアントサイドレンダリングのため、検索エンジンのクローラーが JS を実行しない場合はコンテンツがインデックスされない。ただし Google のクローラーは JS を実行するため、主要な検索エンジンでは問題ない。
