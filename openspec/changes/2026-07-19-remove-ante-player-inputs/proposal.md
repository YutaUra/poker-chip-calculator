# Ante / Players 入力の削除

## Why

SP での実運用で Ante と Players の入力は使われておらず、画面上のノイズになっている。入力欄が減ればメイン操作（チップ入力・ブラインド設定）への集中度が上がる。

## What Changes

- Ante 入力（金額・単位）と Players 入力を UI から削除する
- 依存している M-Ratio 表示の扱いを決める（Ante 前提の計算のため、M-Ratio 表示ごと削除するのが自然）
- `use-ante.ts` / `m-ratio.ts` とそのテストを削除（M-Ratio ごと削除する場合）

## Impact

- **変更ファイル**: `src/components/PokerChipCalculator.tsx`、`src/lib/use-ante.ts`、`src/lib/m-ratio.ts`（＋各テスト）
- **注意**: M-Ratio 機能を残したい場合はデフォルト値での自動計算に切り替える選択肢もあるが、ユーザーは「使わない」と明言しているため削除方針を推奨

## Status

- [x] 実装済み（Ante / Players 入力・M-Ratio 表示・use-ante / m-ratio モジュールを削除）
