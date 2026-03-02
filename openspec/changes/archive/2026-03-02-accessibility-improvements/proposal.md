## Why

現在のアプリにはいくつかの a11y 課題がある。TutorialOverlay にフォーカストラップがなくオーバーレイ外の要素にフォーカスが移動できる、チップ色選択の aria-label が英語のみ、スキップリンクがない、一部のテキストコントラスト比が WCAG AA 基準を満たしていない等。WAI-ARIA 準拠を高めることでインクルーシブなアプリケーションにする。

## What Changes

- TutorialOverlay にフォーカストラップを実装し、Tab キーでオーバーレイ外に出ないようにする
- ChipIcon のチップボタンに `aria-label` を追加する（例: 「チップ: 100, 赤」）
- スキップリンク（メインコンテンツへのジャンプリンク）を追加する
- テキストと背景のコントラスト比を WCAG AA 準拠（4.5:1 以上）に改善する
- フォーカスインジケーターを視覚的に明確にする

## Capabilities

### New Capabilities
- `accessibility`: フォーカストラップ、スキップリンク、コントラスト比改善、フォーカスインジケーター強化など、アクセシビリティ全般の改善を包括する。

### Modified Capabilities
- `ui`: ChipIcon の aria-label 改善、スキップリンク追加、コントラスト比の修正など UI レベルの a11y 要件を追加する。

## Impact

- **変更ファイル**: `TutorialOverlay.tsx`（フォーカストラップ追加）、`ChipIcon.tsx`（aria-label 改善）、`PokerChipCalculator.tsx`（スキップリンク追加）、`App.tsx`（スキップリンク）
- **スタイル変更**: Tailwind CSS クラスの調整（コントラスト比改善、フォーカスリング強化）
- **依存関係**: 追加なし（フォーカストラップは自前実装）

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 3 | 4 | 12 |
| PM-2 | 2 | 3 | 6 |
| TL-1 | 3 | 4 | 12 |
| TL-2 | 3 | 3 | 9 |
| **平均** | **2.8** | **3.5** | **9.8** |

**ティア: B** — 依存追加なしで既存ファイル修正のみ。フォーカストラップの自動テストが課題。

## Cross-Feature Dependencies

- **dark-mode-toggle**: ダークモード実装後にライト/ダーク両モードでのコントラスト比を一括チェックできる。dark-mode-toggle → accessibility-improvements の実装順序が効率的
- **TutorialOverlay フォーカストラップ**: TutorialOverlay.tsx のフォーカストラップ追加は、既存のキーボードナビゲーション（Enter/→/←/Escape）との整合性を慎重に確認する必要がある。rAF ベースのスクロール追跡との相互作用にも注意
- **ChipIcon aria-label**: ChipIcon のチップボタンに `aria-label` を追加する際、builtin-presets で追加されるプリセットのチップ色定義とも一致する必要がある
- **ScrollableCounter**: 既に aria-valuenow/min/max が実装済み（PM分析時の「未実装」指摘は誤り）。追加の aria 属性が必要か再確認
- **チュートリアル**: フォーカストラップ追加時に、チュートリアルのステップナビゲーション（Tab/Enter キー）が正常に動作するか検証が必要
