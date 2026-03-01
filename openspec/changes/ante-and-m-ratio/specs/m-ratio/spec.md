## ADDED Requirements

### Requirement: M値（Harrington's M）を計算する

システム SHALL M値を以下の式で計算する:
- M = totalStack / (SB + BB + ante × players)
- SB = BB / 2（固定）
- totalStack, BB, ante はそれぞれ実効値（amount × unitMultiplier）を使用する

#### Scenario: 標準的なトーナメントのM値計算

- **WHEN** totalStack=30000, BB=300, ante=300, players=9 の場合
- **THEN** SB=150 となり、M = 30000 / (150 + 300 + 300×9) = 30000 / 3150 = 9.52 となる

#### Scenario: アンティなしの場合のM値計算

- **WHEN** totalStack=30000, BB=300, ante=0, players=9 の場合
- **THEN** SB=150 となり、M = 30000 / (150 + 300 + 0) = 30000 / 450 = 66.67 となる

#### Scenario: BBが0の場合

- **WHEN** BB が 0 または未入力の場合
- **THEN** M値は 0 を返す（ゼロ除算を回避する）

### Requirement: M値のゾーンを判定する

システム SHALL M値に基づいて以下の4ゾーンを判定する:
- **Green Zone**: M >= 20（十分なスタック）
- **Yellow Zone**: 10 <= M < 20（スタック減少）
- **Orange Zone**: 5 <= M < 10（プッシュ/フォールド検討）
- **Red Zone**: M < 5（プッシュ/フォールドのみ）

#### Scenario: Green Zone の判定

- **WHEN** M値が 20 以上の場合
- **THEN** ゾーンは "green" と判定される

#### Scenario: Yellow Zone の判定

- **WHEN** M値が 10 以上 20 未満の場合
- **THEN** ゾーンは "yellow" と判定される

#### Scenario: Orange Zone の判定

- **WHEN** M値が 5 以上 10 未満の場合
- **THEN** ゾーンは "orange" と判定される

#### Scenario: Red Zone の判定

- **WHEN** M値が 5 未満の場合
- **THEN** ゾーンは "red" と判定される

#### Scenario: 境界値の判定

- **WHEN** M値がちょうど 20 の場合
- **THEN** ゾーンは "green" と判定される
- **WHEN** M値がちょうど 10 の場合
- **THEN** ゾーンは "yellow" と判定される
- **WHEN** M値がちょうど 5 の場合
- **THEN** ゾーンは "orange" と判定される

### Requirement: アンティが0の場合はM値を非表示にする

システム SHALL アンティ額が 0 の場合、M値の表示を省略する。M値はトーナメント向けの指標であり、キャッシュゲーム（アンティなし）では意味を持たないため。

#### Scenario: アンティが0の場合

- **WHEN** アンティ額が 0 の場合
- **THEN** M値は Total Stack セクションに表示されない

#### Scenario: アンティが0より大きい場合

- **WHEN** アンティ額が 0 より大きい場合
- **THEN** M値がゾーン色付きで Total Stack セクションに表示される

### Requirement: M値の表示フォーマット

システム SHALL M値を小数第1位まで表示する。整数の場合は小数なしで表示する。

#### Scenario: M値の小数表示

- **WHEN** M値が 9.52 の場合
- **THEN** "M = 9.5" と表示される

#### Scenario: M値の整数表示

- **WHEN** M値が 20.0 の場合
- **THEN** "M = 20" と表示される
