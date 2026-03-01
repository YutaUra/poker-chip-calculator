## MODIFIED Requirements

### Requirement: チップ編集ダイアログを提供する

ChipIcon コンポーネント SHALL クリック時に編集ダイアログを表示する。チップボタンにはチップの額面と色名を含む説明的な aria-label を設定する。

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

#### Scenario: チップボタンの aria-label

- **WHEN** チップアイコンを表示した場合
- **THEN** ボタンの aria-label に額面の短縮表記と日本語の色名が含まれる

## ADDED Requirements

### Requirement: スキップリンクを表示する

アプリケーション SHALL ページ最上部に「メインコンテンツへスキップ」リンクを配置する。通常時は視覚的に非表示で、フォーカス時に表示される。

#### Scenario: スキップリンクの表示

- **WHEN** ページ読み込み後に Tab キーを最初に押した場合
- **THEN** 画面上部に「メインコンテンツへスキップ」リンクが表示される

#### Scenario: スキップリンクの非表示

- **WHEN** スキップリンクからフォーカスが外れた場合
- **THEN** リンクは視覚的に非表示に戻る
