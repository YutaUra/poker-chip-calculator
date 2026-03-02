## MODIFIED Requirements

### Requirement: ブラインド入力を提供する

Big Blind (BB) セクション SHALL 数値入力 (spinbutton) と単位セレクト (1 / K / M / B / T) を持つ。レスポンシブデザインで、モバイルでは縦並び、デスクトップでは横並びで表示する。さらにアンティ入力（UnitInputSelect）とプレイヤー人数入力（2〜10, デフォルト9）を同セクションに提供する。

#### Scenario: ブラインド値の変更

- **WHEN** ブラインドの数値を変更した場合
- **THEN** Total 表示が実効値の短縮表記で更新される
- **THEN** BB 換算が再計算される

#### Scenario: アンティ入力

- **WHEN** アンティの数値を変更した場合
- **THEN** M値が再計算される（アンティが0より大きい場合のみ表示）

#### Scenario: アンティのデフォルト値

- **WHEN** ページを初期表示した場合
- **THEN** アンティ額は 0、単位は "1" で表示される

#### Scenario: プレイヤー人数入力

- **WHEN** プレイヤー人数を変更した場合
- **THEN** M値が再計算される

#### Scenario: プレイヤー人数のデフォルト値

- **WHEN** ページを初期表示した場合
- **THEN** プレイヤー人数は 9 で表示される

#### Scenario: プレイヤー人数の範囲

- **WHEN** プレイヤー人数を入力する場合
- **THEN** 2〜10 の範囲で入力できる

### Requirement: Total Stack を表示する

Total Stack セクション SHALL 短縮表記、詳細表記（カンマ区切り）、BB 換算の3行を表示する。アンティが0より大きい場合は、M値をゾーン色付きで追加表示する。

#### Scenario: 合計額の表示

- **WHEN** チップの枚数や金額が変更された場合
- **THEN** `Total Stack: {短縮値}` が更新される
- **THEN** `({カンマ区切り値} chips)` が更新される
- **THEN** `({BB値} Big Blinds)` が更新される（BB値は整数なら小数なし、端数ありなら小数1桁）

#### Scenario: M値の表示

- **WHEN** アンティが0より大きい場合
- **THEN** Total Stack セクションに `M = {値}` がゾーンに応じた色で表示される
- **THEN** Green Zone は緑色、Yellow Zone は黄色、Orange Zone はオレンジ色、Red Zone は赤色で表示される

#### Scenario: M値の非表示

- **WHEN** アンティが0の場合
- **THEN** M値は表示されない

#### Scenario: チップ行の小計

- **WHEN** チップの金額と枚数が設定されている場合
- **THEN** 各チップ行に `= {小計の短縮表記}` が表示される

## ADDED Requirements

### Requirement: アンティとプレイヤー人数を sessionStorage に永続化する

アプリケーション SHALL アンティ額、アンティ単位、プレイヤー人数を sessionStorage に保存する。

#### Scenario: ページリロード後の復元

- **WHEN** ページをリロードした場合
- **THEN** アンティ額、アンティ単位、プレイヤー人数が復元される

#### Scenario: タブを閉じる

- **WHEN** タブを閉じた場合
- **THEN** アンティ・プレイヤー人数のデータは破棄される
