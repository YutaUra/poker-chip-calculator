## MODIFIED Requirements

### Requirement: 単一ページのレイアウトを表示する

アプリケーション SHALL ヘッダー、Current Blind、Chips、Stack Graph、Total Stack の5セクションで構成される単一ページを表示する。

#### Scenario: 初期表示

- **WHEN** ページを開いた場合
- **THEN** タイトル "Poker Chip Calculator" とサマリー `Current amount: {短縮表記} ({BB値} BB)` がヘッダーに表示される
- **THEN** Current Blind セクションに数値入力と単位セレクトが表示される
- **THEN** Chips セクションにチップリストと追加ボタンが表示される
- **THEN** Stack Graph セクションに「グラフに記録」ボタンとグラフエリアが表示される
- **THEN** Total Stack セクションに合計額とBB換算が表示される

## ADDED Requirements

### Requirement: グラフに記録ボタンを提供する

システム SHALL チップセクションの近くに「グラフに記録」ボタンを配置する。ボタンはスクロールなしで到達できる位置に配置する。

#### Scenario: 記録ボタンのタップ

- **WHEN** 「グラフに記録」ボタンをタップする
- **THEN** 現在のスタック情報がスナップショットとして記録される
- **THEN** トースト通知で「記録しました (#N)」と表示される

### Requirement: スタック推移グラフセクションを表示する

システム SHALL Chips セクションの下にスタック推移グラフセクションを表示する。

#### Scenario: グラフの表示

- **WHEN** 記録が存在する
- **THEN** 折れ線グラフが表示される
- **THEN** BB/チップ額の切り替えトグルが表示される

#### Scenario: 記録が0件の場合

- **WHEN** 記録が0件の場合
- **THEN** プレースホルダーテキストが表示される

### Requirement: セッション管理UIを提供する

システム SHALL 「新しいセッションを開始」ボタンを提供する。

#### Scenario: 新しいセッション開始

- **WHEN** 記録が存在する状態で「新しいセッションを開始」をタップする
- **THEN** 確認ダイアログが表示される
- **WHEN** 確認ダイアログで承認する
- **THEN** 記録がクリアされ、グラフがリセットされる
