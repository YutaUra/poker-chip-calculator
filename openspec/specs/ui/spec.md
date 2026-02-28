# UI Specification

## Purpose

ポーカーチップスタック計算機の画面レイアウト、コンポーネント仕様、ユーザーインタラクションを定義する。

## Requirements

### Requirement: 単一ページのレイアウトを表示する

アプリケーション SHALL ヘッダー、Current Blind、Chips、Stack Graph、Total Stack の5セクションで構成される単一ページを表示する。

#### Scenario: 初期表示

- **WHEN** ページを開いた場合
- **THEN** タイトル "Poker Chip Calculator" とサマリー `Current amount: {短縮表記} ({BB値} BB)` がヘッダーに表示される
- **THEN** Current Blind セクションに数値入力と単位セレクトが表示される
- **THEN** Chips セクションにチップリストと追加ボタンが表示される
- **THEN** Stack Graph セクションに「グラフに記録」ボタンとグラフエリアが表示される
- **THEN** Total Stack セクションに合計額とBB換算が表示される

### Requirement: ブラインド入力を提供する

Big Blind (BB) セクション SHALL 数値入力 (spinbutton) と単位セレクト (1 / K / M / B / T) を持つ。レスポンシブデザインで、モバイルでは縦並び、デスクトップでは横並びで表示する。

#### Scenario: ブラインド値の変更

- **WHEN** ブラインドの数値を変更した場合
- **THEN** Total 表示が実効値の短縮表記で更新される
- **THEN** BB 換算が再計算される

### Requirement: チップ行の管理機能を提供する

Chips セクション SHALL チップの追加・削除・編集機能を提供する。

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

### Requirement: チップ編集ダイアログを提供する

ChipIcon コンポーネント SHALL クリック時に編集ダイアログを表示する。

#### Scenario: ダイアログ操作

- **WHEN** ダイアログで金額・色を変更し Save をクリックした場合
- **THEN** 変更が親コンポーネントに反映される

- **WHEN** Cancel をクリックした場合
- **THEN** 変更は破棄される

#### Scenario: カラーパレット

- **WHEN** ダイアログを開いた場合
- **THEN** 10色のパレット (Red, Blue, Green, Purple, Yellow, Pink, Orange, Gray, White, Black) が表示される
- **THEN** 各カラーボタンに `aria-label` と `aria-pressed` 属性が設定される

#### Scenario: テキストコントラスト

- **WHEN** チップの背景色が明るい場合 (Yellow, White)
- **THEN** チップのテキストは黒色で表示される

- **WHEN** チップの背景色が暗い場合 (Red, Blue, Black 等)
- **THEN** チップのテキストは白色で表示される

#### Scenario: チップアイコンの onSave

- **WHEN** ダイアログで Save をクリックした場合
- **THEN** `onSave({amount, unit, color})` が1回の呼び出しで実行される

### Requirement: Total Stack を表示する

Total Stack セクション SHALL 短縮表記、詳細表記（カンマ区切り）、BB 換算の3行を表示する。

#### Scenario: 合計額の表示

- **WHEN** チップの枚数や金額が変更された場合
- **THEN** `Total Stack: {短縮値}` が更新される
- **THEN** `({カンマ区切り値} chips)` が更新される
- **THEN** `({BB値} Big Blinds)` が更新される（BB値は整数なら小数なし、端数ありなら小数1桁）

#### Scenario: チップ行の小計

- **WHEN** チップの金額と枚数が設定されている場合
- **THEN** 各チップ行に `= {小計の短縮表記}` が表示される

### Requirement: スタック推移グラフセクションを表示する

Stack Graph セクション SHALL 「グラフに記録」ボタン、BB推移グラフ、チップ額推移グラフを表示する。

#### Scenario: 記録ボタンのタップ

- **WHEN** 「グラフに記録」ボタンをタップする
- **THEN** 現在のスタック情報がスナップショットとして記録される
- **THEN** トースト通知で「記録しました (#N)」と表示される

#### Scenario: グラフの表示

- **WHEN** 記録が存在する
- **THEN** BB推移の折れ線グラフとチップ額推移の折れ線グラフが縦に並んで表示される

#### Scenario: 記録が0件の場合

- **WHEN** 記録が0件の場合
- **THEN** プレースホルダーテキスト「記録ボタンを押してスタックを記録しましょう」が表示される

### Requirement: セッション管理UIを提供する

システム SHALL 「取消」ボタンと「リセット」ボタンを提供する。記録が0件の場合はこれらのボタンは非表示とする。

#### Scenario: 直前の記録を削除

- **WHEN** 「取消」ボタンをタップする
- **THEN** 最新のスナップショットが削除される

#### Scenario: 新しいセッション開始

- **WHEN** 「リセット」ボタンをタップする
- **THEN** 確認ダイアログが表示される
- **WHEN** 確認ダイアログで「リセットする」をタップする
- **THEN** 記録がクリアされ、グラフがリセットされる

### Requirement: 記録データを localStorage に永続化する

アプリケーション SHALL 記録データを localStorage に保存し、タブを閉じてもデータが保持されるようにする。

#### Scenario: データの永続化

- **WHEN** スナップショットを記録する
- **THEN** localStorage にデータが即座に保存される

#### Scenario: ページリロード後のデータ復元

- **WHEN** ページをリロードする
- **THEN** localStorage から記録データが復元され、グラフに表示される

### Requirement: 状態を sessionStorage で永続化する

アプリケーション SHALL ブラインド値とチップリストを sessionStorage に保存する。

#### Scenario: ページリロード

- **WHEN** ページをリロードした場合
- **THEN** ブラインド値とチップリストが復元される

#### Scenario: タブを閉じる

- **WHEN** タブを閉じた場合
- **THEN** 保存されたデータは破棄される
