## MODIFIED Requirements

### Requirement: 単一ページのレイアウトを表示する

アプリケーション SHALL ヘッダー、Current Blind、Chips、Stack Graph、Total Stack の5セクションで構成される単一ページを表示する。

#### Scenario: 初期表示

- **WHEN** ページを開いた場合
- **THEN** タイトル "Poker Chip Calculator" とサマリー `Current amount: {短縮表記} ({BB値} BB)` がヘッダーに表示される
- **THEN** ヘッダーにヘルプボタン（`?` アイコン）が表示される
- **THEN** Current Blind セクションに数値入力と単位セレクトが表示される
- **THEN** Chips セクションにチップリストと追加ボタンが表示される
- **THEN** Stack Graph セクションに「グラフに記録」ボタンとグラフエリアが表示される
- **THEN** Total Stack セクションに合計額とBB換算が表示される

## ADDED Requirements

### Requirement: ヘルプボタンでチュートリアルを再表示できる

ヘッダー SHALL ヘルプボタン（`?` アイコン）を表示し、クリックでチュートリアルを再表示する。

#### Scenario: ヘルプボタンのクリック

- **WHEN** ヘッダーのヘルプボタンをクリックした場合
- **THEN** チュートリアルが最初のステップから表示される

#### Scenario: ヘルプボタンの表示位置

- **WHEN** ページを表示した場合
- **THEN** ヘルプボタンはヘッダーのタイトル右側に表示される
- **THEN** ヘルプボタンは `aria-label="チュートリアルを表示"` を持つ

### Requirement: チュートリアル対象要素に data 属性を付与する

チュートリアルのハイライト対象となる要素 SHALL `data-tutorial` 属性を持つ。

#### Scenario: data 属性の存在

- **WHEN** ページを表示した場合
- **THEN** Big Blind 入力エリアに `data-tutorial="blind-input"` が付与される
- **THEN** チップリストの最初の ScrollableCounter に `data-tutorial="chip-counter"` が付与される
- **THEN** "add chip" ボタンに `data-tutorial="add-chip"` が付与される
- **THEN** 記録ボタンに `data-tutorial="record-button"` が付与される
