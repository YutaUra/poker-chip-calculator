## Context

現在のアプリはチップ計算の「瞬間値」のみを表示する SPA。状態は usehooks-ts の useSessionStorage でタブ単位に永続化されている。グラフ機能の追加により、セッション中のスタック推移を時系列で記録・可視化する必要がある。

## Goals / Non-Goals

**Goals:**
- ワンタップでスタックスナップショットを記録し、折れ線グラフで推移を表示する
- BB表示/チップ額表示の切り替えをサポートする
- セッション管理（新規セッション開始）でデータのライフサイクルを管理する
- localStorage でデータを永続化し、タブ閉じ/クラッシュに耐える

**Non-Goals:**
- 複数セッションの履歴管理・一覧表示（将来対応）
- リバイ（追加購入）のトラッキング
- ブラインドレベル変更の自動検出・垂直線表示
- データのエクスポート/インポート
- オンラインポーカーのハンド履歴自動取得

## Decisions

### 1. グラフライブラリ: Recharts

**選択**: Recharts
**代替案**: Chart.js (react-chartjs-2), Nivo, Visx, 自前 SVG

**理由**:
- React コンポーネントとして宣言的に記述でき、既存の React 19 + TypeScript 構成との親和性が高い
- バンドルサイズが比較的軽量（tree-shaking 対応）
- 折れ線グラフ + ツールチップ + 基準線という要件を標準コンポーネントだけでカバーできる
- shadcn/ui のチャートコンポーネントが Recharts ベースであり、テーマとの統合が容易

### 2. データ永続化: localStorage（記録データ専用）

**選択**: localStorage で記録データを管理。既存の sessionStorage（チップ/ブラインド設定）はそのまま維持。
**代替案**: IndexedDB, sessionStorage 統合

**理由**:
- ライブポーカーセッションは数時間に及び、iOS Safari のタブ回収で sessionStorage が消失するリスクがある
- IndexedDB は非同期 API で複雑さが増す。記録データ量は数十〜数百ポイントで、localStorage の 5MB 制限に十分収まる
- 既存のチップ/ブラインド設定は「一時的な計算状態」なので sessionStorage のままで問題ない

### 3. データ構造

```typescript
interface StackSnapshot {
  id: string              // crypto.randomUUID()
  recordNumber: number    // 記録番号（X軸）
  timestamp: number       // Date.now()
  totalChips: number      // チップ総額
  bbValue: number         // BB換算値
  blindAmount: number     // 記録時のブラインド額
  blindUnit: Unit         // 記録時のブラインド単位
  memo: string | null     // オプションのメモ
}

interface Session {
  id: string
  startedAt: number
  snapshots: StackSnapshot[]
}
```

### 4. コンポーネント構成

- `src/lib/stack-history.ts` — データ操作の純粋関数（記録追加、削除、セッション管理）
- `src/components/StackGraph.tsx` — Recharts を使ったグラフ表示コンポーネント
- `PokerChipCalculator.tsx` — 記録ボタン・セッション管理 UI を追加

### 5. BBグラフとチップ額グラフの2つを同時表示

**選択**: BB 推移グラフとチップ額推移グラフを縦に並べて同時に表示する
**代替案**: トグルで切り替え

**理由**:
- トーナメントではブラインド上昇によりチップ額が増えていても BB が減っている状況がある。2つを同時に見ることで「チップは増えたがBBは減った（ブラインドの上昇に追いつけていない）」という重要な情報が一目で分かる
- キャッシュゲームではブラインド固定のため2つのグラフは相似形になるが、表示に害はない
- トグル操作の手間が省ける。ライブポーカー中はワンタップで情報を得たい

## Risks / Trade-offs

- **[Recharts バンドルサイズ]** → tree-shaking で必要なコンポーネントのみ import。LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine 程度
- **[localStorage 容量]** → 1セッション数百ポイント × 各100バイト程度 = 数十KB。問題なし。新規セッション開始時に前セッションを破棄することで蓄積も防止
- **[既存テストへの影響]** → PokerChipCalculator.tsx への変更が既存テストに影響する可能性。テキスト内容やロール構造を壊さないよう注意
