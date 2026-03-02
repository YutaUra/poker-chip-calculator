## ADDED Requirements

### Requirement: SEO に最適化された title と meta description を設定する

アプリケーション SHALL 日本語と英語を併記した title と、アプリの用途を的確に説明する meta description を設定する。

#### Scenario: title の表示

- **WHEN** 検索エンジンやブラウザのタブに title が表示される場合
- **THEN** "Poker Chip Calculator - ポーカーチップスタック計算機" が表示される

#### Scenario: meta description の内容

- **WHEN** 検索エンジンがページの description をクロールした場合
- **THEN** ポーカーチップ、スタック、BB換算に関するキーワードを含む説明文が取得される

### Requirement: OGP タグを設定する

アプリケーション SHALL Open Graph Protocol のメタタグ（og:type, og:title, og:description, og:image, og:url）を設定する。

#### Scenario: SNS シェア時のプレビュー

- **WHEN** アプリの URL が SNS（Twitter, Facebook, LINE 等）でシェアされた場合
- **THEN** タイトル、説明文、OGP 画像がプレビューカードに表示される

#### Scenario: og:image の解像度

- **WHEN** OGP 画像が読み込まれた場合
- **THEN** 1200×630 の PNG 画像が配信される

### Requirement: Twitter Card タグを設定する

アプリケーション SHALL Twitter Card のメタタグ（twitter:card, twitter:title, twitter:description, twitter:image）を設定する。

#### Scenario: Twitter/X でのシェア

- **WHEN** アプリの URL が Twitter/X でシェアされた場合
- **THEN** summary_large_image 形式のカードが表示される

### Requirement: 構造化データを JSON-LD 形式で提供する

アプリケーション SHALL `WebApplication` スキーマの JSON-LD 構造化データを `index.html` に埋め込む。

#### Scenario: 検索エンジンによる構造化データの認識

- **WHEN** 検索エンジンがページをクロールした場合
- **THEN** `@type: WebApplication`、アプリ名、説明文、カテゴリ（UtilityApplication）、価格（無料）の情報が構造化データとして取得される

### Requirement: OGP 画像を提供する

アプリケーション SHALL 1200×630 の OGP 画像を `public/og-image.png` に配置する。

#### Scenario: OGP 画像のアクセス

- **WHEN** OGP クローラーが画像 URL にアクセスした場合
- **THEN** `/og-image.png` パスから画像が配信される
