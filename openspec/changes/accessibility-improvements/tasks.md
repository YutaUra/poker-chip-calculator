## 1. フォーカストラップ

- [ ] 1.1 `useFocusTrap` カスタムフックを作成する（ref と active フラグを受け取り、Tab/Shift+Tab でフォーカスを巡回させる）
- [ ] 1.2 `TutorialOverlay.tsx` に `useFocusTrap` を統合し、ダイアログ表示時にポップオーバー内にフォーカスを閉じ込める
- [ ] 1.3 フォーカストラップの動作テストを作成する（Tab での巡回、Shift+Tab での逆巡回、自動フォーカス）

## 2. ChipIcon の aria-label 改善

- [ ] 2.1 hex カラーコードから日本語色名へのマッピング定数 `COLOR_NAMES` を定義する（10色 + カスタムフォールバック）
- [ ] 2.2 `ChipIcon.tsx` のボタンに `aria-label` を追加する（「チップ: {短縮額面}, {色名}」形式）
- [ ] 2.3 aria-label が正しく生成されることを検証するテストを作成する（デフォルト色、カスタム色、短縮表記）

## 3. スキップリンク

- [ ] 3.1 `PokerChipCalculator.tsx` のメインコンテンツ領域に `id="main-content"` を追加する
- [ ] 3.2 `App.tsx` にスキップリンク（`sr-only focus:not-sr-only` スタイル）を追加する
- [ ] 3.3 スキップリンクのフォーカス表示と動作を検証するテストを作成する

## 4. コントラスト比の改善

- [ ] 4.1 ScrollableCounter の前後の数値のテキスト色を `text-muted-foreground/40` から `text-muted-foreground/60` に変更する
- [ ] 4.2 その他の低コントラストテキスト（セクション補助テキスト等）を調査し、4.5:1 以上に調整する

## 5. フォーカスインジケーター

- [ ] 5.1 ScrollableCounter に `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` を追加する
- [ ] 5.2 ChipIcon ボタンに `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` を追加する
- [ ] 5.3 その他の主要なインタラクティブ要素（記録ボタン、リセットボタン等）のフォーカスリングを確認・追加する
