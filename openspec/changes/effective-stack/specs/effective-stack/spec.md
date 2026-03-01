## ADDED Requirements

### Requirement: エフェクティブスタックを計算する

システム SHALL エフェクティブスタックを以下の式で計算する:
- effectiveStack = min(myStackBB, opponentStackBB)
- myStackBB は自分のスタックのBB換算値を使用する
- opponentStackBB はユーザーが入力したBB値を使用する

#### Scenario: 自分のスタックが小さい場合

- **WHEN** 自分のスタックが 80BB、相手のスタックが 120BB の場合
- **THEN** エフェクティブスタックは 80BB となる

#### Scenario: 相手のスタックが小さい場合

- **WHEN** 自分のスタックが 150BB、相手のスタックが 60BB の場合
- **THEN** エフェクティブスタックは 60BB となる

#### Scenario: スタックが同じ場合

- **WHEN** 自分のスタックが 100BB、相手のスタックが 100BB の場合
- **THEN** エフェクティブスタックは 100BB となる

#### Scenario: 相手スタックが0の場合

- **WHEN** 相手のスタックが 0 または未入力の場合
- **THEN** エフェクティブスタックは 0BB と表示する

### Requirement: エフェクティブスタック機能をトグルで切り替える

システム SHALL エフェクティブスタック機能のON/OFF切り替えを提供する。デフォルトはOFF。

#### Scenario: デフォルト状態

- **WHEN** ページを初期表示した場合
- **THEN** エフェクティブスタック機能はOFFであり、入力フィールドと表示は非表示である

#### Scenario: ONに切り替え

- **WHEN** エフェクティブスタックのトグルをONにした場合
- **THEN** 相手スタック入力フィールドとエフェクティブスタック表示が展開される

#### Scenario: OFFに切り替え

- **WHEN** エフェクティブスタックのトグルをOFFにした場合
- **THEN** 入力フィールドと表示が折りたたまれる
- **THEN** 入力値は保持される（再度ONにすると復元される）

### Requirement: 相手スタックをBB単位で入力する

システム SHALL 相手スタックの入力フィールドをBB単位の数値入力として提供する。

#### Scenario: BB値の入力

- **WHEN** 相手スタック入力に 100 と入力した場合
- **THEN** 相手スタックは 100BB として扱われる

#### Scenario: 小数入力

- **WHEN** 相手スタック入力に 85.5 と入力した場合
- **THEN** 相手スタックは 85.5BB として扱われる

### Requirement: エフェクティブスタックの表示フォーマット

システム SHALL エフェクティブスタックを `Effective Stack: XX BB` の形式で表示する。BB値は整数なら小数なし、端数ありなら小数1桁で表示する。

#### Scenario: 整数の表示

- **WHEN** エフェクティブスタックが 80BB の場合
- **THEN** "Effective Stack: 80 BB" と表示される

#### Scenario: 小数の表示

- **WHEN** エフェクティブスタックが 85.5BB の場合
- **THEN** "Effective Stack: 85.5 BB" と表示される

### Requirement: トグル状態と相手スタック値を sessionStorage に永続化する

システム SHALL エフェクティブスタックのトグル状態と相手スタック値を sessionStorage に保存する。

#### Scenario: ページリロード後の復元

- **WHEN** ページをリロードした場合
- **THEN** トグル状態と相手スタック値が復元される

#### Scenario: タブを閉じる

- **WHEN** タブを閉じた場合
- **THEN** トグル状態と相手スタック値は破棄される
