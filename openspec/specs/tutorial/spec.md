# Tutorial Specification

## Purpose

初回アクセス時のチュートリアル表示、ステップ進行、スキップ、キーボード操作、バージョン管理の仕様を定義する。

## Requirements

### Requirement: 初回アクセスまたはバージョン更新時にチュートリアルを自動表示する

アプリケーション SHALL チュートリアルバージョンに基づいて表示を判定する。コード側に `TUTORIAL_VERSION` 定数を持ち、localStorage の `tutorial-version` と比較する。

#### Scenario: 初回アクセス

- **WHEN** ページを初めて開いた場合（`tutorial-version` が localStorage に存在しない）
- **THEN** チュートリアルオーバーレイが自動的に表示される

#### Scenario: チュートリアルバージョンが更新された場合

- **WHEN** ページを開き、localStorage の `tutorial-version` がコード側の `TUTORIAL_VERSION` より小さい場合
- **THEN** チュートリアルオーバーレイが自動的に表示される

#### Scenario: 最新バージョンのチュートリアル完了済み

- **WHEN** ページを開き、localStorage の `tutorial-version` がコード側の `TUTORIAL_VERSION` と等しい場合
- **THEN** チュートリアルは自動表示されない

### Requirement: ステップバイステップのチュートリアルを提供する

チュートリアル SHALL 以下のステップを順番に表示する:

1. **ウェルカム**: アプリの概要説明
2. **ブラインド設定**: Big Blind 入力エリアのハイライトと説明
3. **チップ操作**: チップ枚数の ScrollableCounter 操作方法の説明
4. **チップ追加**: "add chip" ボタンのハイライトと説明
5. **スタック記録**: 記録ボタンのハイライトと説明

各ステップ SHALL 対象要素をハイライト（半透明オーバーレイの中で対象要素のみ強調）し、説明テキストをポップオーバーで表示する。

#### Scenario: ステップの進行

- **WHEN** 「次へ」ボタンをクリックした場合
- **THEN** 次のステップに遷移し、対象要素がハイライトされる
- **THEN** 対象要素が画面内にない場合は `scrollIntoView` でスクロールされる

#### Scenario: 最終ステップの完了

- **WHEN** 最終ステップで「完了」ボタンをクリックした場合
- **THEN** チュートリアルが閉じる
- **THEN** localStorage の `tutorial-version` に現在の `TUTORIAL_VERSION` が保存される

#### Scenario: 「前へ」ボタンによるステップ戻り

- **WHEN** 2番目以降のステップで「前へ」ボタンをクリックした場合
- **THEN** 前のステップに戻る

#### Scenario: 最初のステップでの「前へ」ボタン

- **WHEN** 最初のステップを表示中の場合
- **THEN** 「前へ」ボタンは表示されない

### Requirement: チュートリアルをスキップ可能にする

チュートリアル SHALL いつでもスキップできる手段を提供する。

#### Scenario: スキップボタンのクリック

- **WHEN** チュートリアル中に「スキップ」ボタンをクリックした場合
- **THEN** チュートリアルが即座に閉じる
- **THEN** localStorage の `tutorial-version` に現在の `TUTORIAL_VERSION` が保存される

#### Scenario: 閉じるボタンのクリック

- **WHEN** チュートリアルポップオーバーの「×」ボタンをクリックした場合
- **THEN** チュートリアルが即座に閉じる
- **THEN** localStorage の `tutorial-version` に現在の `TUTORIAL_VERSION` が保存される

#### Scenario: Escape キー

- **WHEN** チュートリアル中に Escape キーを押した場合
- **THEN** チュートリアルが閉じる
- **THEN** localStorage の `tutorial-version` に現在の `TUTORIAL_VERSION` が保存される

#### Scenario: オーバーレイ外クリック

- **WHEN** チュートリアル中にオーバーレイの暗い部分をクリックした場合
- **THEN** チュートリアルは閉じない（誤タップ防止）

### Requirement: チュートリアル対象要素をハイライトする

チュートリアル SHALL 現在のステップに対応する要素をハイライト表示する。

#### Scenario: ハイライト表示

- **WHEN** ステップが対象要素を持つ場合
- **THEN** 画面全体にセミトランスペアレントなオーバーレイが表示される
- **THEN** 対象要素のみがオーバーレイの上に浮き上がって表示される

#### Scenario: ウェルカムステップ（対象要素なし）

- **WHEN** ウェルカムステップを表示中の場合
- **THEN** オーバーレイ中央にウェルカムメッセージが表示される
- **THEN** 特定の要素はハイライトされない

### Requirement: チュートリアル完了バージョンを localStorage に永続化する

アプリケーション SHALL チュートリアルの完了バージョンを localStorage に保存する。

#### Scenario: 完了バージョンの保存

- **WHEN** チュートリアルが完了またはスキップされた場合
- **THEN** localStorage の `tutorial-version` キーに現在の `TUTORIAL_VERSION` の値が保存される

#### Scenario: ヘルプボタンからの再表示

- **WHEN** ヘルプボタンからチュートリアルを再表示する場合
- **THEN** localStorage の `tutorial-version` の値に関わらずチュートリアルが表示される
- **THEN** チュートリアル完了後に現在の `TUTORIAL_VERSION` が保存される

#### Scenario: バージョン番号の管理

- **WHEN** チュートリアルのステップ内容を更新する場合
- **THEN** コード側の `TUTORIAL_VERSION` 定数をインクリメントする
- **THEN** 既存ユーザーが次回アクセス時にチュートリアルが再表示される

### Requirement: キーボードでチュートリアルを操作できる

チュートリアル SHALL キーボード操作をサポートする。

#### Scenario: キーボードナビゲーション

- **WHEN** チュートリアル表示中に右矢印キーまたは Enter キーを押した場合
- **THEN** 次のステップに進む

- **WHEN** チュートリアル表示中に左矢印キーを押した場合
- **THEN** 前のステップに戻る（最初のステップの場合は何もしない）

- **WHEN** チュートリアル表示中に Escape キーを押した場合
- **THEN** チュートリアルがスキップされる
