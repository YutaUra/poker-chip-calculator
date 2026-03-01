## Why

ポーカーにおけるベッティング判断は自分のスタックだけでなく、相手との「エフェクティブスタック（effective stack = min(自分, 相手)）」に基づいて行う。特にヘッズアップやショートハンドのキャッシュゲームでは、エフェクティブスタックが戦略の基盤となる。現状のアプリには相手スタックの概念がなく、プレイヤーは暗算でエフェクティブスタックを求める必要がある。

## What Changes

- 「Effective Stack」セクションを追加し、トグルでON/OFF可能にする（デフォルトOFF）
- 相手スタック入力（BB単位またはチップ額）を提供する
- エフェクティブスタック = min(自分のスタック, 相手のスタック) を計算する
- エフェクティブスタックをBB換算で表示する
- ON/OFF状態と相手スタック値を sessionStorage に永続化する

## Capabilities

### New Capabilities
- `effective-stack`: エフェクティブスタックの計算ロジック、相手スタック入力、表示、トグルON/OFFを包括する

### Modified Capabilities
- `ui`: Total Stack セクション付近にエフェクティブスタック表示セクションを追加する

## Impact

- **新規ファイル**: `src/lib/effective-stack.ts`（エフェクティブスタック計算ロジック）
- **変更ファイル**: `PokerChipCalculator.tsx`（相手スタック状態管理、エフェクティブスタック表示）
- **ストレージ**: sessionStorage に相手スタック値・入力モード・トグル状態を追加
- **依存関係**: 追加なし

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 3 | 3 | 9 |
| PM-2 | 3 | 3 | 9 |
| TL-1 | 3 | 4 | 12 |
| TL-2 | 4 | 3 | 12 |
| **平均** | **3.3** | **3.3** | **10.5** |

**ティア: B** — ロジックは min() のみで単純。対象シーン（ヘッズアップ）が限定的。

## Cross-Feature Dependencies

- **PokerChipCalculator.tsx 肥大化**: 新セクション・新状態（opponentStack, effectiveStackEnabled）の追加で PokerChipCalculator.tsx がさらに膨らむ。Phase 2a のコンポーネント分割後に着手推奨
- **pot-odds-calculator との UI 配置**: 両機能ともトグル ON/OFF の独立セクション。ポーカー分析系機能として統一的な表示位置・UXパターンを決定する必要がある
- **session-share**: エフェクティブスタックの値をシェアテキストに含めるか検討。含める場合は session-share の設計に影響
- **stack-history**: StackSnapshot に effectiveStack を記録するか検討。記録する場合は StackSnapshot 型の拡張が必要
- **チュートリアル**: デフォルト OFF のため、チュートリアルで直接言及する必要はない
