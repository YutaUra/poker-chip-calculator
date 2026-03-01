## ADDED Requirements

### Requirement: ドラムロール型の数値ピッカーを表示する

ScrollableCounter コンポーネント SHALL チップ行内にインラインで常時表示されるドラムロール型ピッカーとして機能する。表示は3行（選択値と前後1つずつ）で、中央の選択値が強調表示される。値の範囲は0〜999。

#### Scenario: 初期表示

- **WHEN** ScrollableCounter が `value={5}` で描画された場合
- **THEN** 中央に `5` が強調表示される
- **THEN** 上に `4`、下に `6` が薄く表示される

#### Scenario: 値が0の場合

- **WHEN** ScrollableCounter が `value={0}` で描画された場合
- **THEN** 中央に `0` が強調表示される
- **THEN** 上側に表示する数値がなく、下に `1` が薄く表示される

#### Scenario: 値が最大値の場合

- **WHEN** ScrollableCounter が `value={999}` で描画された場合
- **THEN** 中央に `999` が強調表示される
- **THEN** 上に `998` が薄く表示され、下側に表示する数値がない

### Requirement: ジョグダイアル型の操作で数値を変更できる

ScrollableCounter SHALL 数値エリアを押し込み（pointerdown）、指を離さず上下に移動することで値を増減できる。押し込んだ位置を原点とし、原点からの距離が近ければゆっくり、遠ければ速く数値が変化する。指を離す（pointerup）と停止する。

#### Scenario: 押し込みから上方向へ移動

- **WHEN** 数値エリアを押し込み、原点から上方向に指を移動した場合
- **THEN** 値が増加する
- **THEN** 指を移動し続けなくても、押し込んだまま距離を保てば値が継続的に変化する

#### Scenario: 押し込みから下方向へ移動

- **WHEN** 数値エリアを押し込み、原点から下方向に指を移動した場合
- **THEN** 値が減少する
- **THEN** 指を移動し続けなくても、押し込んだまま距離を保てば値が継続的に変化する

#### Scenario: 距離に応じた速度変化

- **WHEN** 原点から近い位置（デッドゾーン外〜30px程度）に指がある場合
- **THEN** 値がゆっくり変化する（1〜3 値/秒程度）

- **WHEN** 原点から遠い位置（80px以上）に指がある場合
- **THEN** 値が高速に変化する（20〜100 値/秒程度）

#### Scenario: デッドゾーン

- **WHEN** 原点から10px以内に指がある場合
- **THEN** 値は変化しない（微小な指のブレを無視する）

#### Scenario: 指を離すと停止

- **WHEN** 押し込み中に指を離した場合
- **THEN** 値の変化が即座に停止する

#### Scenario: 値の範囲制限

- **WHEN** 値が0の状態で減少方向に操作した場合
- **THEN** 値は0のまま変化しない

- **WHEN** 値が999の状態で増加方向に操作した場合
- **THEN** 値は999のまま変化しない

#### Scenario: 値変更コールバック

- **WHEN** ジョグダイアル操作により値が整数単位で変化した場合
- **THEN** `onChange` コールバックが新しい値で呼ばれる

### Requirement: マウスホイールで数値を変更できる

ScrollableCounter SHALL マウスホイール操作で値を1ずつ増減できる。

#### Scenario: ホイール上回転

- **WHEN** コンポーネント上でマウスホイールを上に回転した場合
- **THEN** 値が1増加する（最大値を超えない）

#### Scenario: ホイール下回転

- **WHEN** コンポーネント上でマウスホイールを下に回転した場合
- **THEN** 値が1減少する（最小値を下回らない）

### Requirement: キーボード操作で数値を変更できる

ScrollableCounter SHALL キーボードの上下矢印キーで数値を1ずつ増減できる。

#### Scenario: 上矢印キー

- **WHEN** フォーカス中に上矢印キーを押した場合
- **THEN** 数値が1増加する（最大値を超えない）

#### Scenario: 下矢印キー

- **WHEN** フォーカス中に下矢印キーを押した場合
- **THEN** 数値が1減少する（最小値を下回らない）

### Requirement: アクセシビリティを提供する

ScrollableCounter SHALL `role="spinbutton"` を設定し、スクリーンリーダーで操作可能にする。

#### Scenario: ARIA属性

- **WHEN** ScrollableCounter が描画された場合
- **THEN** `role="spinbutton"` が設定される
- **THEN** `aria-valuenow` に現在の値が設定される
- **THEN** `aria-valuemin` に最小値（0）が設定される
- **THEN** `aria-valuemax` に最大値（999）が設定される
- **THEN** `aria-label` に "チップ枚数" が設定される
