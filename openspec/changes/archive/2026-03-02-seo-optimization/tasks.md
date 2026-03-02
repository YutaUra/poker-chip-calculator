## 1. OGP 画像の作成

- [x] 1.1 1200×630 の OGP 画像（ポーカーチップモチーフ + アプリ名）を作成し、`public/og-image.png` に配置する

## 2. index.html の meta タグ更新

- [x] 2.1 `<title>` を "Poker Chip Calculator - ポーカーチップスタック計算機" に更新する
- [x] 2.2 `<meta name="description">` を日本語・英語併記の説明文に更新する
- [x] 2.3 OGP タグ（og:type, og:title, og:description, og:image, og:url）を追加する
- [x] 2.4 Twitter Card タグ（twitter:card, twitter:title, twitter:description, twitter:image）を追加する

## 3. 構造化データの追加

- [x] 3.1 `index.html` に JSON-LD 形式の `WebApplication` 構造化データを `<script type="application/ld+json">` として追加する

## 4. 動作確認

- [x] 4.1 ビルド後の HTML に全 meta タグと構造化データが含まれることを確認する
- [x] 4.2 OGP デバッガー等のツールで OGP プレビューが正しく表示されることを確認する
