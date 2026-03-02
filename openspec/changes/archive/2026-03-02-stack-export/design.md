## Context

現在のアプリはスタックデータを localStorage（`stack-session`）に保存しているが、外部にデータを持ち出す手段がない。ポーカープレイヤーはスプレッドシートで長期的な成績を管理したり、デバイス間でデータを移行したいニーズがある。

既存の StackSnapshot 型:
```typescript
interface StackSnapshot {
  id: string
  recordNumber: number
  timestamp: number
  totalChips: number
  bbValue: number
  blindAmount: number
  blindUnit: Unit
  memo: string | null
}
```

## Goals / Non-Goals

**Goals:**
- 現在のセッションデータを CSV / JSON でダウンロードできる
- JSON ファイルからセッションデータをインポートしてセッションを復元できる
- エクスポートファイルが外部ツール（Google スプレッドシート等）で開ける

**Non-Goals:**
- アーカイブセッションのエクスポート（multi-session-history と組み合わせて将来対応）
- クラウドストレージへの自動バックアップ
- 他アプリ固有フォーマット（PokerTracker HH 形式等）への対応
- エクスポートデータの暗号化

## Decisions

### 1. CSV フォーマット

```csv
Record,Timestamp,BB Value,Total Chips,Blind Amount,Blind Unit,Memo
1,2026-03-01T10:30:00.000Z,100,20000,200,1,
2,2026-03-01T11:00:00.000Z,120,24000,200,1,Won big pot
```

- ヘッダー行を含む
- タイムスタンプは ISO 8601 形式（スプレッドシートで自動認識される）
- メモは空文字列で表現（null → 空文字）
- カンマ区切り、メモ内にカンマがある場合はダブルクォートで囲む

**代替案**: TSV（タブ区切り）→ CSV の方がスプレッドシートでの認識率が高いため却下。

### 2. JSON フォーマット

エクスポート JSON はそのままインポート可能な形式とする。

```json
{
  "version": 1,
  "exportedAt": "2026-03-01T12:00:00.000Z",
  "session": {
    "id": "...",
    "startedAt": 1709280000000,
    "snapshots": [...]
  }
}
```

`version` フィールドで将来のフォーマット変更に対応する。`session` は既存の `Session` 型をそのまま使う。

### 3. ファイル生成とダウンロード

Blob API + URL.createObjectURL でファイルを生成し、動的に生成した `<a>` 要素でダウンロードをトリガーする。

```typescript
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

ファイル名: `poker-session-{YYYY-MM-DD}.csv` / `.json`

**代替案**: File System Access API → Safari 未対応。従来の Blob + a.click() の方が互換性が高い。

### 4. インポートのバリデーション

JSON インポート時は以下を検証する:
- `version` フィールドの存在と値（現在は `1` のみ許容）
- `session` オブジェクトの構造（id, startedAt, snapshots の存在）
- 各 snapshot の必須フィールド（id, recordNumber, timestamp, totalChips, bbValue, blindAmount, blindUnit）
- blindUnit が有効な Unit 型の値であること

バリデーション失敗時はトースト通知でエラーメッセージを表示し、インポートを中止する。

### 5. インポート時の動作

インポート時は現在のセッションを**上書き**する。確認ダイアログを表示して、ユーザーの明示的な承認を得る。

### 6. UI 配置

Stack Graph セクション内に「Export」ドロップダウンボタン（CSV / JSON の2択）と「Import」ボタンを配置する。記録が0件の場合、Export ボタンは disabled とする。Import ボタンは常に有効。

## Risks / Trade-offs

- **[大量データのエクスポート]** → 1セッション内のスナップショットは通常数十件。数千件になることは考えにくいため、パフォーマンス問題は発生しない。
- **[不正な JSON のインポート]** → バリデーションで弾く。悪意のある JSON（XSS ペイロード等）はデータとして保存されるだけで HTML にレンダリングされないため安全（メモフィールドの表示時にテキストノードとして出力されるため）。
- **[CSV のエンコーディング]** → UTF-8 BOM 付きで出力する。Excel で日本語メモが文字化けしないようにするため。
