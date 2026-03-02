## ADDED Requirements

### Requirement: 直感的な名称のビルトインプリセットを提供する

システム SHALL 以下の3つのビルトインプリセットを `category: "system"` として読み取り専用で提供する:

**Standard (1/5/25/100/500):**
- BB=$5, $1×20 + $5×16 + $25×8 + $100×4 + $500×1 = $1,000

**Tournament (100/500/1K/5K):**
- BB=T100, T100×10 + T500×8 + T1000×6 + T5000×2 = T21,000

**Home Game (10/25/50/100):**
- BB=$25, $10×20 + $25×12 + $50×8 + $100×4 = $1,300

#### Scenario: ビルトインプリセットの合計額が正しい

- **WHEN** 各ビルトインプリセットのチップ構成を合計した場合
- **THEN** Standard は 1000、Tournament は 21000、Home Game は 1300 となる

#### Scenario: ビルトインプリセットのチップカラーがポーカー規約に従う

- **WHEN** ビルトインプリセットのチップ色を確認した場合
- **THEN** 各額面がポーカーの一般的な色規約（White=$1/T100, Red=$5/T500, Green=$25/T1000, Black=$100/T5000 等）に基づいて設定されている

#### Scenario: ビルトインプリセットにブラインド値が含まれる

- **WHEN** ビルトインプリセットを読み込んだ場合
- **THEN** チップ構成とともにブラインド値（blindAmount, blindUnit）も設定される

### Requirement: ビルトインプリセットはユーザーが削除できない

システム SHALL ビルトインプリセット（`category: "system"`）に対して削除操作を禁止する。

#### Scenario: ビルトインプリセットの削除不可

- **WHEN** PresetDialog でビルトインプリセットを表示する場合
- **THEN** 削除ボタンは表示されない

#### Scenario: ユーザープリセットは削除可能

- **WHEN** PresetDialog でユーザープリセットを表示する場合
- **THEN** 削除ボタンが表示され、クリックで削除できる

### Requirement: ビルトインプリセットはコード内定数として管理する

システム SHALL ビルトインプリセットを `SYSTEM_PRESETS` 定数として `src/lib/presets.ts` に定義し、localStorage には保存しない。

#### Scenario: ビルトインプリセットはストレージに依存しない

- **WHEN** localStorage をクリアした場合
- **THEN** ビルトインプリセットは引き続き PresetDialog に表示される
