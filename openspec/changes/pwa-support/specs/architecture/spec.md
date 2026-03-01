## MODIFIED Requirements

### Requirement: 指定された技術スタックを使用する

プロジェクト SHALL 以下の技術スタックを使用する:
- React 19 + TypeScript (strictest 設定) + Vite 7
- Tailwind CSS v4 + shadcn/ui (new-york スタイル)
- Radix UI (dialog, label, select, slot)
- lucide-react (アイコン)
- usehooks-ts (`useSessionStorage` / `useLocalStorage` で状態永続化)
- Recharts 3 (折れ線グラフ)
- sonner (トースト通知)
- vite-plugin-pwa (Service Worker 生成・プリキャッシュ・マニフェスト出力)
- pnpm workspace 構成
- Vitest + Testing Library (テスト)

#### Scenario: ビルドと実行

- **WHEN** `pnpm dev` を実行した場合
- **THEN** Vite dev server が起動する

- **WHEN** `pnpm build` を実行した場合
- **THEN** `dist/` にプロダクションビルドが出力される
- **THEN** Service Worker ファイルと manifest.json が `dist/` に含まれる
