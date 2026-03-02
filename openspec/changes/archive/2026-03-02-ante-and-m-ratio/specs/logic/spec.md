## ADDED Requirements

### Requirement: アンティを含む1ハンドあたりのコストを計算する

システム SHALL アンティとプレイヤー人数を用いて、1ハンドあたりのコストを以下の式で計算する:
- costPerHand = SB + BB + ante × players
- SB = BB / 2

この値はM値計算の分母として使用される。既存のBB換算（`calculateBB`）は変更しない。

#### Scenario: アンティありのコスト計算

- **WHEN** BB=300, ante=300, players=9 の場合
- **THEN** costPerHand = 150 + 300 + 300×9 = 3150 となる

#### Scenario: アンティなしのコスト計算

- **WHEN** BB=300, ante=0, players=9 の場合
- **THEN** costPerHand = 150 + 300 + 0 = 450 となる
