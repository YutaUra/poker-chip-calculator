## Context

現在のアプリはブラインド設定としてBB額のみを管理しており、アンティやプレイヤー人数の概念がない。トーナメントポーカーではBBAアンティ（Big Blind Ante）が標準的であり、1ハンドあたりのコスト = SB + BB + ante × players を把握してM値を計算することが意思決定の基礎となる。

既存の状態管理:
- `currentBlindAmount` + `currentBlindUnit` → sessionStorage（BB値）
- `UnitInputSelect` コンポーネント → 数値+単位の入力UI（再利用可能）

## Goals / Non-Goals

**Goals:**
- アンティ額とプレイヤー人数を入力できるUIを提供する
- M値を正確に計算し、ゾーン色分けで直感的に表示する
- 既存のBB計算ロジックに影響を与えずにM値機能を追加する
- アンティ・人数の入力状態をsessionStorageに永続化する

**Non-Goals:**
- SB額の個別入力（BB/2 固定で十分。SBが非標準のゲームは極めて稀）
- ブラインドスケジュール（レベルごとのブラインド・アンティ自動変更）
- M値のグラフ記録（既存のスタック履歴にはBBのみ記録し続ける）
- アンティ額をBB換算に反映する（BB換算は従来通りBBのみで計算）

## Decisions

### 1. M値計算ロジックの分離

M値計算は `src/lib/m-ratio.ts` に独立モジュールとして実装する。

```typescript
interface MRatioInput {
  totalStack: number
  bbAmount: number    // BB の実効値
  anteAmount: number  // アンティの実効値
  players: number     // テーブル人数
}

type MZone = "green" | "yellow" | "orange" | "red"

function calculateMRatio(input: MRatioInput): number
function getMZone(m: number): MZone
```

SB は `bbAmount / 2` で自動算出する。M = totalStack / (SB + BB + ante × players)。

**代替案**: M値を `chip-logic.ts` の既存関数に追加 → BB計算とM値計算は独立した関心事であり、ファイルの責務が肥大化するため別モジュールとした。

### 2. SB の扱い

SB = BB / 2 で固定する。独立した入力フィールドは設けない。

**代替案**: SB を別途入力可能にする → ほぼすべてのポーカーゲームで SB = BB/2 であり、例外（例: SB=2/3 BB）は極めて稀。UIの複雑性増加に見合わない。

### 3. アンティ入力の配置

ブラインド設定セクション（Current Blind）の下にアンティ入力行を追加する。既存の `UnitInputSelect` を再利用し、アンティ額+単位を入力する。プレイヤー人数は数値入力（min=2, max=10, デフォルト9）として同セクションに配置する。

アンティのデフォルト値は 0（アンティなし = キャッシュゲーム想定）。アンティが0の場合、M値は表示しない（キャッシュゲームではM値は意味を持たないため）。

### 4. M値ゾーンの色分け

Dan Harrington の定義に準拠:
- **Green Zone** (M >= 20): 十分なスタック。あらゆるプレイが可能
- **Yellow Zone** (10 <= M < 20): スタックが減少。プレイレンジを絞る必要あり
- **Orange Zone** (5 <= M < 10): プッシュ/フォールド戦略に移行を検討
- **Red Zone** (M < 5): プッシュ/フォールドのみ。早急にアクションが必要

色はTailwind CSSのカラークラスを使用する（`text-green-600`, `text-yellow-600`, `text-orange-600`, `text-red-600`）。

### 5. 状態永続化

sessionStorage に以下のキーを追加する:
- `current-ante-amount`: アンティ額（number）
- `current-ante-unit`: アンティ単位（Unit）
- `current-players`: プレイヤー人数（number）

既存の `usehooks-ts` の `useSessionStorage` を使い、既存パターンに合わせる。

## Risks / Trade-offs

- **[M値がキャッシュゲームで無意味]** → アンティが0の場合はM値を非表示にすることで対応。UIを汚さない
- **[SB固定の制約]** → SBが非標準のゲーム（例: 1/1ブラインド）では不正確なM値になる。十分に稀なケースであり、初期実装では許容する
- **[UIの情報密度増加]** → ブラインドセクションの入力項目が増える。アンティ・人数はトーナメント向けであり、キャッシュゲームでは0/デフォルトのままで使えるため実質的な影響は限定的
