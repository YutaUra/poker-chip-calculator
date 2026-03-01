## Context

現在のアプリでは、チップの枚数を変更するには ScrollableCounter で1行ずつスクロール操作する必要がある。新しいハンドやセッションでカウントをやり直す際に、すべてのチップを個別に0に戻す操作は非効率である。

既存のチップ状態管理:
```typescript
const [chips, setChips] = useSessionStorage<ChipRow[]>("chips", [...])
// ChipRow = { id: number, amount: number, unit: Unit, count: number, color: string }
```

Chips セクションのヘッダー行には既に「Presets」ボタンと「+」（add chip）ボタンが配置されている。

## Goals / Non-Goals

**Goals:**
- ワンタップで全チップの `count` を 0 にリセットできる
- チップ構成（額面・色・並び順）は維持される
- 既存の操作フローを妨げない

**Non-Goals:**
- チップ行自体の削除（既存の削除ボタンで対応済み）
- リセット後の Undo 機能（枚数は即座に手動で再設定可能なため不要）
- 特定のチップだけを選択してリセットする機能

## Decisions

### 1. リセットボタンの配置

Chips セクションヘッダー行の既存ボタン群（Presets, +）と同じ行に「Reset」ボタンを ghost variant で配置する。

**代替案**: Floating Action Button → 画面上の他の操作と混在し、誤操作リスクが高いため却下。

### 2. 確認ダイアログなし

リセット操作に確認ダイアログは表示しない。理由: 枚数は即座に ScrollableCounter で再設定でき、影響が軽微であるため。

**代替案**: 確認ダイアログを表示 → 頻繁に使う操作なので毎回確認を求めるのは煩わしい。

### 3. 実装方法

`setChips` で既存の配列を `map` し、各行の `count` のみを 0 に置き換える。

```typescript
const handleResetCounts = () => {
  setChips(prev => prev.map(chip => ({ ...chip, count: 0 })))
}
```

ID、amount、unit、color はすべて維持される。

## Risks / Trade-offs

- **[誤操作による枚数喪失]** → 確認ダイアログなしの設計だが、枚数は即座に手動で再設定可能。また sessionStorage にはリセット後の状態が即座に保存されるため、ブラウザの戻る操作では復元できない。この制約は許容する。
