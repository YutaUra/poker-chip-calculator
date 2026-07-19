# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

ポーカーチップスタック計算機。React 19 + Vite + Tailwind CSS 4 の SPA を PWA 化し、Cloudflare Workers（静的アセット）にデプロイする。バックエンドはなく、全状態はブラウザストレージに保存される。UI テキストは日本語。

## コマンド

```sh
pnpm dev          # 開発サーバー（vite dev）
pnpm build        # ビルド（dist/ へ出力）
pnpm test         # 全テスト実行（vitest run）
pnpm test:watch   # watch モード
pnpm vitest run src/lib/chip-logic.test.ts   # 単一ファイルのテスト
pnpm deploy       # ビルドして wrangler deploy
```

テスト環境は jsdom + Testing Library（`src/test-setup.ts` でセットアップ）。lint スクリプトは未定義。

## アーキテクチャ

- `src/components/PokerChipCalculator.tsx` がルート画面。状態はほぼすべて `src/lib/use-*.ts` のカスタムフック（useChips / useBlind / useAnte / useStackSession / usePresets / useTutorial / useSessionArchive など）に分離されている。
- `src/lib/` の非フックモジュールは純粋ロジック（chip-logic, m-ratio, format-numbers, units, presets, session-archive など）で、フックはこれらを包んで永続化と React 状態を担う。ロジック追加はまず `src/lib/` に純粋関数として書き、フック経由で UI に繋ぐのがパターン。
- 永続化は `src/lib/storage-keys.ts` に集約されたキーで、チップ・ブラインドは sessionStorage、セッション履歴・プリセット・チュートリアル状態は localStorage。
- `src/components/ui/` は shadcn/ui 由来のコンポーネント（Radix ベース）で、カバレッジ対象外。それ以外のコンポーネント・lib はすべてテストとペア（`*.test.ts(x)` 同居）になっており、変更時はテストも更新する（TDD 前提）。
- Stack Graph（recharts）の画像共有は html2canvas によるキャプチャ（`capture-graph.ts` / `share-result.ts`）。ハプティクスは `src/lib/haptic/`（iOS Safari 対応のため @ncdai/haptic を使用）。
- パスエイリアス `@/` → `src/`。TypeScript は `@tsconfig/strictest`。

## OpenSpec

`openspec/` に仕様（specs/）と変更提案（changes/）を管理している。機能追加時は openspec のワークフロー（opsx:propose → apply → archive skill）が利用可能。
