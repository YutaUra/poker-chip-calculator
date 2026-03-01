## Why

「add chip」ボタンを押すとデフォルト値（amount:1, unit:"1", color:"#6b7280"）のチップが追加され、その後 ChipIcon をタップして編集する必要がある。どうせ設定する内容なので、追加時にダイアログでチップサイズと色を指定できるようにし、操作ステップを削減する。

## What Changes

- 「add chip」ボタンのクリック時に、チップの金額・単位・色を設定するダイアログを表示する
- ダイアログで Save すると設定済みのチップが追加される
- Cancel でチップは追加されない
- ChipIcon の既存編集ダイアログとUI部品（UnitInputSelect、カラーパレット）を再利用する

## Capabilities

### New Capabilities

（なし — 既存の UI capability の変更のみ）

### Modified Capabilities

- `ui`: 「add chip」ボタンの挙動をダイアログ表示に変更

## Impact

- `src/components/PokerChipCalculator.tsx` — addChip ロジックをダイアログ経由に変更
- `src/components/ChipIcon.tsx` — カラーパレットや編集UIの共通化を検討
- 既存テスト — add chip の挙動変更に伴うテスト修正
