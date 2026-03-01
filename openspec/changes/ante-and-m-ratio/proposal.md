## Why

現代のポーカートーナメントでは BBA（Big Blind Ante）が標準となっており、アンティを含めた1ハンドあたりのコストを正確に把握する必要がある。M値（Harrington's M = stack / (SB + BB + ante × players)）はトーナメントプレイヤーにとって最も重要な意思決定指標であり、プッシュ/フォールド戦略の閾値判断に不可欠である。現状のアプリはBB換算のみでアンティを考慮できないため、トーナメントプレイヤーの実用性が限定的になっている。

## What Changes

- ブラインド設定セクションにアンティ入力を追加する（既存の UnitInputSelect コンポーネントを再利用）
- プレイヤー人数入力（2〜10人）を追加する
- M値計算ロジックを実装する: M = totalStack / (SB + BB + ante × players)
- M値のゾーン色分け表示を追加する: Green(M>=20), Yellow(10<=M<20), Orange(5<=M<10), Red(M<5)
- Total Stack セクションに M値表示を追加する
- SB はデフォルトで BB / 2 として自動算出する（手動上書き可能にはしない。SBが非標準のケースは稀であり、複雑性に見合わない）

## Capabilities

### New Capabilities
- `m-ratio`: M値の計算ロジック、ゾーン判定、アンティ・プレイヤー人数の入力管理を包括する

### Modified Capabilities
- `logic`: アンティとプレイヤー人数を用いたM値計算を追加する。既存のBB計算は変更しない
- `ui`: ブラインド設定セクションにアンティ入力とプレイヤー人数入力を追加し、Total Stack セクションにM値表示を追加する

## Impact

- **新規ファイル**: `src/lib/m-ratio.ts`（M値計算ロジック）
- **変更ファイル**: `PokerChipCalculator.tsx`（アンティ・プレイヤー人数の状態管理、M値表示の統合）
- **ストレージ**: sessionStorage にアンティ額・アンティ単位・プレイヤー人数を追加保存
- **依存関係**: 追加なし（既存の UnitInputSelect, units.ts を再利用）

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 5 | 3 | 15 |
| PM-2 | 4 | 3 | 12 |
| TL-1 | 5 | 3 | 15 |
| TL-2 | 4 | 3 | 12 |
| **平均** | **4.5** | **3.0** | **13.5** |

**ティア: A** — Impact 最高クラス(4.5)。トーナメント対応の核心機能だが状態追加でメインコンポーネント肥大化に注意。

## Cross-Feature Dependencies

- **チュートリアル**: blind-input ステップの説明文を「BB とアンティの金額を設定します」に更新し、`TUTORIAL_VERSION` をインクリメントする必要がある（既存ユーザーにチュートリアル再表示）
- **builtin-presets**: `ChipPreset` 型に `anteAmount?`, `anteUnit?`, `players?` が存在しない。builtin-presets を先に実装すると後から型拡張が破壊的変更になる。少なくとも `ChipPreset` 型にオプショナルフィールドを予め含めておくこと
- **stack-history**: `StackSnapshot` に `anteAmount`, `players`, `mValue` が未定義。記録時にM値も保存しないと過去グラフでM値推移を表示できない。オプショナルフィールドとして追加し後方互換性を保つこと
- **PokerChipCalculator.tsx 膨張**: state +3（ante, anteUnit, players）、UI +40行が見込まれる。effective-stack, pot-odds-calculator と合わせて実装する場合、事前にカスタムフック分割（`useBlindState()` 等）のリファクタリングが前提
- **effective-stack / pot-odds-calculator**: 3機能とも「Poker Tools」セクションとしてグループ化する UI 設計を検討すべき
