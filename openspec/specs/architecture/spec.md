# Architecture Specification

## Purpose

ポーカーチップスタック計算機の技術アーキテクチャとプロジェクト構成を定義する。

## Requirements

### Requirement: SPA として構築する

アプリケーション SHALL 純粋な SPA（Single Page Application）として構築される。サーバーサイドロジックは持たない。

#### Scenario: アプリケーション起動

- **WHEN** ユーザーがアプリにアクセスした場合
- **THEN** React 19 の createRoot でクライアントサイドレンダリングが開始される

### Requirement: 指定された技術スタックを使用する

プロジェクト SHALL 以下の技術スタックを使用する:
- React 19 + TypeScript (strictest 設定) + Vite 7
- Tailwind CSS v4 + shadcn/ui (new-york スタイル)
- Radix UI (dialog, label, select, slot)
- lucide-react (アイコン)
- usehooks-ts (`useSessionStorage` で状態永続化)
- pnpm workspace 構成
- Vitest + Testing Library (テスト)

#### Scenario: ビルドと実行

- **WHEN** `pnpm dev` を実行した場合
- **THEN** Vite dev server が起動する

- **WHEN** `pnpm build` を実行した場合
- **THEN** `dist/` にプロダクションビルドが出力される

### Requirement: Cloudflare Pages にデプロイする

アプリケーション SHALL Cloudflare Pages の静的アセットホスティングにデプロイされる。

#### Scenario: デプロイ

- **WHEN** `pnpm deploy` を実行した場合
- **THEN** ビルド後に `wrangler deploy` で Cloudflare にデプロイされる

### Requirement: コンポーネント階層を維持する

アプリケーション SHALL 以下のコンポーネント階層を維持する:

```
index.html → main.tsx → App.tsx → PokerChipCalculator.tsx
  ├── UnitInputSelect (ブラインド入力)
  ├── Card > ChipIcon + Input + Button (チップリスト)
  └── Total Stack 表示

src/lib/
  ├── units.ts (Unit 型, calculateUnitValue - 共有単位定義)
  ├── chip-logic.ts (calculateTotal, calculateBB, sortChipsByValue)
  ├── format-numbers.ts (formatChipAmount, formatFullNumber)
  └── utils.ts (cn ヘルパー)
```

#### Scenario: ファイル構成

- **WHEN** 新しいコンポーネントを追加する場合
- **THEN** `src/components/` に配置し、UI プリミティブは `src/components/ui/` に配置する

### Requirement: パスエイリアスを使用する

プロジェクト SHALL `@` を `./src` へのパスエイリアスとして設定する。

#### Scenario: インポート

- **WHEN** `src/` 配下のモジュールをインポートする場合
- **THEN** `@/` プレフィックスを使用できる
