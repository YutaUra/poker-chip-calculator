## Why

チップ個数の入力が `<input type="number">` のテキストフィールドになっており、モバイルではキーボードが開いてしまい操作が煩雑。スクロール（スワイプ/ドラッグ）で直感的に数値を増減できるUIに変更することで、片手操作での素早い入力を実現する。

## What Changes

- チップ個数入力をテキストフィールドから、インラインのドラムロール型ピッカーに置き換える
- 数値部分を直接タッチ/ドラッグすると、そのままスクロール操作で値を増減できる（タップ→展開の2ステップではない）
- マウスホイール操作にも対応する
- 常にチップ行内にインラインで表示され、モーダルやポップアップは使用しない

## Capabilities

### New Capabilities
- `scrollable-counter`: ジョグダイアル型操作で数値（0〜999）を増減できるドラムロール風カウンターコンポーネント

### Modified Capabilities
- `ui`: チップ行の個数入力部分が `<Input type="number">` から scrollable-counter コンポーネントに変更される

## Impact

- `src/components/PokerChipCalculator.tsx`: チップ個数入力部分の差し替え
- 新規コンポーネント `src/components/ScrollableCounter.tsx` の追加
- 外部ライブラリ追加なし（タッチ/ポインターイベントはネイティブAPIを使用）
