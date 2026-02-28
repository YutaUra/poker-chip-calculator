# Business Logic Specification

## Purpose

ポーカーチップスタック計算機の計算ロジック、単位変換、数値フォーマットを定義する。

## Requirements

### Requirement: 単位乗数に基づいて実効値を計算する

システム SHALL 以下の単位乗数テーブルに従って実効値を計算する:
- `1` → 1
- `K` → 1,000
- `M` → 1,000,000
- `B` → 1,000,000,000
- `T` → 1,000,000,000,000

#### Scenario: 実効値の計算

- **WHEN** amount=100, unit="K" の場合
- **THEN** 実効値は 100,000 となる

- **WHEN** amount=2.5, unit="M" の場合
- **THEN** 実効値は 2,500,000 となる

### Requirement: Total Stack を正しく計算する

システム SHALL `Total Stack = Σ (各チップの実効値 × count)` で合計を計算する。

#### Scenario: 複数チップの合計

- **WHEN** チップ1 (amount=100, unit="1", count=10) とチップ2 (amount=500, unit="1", count=5) がある場合
- **THEN** Total Stack は 3,500 となる

### Requirement: Big Blinds を正しく計算する

システム SHALL `BB = Total Stack / (blindAmount × blindUnitMultiplier)` で BB 換算を計算する。

#### Scenario: BB 計算

- **WHEN** Total Stack=3500, blindAmount=100, blindUnit="1" の場合
- **THEN** BB は 35.00 となる

#### Scenario: ブラインドが 0 の場合

- **WHEN** blindAmount が 0 または null の場合
- **THEN** BB は 0 と表示する（Infinity にならない）

### Requirement: 単位定義を共有モジュールで管理する

`Unit` 型と `calculateUnitValue` 関数は `src/lib/units.ts` で定義し、全コンポーネントから参照する。`UnitInputSelect` は後方互換のため re-export する。

#### Scenario: 単位の参照

- **WHEN** コンポーネントが単位計算を必要とする場合
- **THEN** `@/lib/units` から `Unit` 型と `calculateUnitValue` をインポートする

### Requirement: 数値をフォーマットする

`formatChipAmount` SHALL `Intl.NumberFormat` の `compactDisplay` を使用し、小文字 (k, m) を大文字 (K, M) に変換する。BB 値は整数なら小数なし、端数ありなら小数1桁で表示する。

#### Scenario: コンパクト表記

- **WHEN** 数値が 1000 の場合
- **THEN** "1K" と表示される

- **WHEN** 数値が 4500 の場合
- **THEN** "4.5K" と表示される

#### Scenario: カンマ区切り表記

- **WHEN** `formatFullNumber(1000)` を呼び出した場合
- **THEN** "1,000" が返される

### Requirement: チップを実効値の降順でソートする

システム SHALL チップ金額変更時にチップリストを実効値の降順で自動ソートする。

#### Scenario: ソート

- **WHEN** チップの金額を変更した場合
- **THEN** チップリストが実効値の大きい順に並び替えられる
