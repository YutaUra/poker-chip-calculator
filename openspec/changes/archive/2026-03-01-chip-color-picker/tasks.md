## 1. HSLカラーグリッド生成ロジック

- [x] 1.1 `src/lib/color-utils.ts` を作成し、HSL→hex 変換関数 `hslToHex(h, s, l)` を実装する
- [x] 1.2 Hue 16段階 × Lightness 16段階のカラーグリッド配列を生成する `generateColorGrid()` 関数を実装する
- [x] 1.3 hex バリデーション関数 `isValidHex(value)` を実装する（6桁hex文字列の検証）

## 2. ExtendedColorPicker コンポーネント

- [x] 2.1 `src/components/ExtendedColorPicker.tsx` を作成し、props（`color`, `onColorChange`）の型定義とコンポーネントの骨格を実装する
- [x] 2.2 HSLカラーグリッドを CSS Grid で描画する（セルサイズ最低24px、色相をX軸・明度をY軸）
- [x] 2.3 グリッドセルのクリックで `onColorChange` を呼び出し、選択状態をリングで表示する
- [x] 2.4 hex 入力フィールドを追加する（`#` プレフィックス、バリデーション付き、有効値のみ反映）
- [x] 2.5 選択色のプレビュー表示を追加する（背景色 + コントラスト付きhexテキスト）

## 3. ChipEditForm への統合

- [x] 3.1 `ChipEditForm.tsx` の `chipColors` から Gray を除外し9色にする。5×2グリッドの10番目のスロットに「+」トグルボタンを追加する
- [x] 3.2 トグル展開時に `ExtendedColorPicker` をレンダリングし、`color` と `onColorChange` を接続する
- [x] 3.3 拡張ピッカーで選択した色が既存パレットに含まれる場合はそのボタンの選択状態を連動させる

## 4. テスト

- [x] 4.1 `color-utils.ts` のユニットテストを作成する（`hslToHex`、`generateColorGrid`、`isValidHex`）
- [x] 4.2 `ExtendedColorPicker` のコンポーネントテストを作成する（グリッド描画、色選択、hex入力バリデーション）
- [x] 4.3 `ChipEditForm` のテストに拡張ピッカーの展開・折りたたみ・色選択反映のテストケースを追加する
