## MODIFIED Requirements

### Requirement: チップ行の管理機能を提供する

Chips セクション SHALL チップの追加・削除・編集機能を提供する。チップ個数の入力はドラムロール型の ScrollableCounter コンポーネントを使用する。

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

#### Scenario: チップ個数の変更

- **WHEN** チップ行の ScrollableCounter をスクロール操作した場合
- **THEN** チップの個数が更新される
- **THEN** 小計 `= {小計の短縮表記}` がリアルタイムで更新される
- **THEN** Total Stack の合計額とBB換算が再計算される
