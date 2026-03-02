## Context

現在のアプリは自分のチップスタックのみを管理している。ポーカーでは相手より多くのチップを持っていても、相手のスタック以上に賭けることはできないため、実質的に有効なスタック（エフェクティブスタック）は min(自分, 相手) となる。キャッシュゲームのヘッズアップやショートハンドで特に重要な概念。

既存コンポーネント:
- `PokerChipCalculator.tsx` が全状態を管理
- Total Stack セクションが合計額・BB換算を表示
- `UnitInputSelect` が数値+単位の入力UIを提供

## Goals / Non-Goals

**Goals:**
- 相手スタックをBBまたはチップ額で入力し、エフェクティブスタック = min(自分, 相手) を計算・表示する
- トグルでON/OFFを切り替え可能にし、不要な場合はUIを隠す
- 入力状態をsessionStorageに永続化する

**Non-Goals:**
- マルチウェイポット（3人以上）のエフェクティブスタック計算
- 相手スタックの履歴管理やグラフ記録
- スタック比率（SPR = Effective Stack / Pot）の計算

## Decisions

### 1. 相手スタックの入力方式

相手スタックはBB単位で入力する。BB単位が最も直感的であり、ライブポーカーでは「100BB deep」のようにBB基準で会話するのが一般的。

入力フィールドは数値のみのシンプルな入力（spinbutton）とする。UnitInputSelect は不要（BBが標準単位のため）。

**代替案**: チップ額での入力も対応する → BB入力のみで十分。チップ額が必要なケースは自分のスタックを計算機で管理し、相手のスタックは目視でBB概算するのが一般的なユースケース。

### 2. エフェクティブスタック計算ロジック

`src/lib/effective-stack.ts` に独立モジュールとして実装する。

```typescript
function calculateEffectiveStack(myStackBB: number, opponentStackBB: number): number {
  return Math.min(myStackBB, opponentStackBB)
}
```

入力がBB単位なので、自分のスタックもBB換算値を使用する。

### 3. トグルUI

Collapsible セクション（shadcn/ui の Collapsible または単純なトグルボタン）でON/OFF切り替え。デフォルトOFF。ONにすると相手スタック入力フィールドとエフェクティブスタック表示が展開される。

配置はTotal Stack セクションの直下とする。

**代替案**: 別タブやモーダル → エフェクティブスタックは常に参照したい情報であり、モーダルに隠すと利便性が低下する。

### 4. 状態永続化

sessionStorage に以下のキーを追加:
- `effective-stack-enabled`: トグル状態（boolean）
- `opponent-stack-bb`: 相手スタックBB値（number）

## Risks / Trade-offs

- **[UIの縦スクロール増加]** → デフォルトOFFのトグルで対応。必要なユーザーのみ展開する
- **[BB入力のみの制約]** → チップ額入力がないため、相手のチップを正確にカウントしたい場合に不便。ただし、ライブポーカーで相手のチップを正確にカウントすること自体が稀であり、BB概算で十分
