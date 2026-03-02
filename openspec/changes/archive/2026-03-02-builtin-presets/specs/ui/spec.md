## ADDED Requirements

### Requirement: PresetDialog でビルトインとユーザープリセットをセクション分けして表示する

PresetDialog SHALL ビルトインプリセットを「Built-in」セクション、ユーザープリセットを「My Presets」セクションとしてラベル付きで分離表示する。

#### Scenario: セクション分け表示

- **WHEN** PresetDialog を開いた場合
- **THEN** 「Built-in」セクションにビルトインプリセット（Standard, Tournament, Home Game）が表示される
- **THEN** 「My Presets」セクションにユーザーが保存したプリセットが表示される

#### Scenario: ユーザープリセットがない場合

- **WHEN** ユーザーが保存したプリセットが0件の場合
- **THEN** 「My Presets」セクションは空の状態で表示される（「Built-in」セクションのみにプリセットが並ぶ）

#### Scenario: ビルトインプリセットの削除ボタン非表示

- **WHEN** PresetDialog でビルトインプリセットを表示する場合
- **THEN** ビルトインプリセットには削除ボタンが表示されない
