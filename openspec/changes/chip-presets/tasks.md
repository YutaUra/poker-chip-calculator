## 1. プリセットデータ層

- [ ] 1.1 `src/lib/presets.ts` を作成し、`PresetChip` / `ChipPreset` 型とビルトインプリセット定数（6種）を定義する
- [ ] 1.2 プリセットからチップリスト（ChipRow[]）を生成するユーティリティ関数 `loadPreset` を実装する（id の動的採番を含む）
- [ ] 1.3 ビルトインプリセットの合計額と BB 数が正しいことを検証するテストを作成する

## 2. ユーザープリセット永続化

- [ ] 2.1 localStorage の `chip-presets` キーを使った useLocalStorage フックでのユーザープリセット CRUD ロジックを実装する
- [ ] 2.2 現在のチップ構成+ブラインド設定からプリセットを生成する `saveCurrentAsPreset` 関数を実装する
- [ ] 2.3 ユーザープリセットの保存・削除・復元のテストを作成する

## 3. プリセット選択 UI

- [ ] 3.1 `src/components/PresetDialog.tsx` を作成し、ビルトインプリセット（Cash / Tournament カテゴリ別）とユーザープリセット（My Presets）を一覧表示するダイアログを実装する
- [ ] 3.2 プリセット選択時にチップリストとブラインド値を一括で上書きする処理を実装する
- [ ] 3.3 「Save Current」ボタンから名前を入力してカスタムプリセットを保存する UI フローを実装する
- [ ] 3.4 カスタムプリセットの削除ボタンを実装する（ビルトインには表示しない）

## 4. 既存コンポーネントとの統合

- [ ] 4.1 `PokerChipCalculator.tsx` の Chips セクションヘッダーに「Presets」ボタンを追加する
- [ ] 4.2 プリセット読み込み時の状態更新（chips, currentBlindAmount, currentBlindUnit）を統合する
- [ ] 4.3 nextIdRef のリセット処理をプリセット読み込みフローに組み込む
