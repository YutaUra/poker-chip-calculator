# 共有時に Stack Graph 画像が共有されない問題の調査・修正

## Why

「共有で graph を共有できるようにして欲しかった」というフィードバック。実装上は ShareDialog に graph 画像添付機能が存在する（`capture-graph.ts` → `navigator.share` の files）が、ユーザーの SP 環境では graph が共有されていない。実装と体験が乖離しており、原因調査が必要。

## What Changes

- SP（特に iOS Safari）で graph 画像が共有に含まれない原因を調査する。疑わしい箇所:
  - `navigator.canShare({ files })` が false になり画像が黙って落ちる（`share-result.ts`）
  - `captureGraphImage` の失敗（html2canvas と recharts の SVG 互換性）が silent に握りつぶされている
  - 共有時に graph が未記録（stack history が空）で画像が生成されないケース
- 画像を添付できない場合はユーザーに分かるようにする（silent fallback をやめる）
- 修正とあわせて該当ケースのテストを追加する

## Impact

- **変更ファイル**: `src/lib/share-result.ts`、`src/lib/capture-graph.ts`、`src/components/ShareDialog.tsx`（＋テスト）

## Status

- [ ] 未着手（backlog）
