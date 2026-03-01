## Why

現在のチップカラーパレットは10色固定（Red, Blue, Green, Purple, Yellow, Pink, Orange, Gray, White, Black）であり、実際のポーカーチップセットの色に合わせた細かい色合い調整ができない。ユーザーが手持ちのチップセットに近い色を選べるよう、より広いカラーバリエーションから色をピックできるようにする。

## What Changes

- プリセットカラーを9色に変更（Gray を除外: Red, Blue, Green, Purple, Yellow, Pink, Orange, White, Black）
- 5×2グリッドの10番目のスロットに「+」ボタンを配置し、拡張カラーピッカーを開く導線とする
- 拡張カラーピッカーでは、HSL ベースのカラーグリッド（約256色）からの選択と、任意の hex 値の直接入力を提供する
- `getTextColor()` はそのまま任意の hex 値に対応済みのため変更不要

## Capabilities

### New Capabilities
- `extended-color-picker`: 拡張カラーピッカーUI。HSLベースのカラーグリッド表示、hex値入力、選択色のプレビューを提供する

### Modified Capabilities
- `ui`: チップ編集ダイアログのカラーパレットセクションに拡張カラーピッカーへの導線を追加

## Impact

- `src/components/ChipEditForm.tsx` - カラーパレット部分に拡張ピッカーへの導線を追加
- 新規コンポーネント `ExtendedColorPicker.tsx` を作成
- 既存のデータ構造（`ChipRow.color: string`）は hex 文字列なので変更不要
- プリセット・sessionStorage との互換性も影響なし
