# チップ枚数入力を number input に変更

## Why

現在のスクロール式カウンター（ScrollableCounter）は SP で「1枚ずつ」の微調整がやりにくい。狙った値で止めるのが難しく、少数枚の入力ではかえって不便。普通の number input のほうが確実に入力できる。

## What Changes

- チップ枚数の入力をスクロールカウンターから number input（`inputmode="numeric"`）に変更する
- ScrollableCounter を完全に置き換えるか、number input を併設（タップで直接入力）するかは設計時に判断
- 完全置き換えの場合は `ScrollableCounter.tsx` とテスト、関連するチュートリアルステップ・ハプティクス連携も整理する

## Impact

- **変更ファイル**: `src/components/ChipListSection.tsx` 周辺、`src/components/ScrollableCounter.tsx`（＋テスト）、`src/lib/tutorial.ts`（カウンター説明ステップ）
- **注意**: ScrollableCounter は openspec/specs/scrollable-counter に仕様があるため、置き換え時は spec の更新も必要

## Status

- [x] 実装済み（ScrollableCounter を number input に完全置き換え。tutorial 文言・specs も更新）
