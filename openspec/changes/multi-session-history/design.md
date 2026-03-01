## Context

現在のアプリはセッションリセット時に記録が完全に消える。`stack-session` キーで localStorage に現在のセッション（`Session` 型）を保持しているが、リセット時に `createSession()` で上書きされるため過去データへのアクセス手段がない。

既存のストレージ構成:
- `chips` → sessionStorage（チップリスト）
- `current-blind-*` → sessionStorage（ブラインド設定）
- `stack-session` → localStorage（現在の Session）
- `chip-presets` → localStorage（ユーザープリセット）

既存の Session / StackSnapshot 型は `src/lib/stack-history.ts` に定義済み。

## Goals / Non-Goals

**Goals:**
- セッションリセット時に現在のセッションデータをアーカイブとして保存する
- 過去のセッション一覧・詳細（グラフ含む）を閲覧できる
- 通算成績（総セッション数、総プレイ時間、通算 +/- BB）を表示する
- セッションを個別に削除できる
- localStorage の容量を管理し、最大50セッションに制限する

**Non-Goals:**
- セッションデータのクラウド同期
- セッションデータの import/export（別 change `stack-export` で対応予定）
- セッション間の比較・分析機能
- セッションのタグ付け・分類

## Decisions

### 1. アーカイブデータ構造

```typescript
interface ArchivedSession {
  id: string
  startedAt: number
  endedAt: number
  snapshots: StackSnapshot[]
  summary: SessionSummary
}

interface SessionSummary {
  snapshotCount: number
  durationMs: number
  startBB: number
  endBB: number
  deltaBB: number
  peakBB: number
  lastBlindAmount: number
  lastBlindUnit: Unit
}
```

`summary` をアーカイブ時に事前計算して保存する。一覧表示で全スナップショットを走査する必要がなくなる。

**代替案**: summary を都度計算 → セッション数が増えると一覧表示のパフォーマンスが劣化するため却下。

### 2. ストレージ設計

localStorage の `session-archive` キーに `ArchivedSession[]` を新しい順（endedAt 降順）で保存する。

```
localStorage:
  "session-archive" → ArchivedSession[] (最大50件)
  "stack-session" → Session (既存・変更なし)
```

既存の `stack-session` キーは変更しない。アーカイブは独立したキーで管理する。

### 3. 容量管理

最大50セッションを保持する。51件目のアーカイブ時に最も古いセッションを自動削除する。localStorage の実容量チェック（5MB制限）は行わず、件数ベースで制御する。

**代替案**: バイトサイズで制限 → 計算コストがかかる割にプリセット数が50件程度なら問題ないため却下。1セッションあたり平均20スナップショット × 200バイト = 4KB、50件で 200KB 程度と十分小さい。

### 4. リセットフローの変更

セッションリセット時の動作:
1. 確認ダイアログに「保存してリセット」と「保存せずリセット」の2択を表示する
2. 「保存してリセット」選択時: 現在の Session を ArchivedSession に変換して保存 → セッションをリセット
3. 「保存せずリセット」選択時: そのままセッションをリセット（現行動作）
4. スナップショットが0件のセッションはアーカイブ対象外とする

### 5. UI 構成

セッション履歴は shadcn/ui Dialog で表示する。Stack Graph セクションに「履歴」ボタンを追加し、クリックで履歴ダイアログを開く。

ダイアログ内の構成:
- ヘッダー: 通算サマリー（総セッション数、通算 +/- BB）
- リスト: 各セッションのカード（日付、プレイ時間、最終BB、+/- BB）
- セッションカードタップで詳細展開（過去のグラフを表示）
- 各セッションに削除ボタン

過去セッションのグラフ表示には既存の StackGraph コンポーネントを `readOnly` モードで再利用する。

**代替案**: 専用ページ（React Router）→ SPA のルーティング追加は過剰。ダイアログで十分。

### 6. 通算サマリー計算

```typescript
function calculateOverallSummary(sessions: ArchivedSession[]): OverallSummary {
  return {
    totalSessions: sessions.length,
    totalPlayTimeMs: sessions.reduce((sum, s) => sum + s.summary.durationMs, 0),
    totalDeltaBB: sessions.reduce((sum, s) => sum + s.summary.deltaBB, 0),
    winSessions: sessions.filter(s => s.summary.deltaBB > 0).length,
    loseSessions: sessions.filter(s => s.summary.deltaBB < 0).length,
  }
}
```

## Risks / Trade-offs

- **[localStorage 5MB 制限]** → 50セッション × 4KB ≒ 200KB で十分余裕がある。ただし他のキー（presets, chips 等）と合算で近づく可能性はゼロではない。書き込み時に try-catch で QuotaExceededError をハンドリングし、トーストでユーザーに通知する。
- **[異なるブラインドレベルでの +/- BB 集計]** → セッション間でブラインドが異なる場合、通算 BB の単純合算は厳密には意味が薄い。しかしポーカープレイヤーにとって BB 単位の損益は直感的な指標であり、ブラインドレベルの違いは許容可能。
- **[アーカイブデータの後方互換性]** → StackSnapshot 型が将来変更された場合、過去のアーカイブデータが不整合になる可能性がある。バージョンフィールドの追加は現時点では過剰設計のため見送る。
