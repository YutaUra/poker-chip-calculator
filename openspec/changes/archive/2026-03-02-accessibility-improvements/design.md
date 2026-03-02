## Context

現在のアプリの a11y 状態:
- ScrollableCounter: `role="spinbutton"`, `aria-valuenow/min/max`, キーボード操作（ArrowUp/Down）は実装済み
- ChipIcon: `title` 属性はあるが `aria-label` がなく、スクリーンリーダーでチップの色情報が伝わらない
- TutorialOverlay: `role="dialog"`, `aria-modal="true"`, `aria-label` は設定済みだが、フォーカストラップが未実装
- カラーパレット: 各色ボタンに `aria-label`（"Red" 等、英語）と `aria-pressed` は設定済み
- スキップリンク: 未実装
- コントラスト比: `text-muted-foreground/40` 等、低コントラストのテキストが存在

## Goals / Non-Goals

**Goals:**
- TutorialOverlay にフォーカストラップを実装する
- ChipIcon にチップの額面と色を含む `aria-label` を設定する
- スキップリンクでメインコンテンツへジャンプできるようにする
- 低コントラストのテキストを WCAG AA 基準（4.5:1）に改善する
- フォーカスインジケーターを明確にする

**Non-Goals:**
- スクリーンリーダーでの完全なテスト（手動テストは範囲外、仕様レベルでの対応）
- WCAG AAA 準拠（AA 準拠をターゲット）
- 既存の shadcn/ui コンポーネント内部の a11y 修正
- 色覚多様性への対応（チップの色名ラベルで対応済み）

## Decisions

### 1. フォーカストラップの実装方法

TutorialOverlay 内でフォーカス可能な要素を取得し、Tab キーで巡回する。ダイアログが開いた時にポップオーバー内の最初のフォーカス可能な要素（「次へ」ボタン）にフォーカスを移す。

```typescript
function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const container = ref.current
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [ref, active])
}
```

**代替案**: `focus-trap-react` ライブラリ → 依存追加を避けたい。TutorialOverlay のフォーカス可能要素は少数（ボタン3-4個）のため、自前実装で十分。

### 2. ChipIcon の aria-label

チップボタンの `aria-label` に額面と色名を含める。色名は hex → 日本語名のマッピングテーブルで変換する。

```typescript
const COLOR_NAMES: Record<string, string> = {
  "#ef4444": "赤",
  "#3b82f6": "青",
  "#22c55e": "緑",
  "#a855f7": "紫",
  "#eab308": "黄",
  "#ec4899": "ピンク",
  "#f97316": "オレンジ",
  "#6b7280": "グレー",
  "#e5e7eb": "白",
  "#1f2937": "黒",
}
```

aria-label 例: 「チップ: 100, 赤」「チップ: 5K, 緑」

### 3. スキップリンク

ページの最上部に非表示のリンクを配置し、フォーカス時に表示する。リンク先はメインコンテンツ領域（`<main id="main-content">`）。

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute ...">
  メインコンテンツへスキップ
</a>
```

### 4. コントラスト比の改善

問題箇所と対応:
- ScrollableCounter の前後の数値（`text-muted-foreground/40`）→ `text-muted-foreground/60` に変更
- Stack Graph セクションの薄いテキスト → コントラスト比 4.5:1 以上になるよう調整

### 5. フォーカスインジケーター

`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` を主要なインタラクティブ要素に追加する。ScrollableCounter, ChipIcon ボタン等。

## Risks / Trade-offs

- **[フォーカストラップとキーボードショートカットの競合]** → TutorialOverlay は既に Escape/Enter/ArrowLeft/ArrowRight のキーボードハンドラを持つ。Tab キーのフォーカストラップとは干渉しない。
- **[色名マッピングの網羅性]** → デフォルトの10色のみ対応。カスタムカラーピッカーで選んだ色は「カスタム」とする。
- **[コントラスト比変更による視覚的影響]** → 薄い補助テキストが少し目立つようになるが、a11y の観点でトレードオフとして許容する。
