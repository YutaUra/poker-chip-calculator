## ADDED Requirements

### Requirement: エクスポートボタンを表示する

Stack Graph セクション SHALL エクスポートドロップダウンボタンを提供する。ドロップダウンから CSV または JSON を選択できる。

#### Scenario: エクスポートボタンの表示

- **WHEN** Stack Graph セクションを表示した場合
- **THEN** 「Export」ドロップダウンボタンが表示される

#### Scenario: エクスポート形式の選択

- **WHEN** 「Export」ボタンをクリックした場合
- **THEN** 「CSV」と「JSON」の選択肢がドロップダウンで表示される

#### Scenario: 記録が0件の場合

- **WHEN** スナップショットが0件の場合
- **THEN** 「Export」ボタンは disabled となる

### Requirement: インポートボタンを表示する

Stack Graph セクション SHALL JSON インポートボタンを提供する。

#### Scenario: インポートボタンの表示

- **WHEN** Stack Graph セクションを表示した場合
- **THEN** 「Import」ボタンが表示される

#### Scenario: インポートフロー

- **WHEN** 「Import」ボタンをクリックした場合
- **THEN** ファイル選択ダイアログが開く（.json ファイルのみ）
- **WHEN** ファイルを選択した場合
- **THEN** バリデーション後に確認ダイアログが表示される
