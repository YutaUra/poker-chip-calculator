## ADDED Requirements

### Requirement: ポットオッズを計算する

システム SHALL ポットオッズを以下の式で計算する:
- potOdds = callAmount / (potSize + callAmount) × 100（パーセント値）
- potSize と callAmount はいずれもBB単位で入力される

#### Scenario: 標準的なポットオッズ計算

- **WHEN** potSize=10BB, callAmount=5BB の場合
- **THEN** potOdds = 5 / (10 + 5) × 100 = 33.3% となる

#### Scenario: 小さいベットのポットオッズ

- **WHEN** potSize=10BB, callAmount=2BB の場合
- **THEN** potOdds = 2 / (10 + 2) × 100 = 16.7% となる

#### Scenario: ポットサイズと同額のベット

- **WHEN** potSize=10BB, callAmount=10BB の場合
- **THEN** potOdds = 10 / (10 + 10) × 100 = 50% となる

#### Scenario: コール額が0の場合

- **WHEN** callAmount が 0 または未入力の場合
- **THEN** potOdds は 0% を返す

#### Scenario: ポットサイズが0の場合

- **WHEN** potSize が 0 で callAmount が 0 より大きい場合
- **THEN** potOdds = callAmount / (0 + callAmount) × 100 = 100% となる

### Requirement: 必要エクイティを表示する

システム SHALL 必要エクイティ（required equity）をポットオッズと同じ値で表示する。コールが期待値プラスになるために必要な勝率を意味する。

#### Scenario: 必要エクイティの計算

- **WHEN** potOdds が 33.3% の場合
- **THEN** requiredEquity は 33.3% と表示される

#### Scenario: 必要エクイティの意味

- **WHEN** requiredEquity が 25% と表示されている場合
- **THEN** ユーザーのハンドが 25% 以上の勝率を持つならコールは期待値プラスであることを示す

### Requirement: ポットオッズ機能をトグルで切り替える

システム SHALL ポットオッズ機能のON/OFF切り替えを提供する。デフォルトはOFF。

#### Scenario: デフォルト状態

- **WHEN** ページを初期表示した場合
- **THEN** ポットオッズ機能はOFFであり、入力フィールドと表示は非表示である

#### Scenario: ONに切り替え

- **WHEN** ポットオッズのトグルをONにした場合
- **THEN** ポットサイズ入力、コール額入力、計算結果が展開される

#### Scenario: OFFに切り替え

- **WHEN** ポットオッズのトグルをOFFにした場合
- **THEN** 入力フィールドと計算結果が折りたたまれる
- **THEN** 入力値は保持される（再度ONにすると復元される）

### Requirement: ポットサイズとコール額をBB単位で入力する

システム SHALL ポットサイズとコール額の入力をBB単位の数値入力として提供する。

#### Scenario: ポットサイズの入力

- **WHEN** ポットサイズに 12.5 と入力した場合
- **THEN** ポットサイズは 12.5BB として扱われる

#### Scenario: コール額の入力

- **WHEN** コール額に 3 と入力した場合
- **THEN** コール額は 3BB として扱われる

### Requirement: ポットオッズの表示フォーマット

システム SHALL ポットオッズと必要エクイティを以下の形式で表示する:
- パーセント値は小数第1位まで表示する
- 整数の場合は小数なしで表示する

#### Scenario: 小数ありの表示

- **WHEN** potOdds が 33.333...% の場合
- **THEN** "Pot Odds: 33.3%" と表示される

#### Scenario: 整数の表示

- **WHEN** potOdds が 50% の場合
- **THEN** "Pot Odds: 50%" と表示される

### Requirement: トグル状態と入力値を sessionStorage に永続化する

システム SHALL ポットオッズ機能のトグル状態、ポットサイズ、コール額を sessionStorage に保存する。

#### Scenario: ページリロード後の復元

- **WHEN** ページをリロードした場合
- **THEN** トグル状態、ポットサイズ、コール額が復元される

#### Scenario: タブを閉じる

- **WHEN** タブを閉じた場合
- **THEN** トグル状態と入力値は破棄される
