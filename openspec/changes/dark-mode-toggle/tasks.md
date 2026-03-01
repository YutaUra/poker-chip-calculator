## 1. テーマ管理ロジック

- [ ] 1.1 `src/lib/theme.ts` を作成し、`Theme` 型（`"light" | "dark" | "system"`）と `useTheme` カスタムフックを実装する（theme, resolvedTheme, setTheme, cycleTheme）
- [ ] 1.2 `useTheme` が localStorage の `theme` キーで永続化し、`prefers-color-scheme` の変更をリアルタイムに検知することをテストする
- [ ] 1.3 `useTheme` が `<html>` 要素の `dark` クラスを適切に付与/除去することをテストする

## 2. ちらつき防止スクリプト

- [ ] 2.1 `index.html` の `<head>` にインラインスクリプトを追加し、レンダリング前に localStorage のテーマ設定に基づいて `dark` クラスを適用する

## 3. トグルボタン UI

- [ ] 3.1 `src/components/ThemeToggle.tsx` を作成し、lucide-react の Sun/Moon/Monitor アイコンを使ったトグルボタンを実装する
- [ ] 3.2 `PokerChipCalculator.tsx` のヘッダーに ThemeToggle コンポーネントを配置する
- [ ] 3.3 トグルボタンに適切な `aria-label` を設定し、アクセシビリティを確保する

## 4. 動作確認

- [ ] 4.1 light / dark / system の各モードで表示が正しく切り替わることを確認する
- [ ] 4.2 ページリロード後にテーマ設定が復元されることを確認する
