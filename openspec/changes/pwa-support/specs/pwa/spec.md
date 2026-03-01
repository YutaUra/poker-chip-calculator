## ADDED Requirements

### Requirement: Service Worker でビルド成果物をプリキャッシュする

アプリケーション SHALL vite-plugin-pwa を使用して Service Worker を生成し、ビルド成果物（HTML, CSS, JS）をプリキャッシュする。

#### Scenario: 初回アクセス時のキャッシュ

- **WHEN** ユーザーが初めてアプリにアクセスした場合
- **THEN** Service Worker が登録され、ビルド成果物がキャッシュに保存される

#### Scenario: オフラインでのアプリ起動

- **WHEN** ネットワーク接続がない状態でアプリにアクセスした場合
- **THEN** キャッシュからアプリが提供され、正常に起動・操作できる

#### Scenario: オフライン時のチップ操作

- **WHEN** オフライン状態でチップの追加・削除・枚数変更を行った場合
- **THEN** すべての操作が正常に動作する（外部 API 通信がないため）

### Requirement: Service Worker を自動更新する

アプリケーション SHALL `autoUpdate` モードで Service Worker を登録し、新バージョンのデプロイ時に自動で更新する。

#### Scenario: 新バージョンのデプロイ後

- **WHEN** 新バージョンがデプロイされ、ユーザーがページを再読み込みした場合
- **THEN** 新しい Service Worker がインストールされ、次回アクセスから新バージョンが適用される

### Requirement: Web App Manifest を提供する

アプリケーション SHALL 以下の情報を含む Web App Manifest を提供する:
- アプリ名: "Poker Chip Calculator"
- 短縮名: "Chip Calc"
- 表示モード: standalone
- テーマカラー: `#09090b`
- 背景色: `#09090b`
- アイコン: 192×192 と 512×512 の2サイズ

#### Scenario: ホーム画面への追加

- **WHEN** ユーザーがブラウザの「ホーム画面に追加」機能を使用した場合
- **THEN** "Chip Calc" の名前とアプリアイコンでホーム画面にショートカットが作成される

#### Scenario: standalone モードでの起動

- **WHEN** ホーム画面から起動した場合
- **THEN** ブラウザの UI（アドレスバー等）が非表示の状態でアプリが表示される

### Requirement: PWA アイコンを提供する

アプリケーション SHALL 192×192 と 512×512 の2サイズの PNG アイコンを `public/` ディレクトリに配置する。

#### Scenario: アイコンの読み込み

- **WHEN** マニフェストが読み込まれた場合
- **THEN** 指定されたパスからアイコン画像が取得できる
