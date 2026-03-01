## Why

ポーカーは夜間や照明を落とした環境でプレイされることが多い。現在のアプリはダークモードの CSS 変数（Tailwind CSS v4 のダーク配色）が定義済みだが、トグル UI が未実装のためユーザーが手動で切り替えられない。ダークモードトグルを追加することで、環境に応じた快適な表示を提供する。

## What Changes

- **ダークモードトグルボタン**: ヘッダーに Sun/Moon アイコンのトグルボタンを追加し、ライト/ダーク/システム設定の3モードを切り替えられるようにする
- **テーマ永続化**: 選択したテーマを localStorage に保存し、次回アクセス時に復元する
- **システム設定対応**: `prefers-color-scheme` メディアクエリを監視し、「システム設定に従う」モード時に OS のテーマ変更にリアルタイムで追従する
- **初期表示のちらつき防止**: HTML の `<script>` タグで localStorage を読み取り、レンダリング前にダーククラスを適用する

## Capabilities

### New Capabilities
- `dark-mode`: テーマの切り替え、永続化、システム設定追従に関する機能を包括する

### Modified Capabilities
- `ui`: ヘッダーにダークモードトグルボタンを追加する

## Impact

- **新規ファイル**: `src/lib/theme.ts`（テーマ管理ロジック）、`src/components/ThemeToggle.tsx`（トグルボタンコンポーネント）
- **変更ファイル**: `PokerChipCalculator.tsx`（ヘッダーにトグルボタン配置）、`index.html`（ちらつき防止スクリプト追加）
- **依存関係**: 追加なし（lucide-react の Sun/Moon アイコンを使用）
- **ストレージ**: localStorage の `theme` キーにテーマ設定を保存

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 3 | 5 | 15 |
| PM-2 | 3 | 4 | 12 |
| TL-1 | 3 | 4 | 12 |
| TL-2 | 4 | 4 | 16 |
| **平均** | **3.3** | **4.3** | **13.8** |

**ティア: A** — CSS変数定義済みで実装コスト低。夜間プレイ環境の快適性に直結。

## Cross-Feature Dependencies

- **ヘッダー配置**: ヘルプボタン（`?`）の隣にダークモードトグルを配置する。ボタン順序を `[ThemeToggle] [HelpButton]` とするか逆にするか決定が必要
- **accessibility-improvements**: ダークモードのコントラスト比を WCAG AA 準拠にする必要がある。dark-mode-toggle → accessibility-improvements の順序で実装すると、ライト/ダーク両モードのコントラスト比を一括チェックできる
- **pwa-support**: PWA の `theme-color` をダークモード時に動的更新する必要があるか検討。`<meta name="theme-color" media="(prefers-color-scheme: dark)">` で対応可能
- **seo-optimization / pwa-support**: 3機能とも `index.html` を変更するため、Phase 1 で一括適用が効率的
