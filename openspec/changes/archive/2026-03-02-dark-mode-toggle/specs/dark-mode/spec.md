## ADDED Requirements

### Requirement: 3つのテーマモードをサポートする

アプリケーション SHALL light, dark, system の3つのテーマモードをサポートする。system モードでは OS の `prefers-color-scheme` 設定に従う。

#### Scenario: light モードの適用

- **WHEN** テーマが light に設定されている場合
- **THEN** `<html>` 要素に `dark` クラスが付与されない
- **THEN** ライトモードの配色で表示される

#### Scenario: dark モードの適用

- **WHEN** テーマが dark に設定されている場合
- **THEN** `<html>` 要素に `dark` クラスが付与される
- **THEN** ダークモードの配色で表示される

#### Scenario: system モードで OS がダーク設定の場合

- **WHEN** テーマが system に設定されており、OS がダークモードの場合
- **THEN** `<html>` 要素に `dark` クラスが付与される

#### Scenario: system モードで OS がライト設定の場合

- **WHEN** テーマが system に設定されており、OS がライトモードの場合
- **THEN** `<html>` 要素に `dark` クラスが付与されない

#### Scenario: system モードで OS 設定がリアルタイムに変更された場合

- **WHEN** テーマが system に設定されている状態で、ユーザーが OS のダークモード設定を変更した場合
- **THEN** アプリの表示がリアルタイムで追従する

### Requirement: テーマ設定を localStorage に永続化する

アプリケーション SHALL テーマ設定を localStorage の `theme` キーに保存する。初期値（localStorage に値がない場合）は `"system"` とする。

#### Scenario: テーマ設定の保存

- **WHEN** ユーザーがテーマを切り替えた場合
- **THEN** 選択したテーマが localStorage の `theme` キーに保存される

#### Scenario: ページリロード後のテーマ復元

- **WHEN** ページをリロードした場合
- **THEN** localStorage からテーマ設定が復元され、適切なモードで表示される

#### Scenario: localStorage に値がない初回アクセス

- **WHEN** localStorage に `theme` キーがない状態でアクセスした場合
- **THEN** system モードとして動作する

### Requirement: ページ読み込み時のちらつきを防止する

アプリケーション SHALL レンダリング前にテーマクラスを適用し、ライトモードからダークモードへのちらつき（FOUC）を防止する。

#### Scenario: ダークモードでの初期読み込み

- **WHEN** localStorage のテーマが dark（または system かつ OS がダーク）の状態でページを読み込んだ場合
- **THEN** 最初のフレームからダークモードの配色で表示される（白い画面が一瞬表示されない）

### Requirement: テーマトグルボタンを提供する

アプリケーション SHALL ヘッダーにテーマ切り替え用のアイコンボタンを表示する。クリックで light → dark → system の順に切り替える。

#### Scenario: トグルボタンのアイコン表示

- **WHEN** テーマが light の場合
- **THEN** Sun アイコンが表示される

- **WHEN** テーマが dark の場合
- **THEN** Moon アイコンが表示される

- **WHEN** テーマが system の場合
- **THEN** Monitor アイコンが表示される

#### Scenario: トグルボタンのクリック

- **WHEN** トグルボタンをクリックした場合
- **THEN** テーマが light → dark → system → light の順で切り替わる

#### Scenario: トグルボタンのアクセシビリティ

- **WHEN** トグルボタンが表示されている場合
- **THEN** `aria-label` に現在のテーマモード（例: "テーマ: ダークモード"）が設定される
