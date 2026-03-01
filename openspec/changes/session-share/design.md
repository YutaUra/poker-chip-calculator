## Context

現在のアプリはスタックスナップショットを記録・表示する機能を持つが、セッション結果を外部に共有する手段がない。ポーカーコミュニティではセッション結果のSNSシェアが一般的であり、またホームゲーム主催者がチップ設定を参加者に共有するニーズがある。

既存のセッションデータ:
```typescript
interface Session {
  id: string
  snapshots: StackSnapshot[]
  createdAt: string
}

interface StackSnapshot {
  id: string
  totalChips: number
  bbCount: number
  blindAmount: number
  blindUnit: Unit
  memo: string | null
  recordedAt: string
  recordNumber: number
}
```

Cloudflare Pages にデプロイされているため、サーバーサイド処理は使えない。すべてクライアントサイドで完結する必要がある。

## Goals / Non-Goals

**Goals:**
- セッション結果（BB損益、時間）をテキストとしてSNSにシェアできる
- チップ設定をURLパラメータにエンコードし、URLを共有するだけで同じチップ構成を復元できる
- QRコードでチップ設定URLを配布できる
- Web Share API 非対応ブラウザでもクリップボードコピーで代替できる

**Non-Goals:**
- セッション履歴（全スナップショット）のシェア
- 画像生成によるシェアカード
- サーバーサイドでの短縮URL生成
- シェアされた結果の閲覧ページ（受け取り側はアプリのメインページで開く）

## Decisions

### 1. シェアテキストのフォーマット

```
Session Result: +15BB (3h 20m) 📊 #PokerChipCalc
```

- BB損益: 最後のスナップショットのBB値 - 最初のスナップショットのBB値
- セッション時間: 最初のスナップショットの recordedAt から最後の recordedAt までの経過時間
- ハッシュタグとチャートの絵文字で視認性を確保

**代替案**: チップ額の損益も表示 → ブラインドレベルが途中で変わるケースがあるため、BB換算の方が普遍的。

### 2. URLパラメータエンコード

チップ設定をBase64エンコードしたJSONとしてURLパラメータに含める:

```
https://example.com/?config=eyJjaGlwcyI6Wy4uLl0sImJsaW5kIjp7ImFtb3VudCI6MiwidW5pdCI6IjEifX0=
```

構造:
```typescript
interface ShareConfig {
  chips: Array<{ amount: number; unit: Unit; count: number; color: string }>
  blind: { amount: number; unit: Unit }
}
```

`btoa(JSON.stringify(config))` でエンコードし、`JSON.parse(atob(param))` でデコードする。

**代替案 A**: 個別パラメータ（`?c1=100x10&c2=500x5&blind=2`）→ チップ数が増えるとURLが長くなりすぎる。
**代替案 B**: サーバーサイドで短縮URL → Cloudflare Pages のみのためサーバーが必要。コスト・複雑性が増す。

### 3. QRコード生成

`qrcode` npm パッケージを使用し、チップ設定URLのQRコードをCanvas/SVGとして生成する。ShareDialog 内でQRコード画像を表示し、ダウンロードも可能にする。

**代替案**: Google Charts QR API → 外部依存であり、オフライン時に使えない。ローカル生成の方が信頼性が高い。

### 4. Web Share API とフォールバック

```typescript
async function shareResult(text: string, url: string) {
  if (navigator.share) {
    await navigator.share({ text, url })
  } else {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    toast("クリップボードにコピーしました")
  }
}
```

Web Share API はモバイルブラウザで広くサポートされている。デスクトップブラウザでは非対応の場合があるため、Clipboard API にフォールバックする。

### 5. セッションサマリーの計算

```typescript
interface SessionSummary {
  bbProfit: number       // 最後のBB - 最初のBB
  durationMinutes: number // セッション時間（分）
  snapshotCount: number   // 記録回数
}
```

スナップショットが2件以上ある場合のみシェアボタンを有効にする（1件では損益が計算できないため）。

## Risks / Trade-offs

- **[URLの長さ]** → Base64エンコードしたチップ設定が長くなる可能性がある。チップ8行程度なら200文字以内に収まる。SNSの文字数制限内で問題ない。QRコードも読み取り可能な範囲。
- **[Base64デコードの脆弱性]** → 不正なURLパラメータに対してはバリデーションを行い、パース失敗時は無視してデフォルト状態で起動する。
- **[qrcode パッケージの追加]** → バンドルサイズへの影響。動的 import で遅延読み込みすることで初期ロードへの影響を最小化する。
