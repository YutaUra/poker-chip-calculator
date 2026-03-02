## MODIFIED Requirements

### Requirement: チップ行の管理機能を提供する

Chips セクション SHALL チップの追加・削除・編集・枚数一括リセット機能を提供する。

#### Scenario: チップの追加

- **WHEN** "add chip" ボタンをクリックした場合
- **THEN** 新しいチップ行 `{amount:1, unit:"1", count:0, color:"#6b7280"}` が追加される

#### Scenario: チップの削除

- **WHEN** 削除ボタンをクリックした場合
- **THEN** 対象のチップ行が削除される

- **WHEN** チップが1行のみの場合
- **THEN** 削除ボタンは disabled になる

#### Scenario: チップアイコンのクリック

- **WHEN** チップアイコンをクリックした場合
- **THEN** 編集ダイアログが開き、金額・単位・色を変更できる

#### Scenario: チップ枚数の一括リセット

- **WHEN** Chips セクションヘッダーの「Reset」ボタンをクリックした場合
- **THEN** すべてのチップ行の `count` が 0 にリセットされる
- **THEN** チップの `amount`、`unit`、`color`、並び順は変更されない

#### Scenario: リセット後の状態

- **WHEN** リセットを実行した後
- **THEN** Total Stack の合計額が 0 になる
- **THEN** BB 換算が 0 BB になる
- **THEN** 各チップ行の枚数を手動で再設定できる

#### Scenario: リセットボタンの表示

- **WHEN** Chips セクションを表示する場合
- **THEN** ヘッダー行に ghost variant の「Reset」ボタンが表示される
