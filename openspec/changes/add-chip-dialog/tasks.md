## 1. ChipEditForm の抽出

- [ ] 1.1 ChipIcon.tsx からチップ編集フォーム（金額入力 + カラーパレット）を `ChipEditForm` コンポーネントとして抽出する
- [ ] 1.2 ChipIcon.tsx を `ChipEditForm` を使うようにリファクタリングし、既存テスト 24 件が通ることを確認する

## 2. チップ追加ダイアログの実装

- [ ] 2.1 PokerChipCalculator にチップ追加ダイアログ（Dialog + ChipEditForm）を実装する
- [ ] 2.2 「add chip」ボタンのクリックでダイアログを表示し、Save で設定済みチップを追加するロジックを実装する
- [ ] 2.3 Cancel でチップが追加されないことを確認する

## 3. テスト

- [ ] 3.1 PokerChipCalculator.test.tsx の「add chip ボタンでチップ行が追加される」テストをダイアログ経由に修正する
- [ ] 3.2 ダイアログで金額・色を設定して Save するとチップが追加されるテストを追加する
- [ ] 3.3 ダイアログで Cancel するとチップが追加されないテストを追加する
- [ ] 3.4 全テストが通ることを確認する
