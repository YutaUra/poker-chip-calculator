## MODIFIED Requirements

### Requirement: チップ編集ダイアログを提供する

ChipIcon コンポーネント SHALL クリック時に編集ダイアログを表示する。

#### Scenario: ダイアログ操作

- **WHEN** ダイアログで金額・色を変更し Save をクリックした場合
- **THEN** 変更が親コンポーネントに反映される

- **WHEN** Cancel をクリックした場合
- **THEN** 変更は破棄される

#### Scenario: カラーパレット

- **WHEN** ダイアログを開いた場合
- **THEN** 9色のクイック選択パレット (Red, Blue, Green, Purple, Yellow, Pink, Orange, White, Black) が5×2グリッドで表示される
- **THEN** 各カラーボタンに `aria-label` と `aria-pressed` 属性が設定される
- **THEN** グリッドの10番目のスロットに拡張カラーピッカーを開く「+」ボタンが表示される

#### Scenario: 拡張カラーピッカーで選択した色の反映

- **WHEN** 拡張カラーピッカーで色を選択した場合
- **THEN** 選択した色がチップのプレビューに即時反映される
- **THEN** クイック選択パレットに該当する色がある場合はそのボタンが選択状態になる
- **THEN** クイック選択パレットに該当する色がない場合はいずれのボタンも選択状態にならない

#### Scenario: テキストコントラスト

- **WHEN** チップの背景色が明るい場合 (Yellow, White)
- **THEN** チップのテキストは黒色で表示される

- **WHEN** チップの背景色が暗い場合 (Red, Blue, Black 等)
- **THEN** チップのテキストは白色で表示される

#### Scenario: チップアイコンの onSave

- **WHEN** ダイアログで Save をクリックした場合
- **THEN** `onSave({amount, unit, color})` が1回の呼び出しで実行される
