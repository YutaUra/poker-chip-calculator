## Context

現在のアプリは Tailwind CSS v4 を使用しており、ダークモード用の CSS 変数（`--background`, `--foreground` 等）が定義済みである。Tailwind の `darkMode: "class"` 設定により、`<html>` 要素に `class="dark"` を付与するだけでダークモードに切り替わる仕組みが整っている。

現状はトグル UI が存在しないため、常にライトモード（またはブラウザのデフォルト）で表示されている。

既存のストレージ構成:
- `chips` → sessionStorage
- `stack-session`, `chip-presets` → localStorage
- `theme` キーは未使用

## Goals / Non-Goals

**Goals:**
- ヘッダーにダークモードトグルを配置し、ワンタップでテーマを切り替えられる
- light / dark / system の3モードをサポートする
- 選択を localStorage に永続化し、次回アクセス時に復元する
- ページ読み込み時のちらつき（FOUC）を防止する

**Non-Goals:**
- テーマカスタマイズ（カスタムカラーパレットの選択）
- テーマごとのチップカラー変更
- アニメーション付きのテーマ切り替えトランジション

## Decisions

### 1. テーマ管理方式: class ベース

Tailwind CSS v4 の `darkMode: "class"` を利用し、`<html>` 要素に `dark` クラスを付与する方式を採用する。CSS 変数は既に定義済みのため、クラスの切り替えだけでテーマが変わる。

**代替案**: `prefers-color-scheme` メディアクエリのみで制御 → ユーザーが手動でテーマを切り替えられないため却下。

### 2. 3モード: light / dark / system

localStorage に保存する値は `"light"` / `"dark"` / `"system"` の3択とする。`"system"` の場合は `window.matchMedia('(prefers-color-scheme: dark)')` の結果に従う。

初期値（localStorage に値がない場合）は `"system"` とする。OS のダークモード設定に自然に追従する。

### 3. ちらつき防止: インラインスクリプト

`index.html` の `<head>` にインラインの `<script>` を配置し、React のハイドレーション前に localStorage を読み取ってクラスを適用する。これにより、ページ読み込み時に一瞬ライトモードが表示されるちらつきを防ぐ。

```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    var isDark = theme === 'dark' ||
      (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  })();
</script>
```

**代替案**: React の useEffect でクラスを付与 → 初回レンダリング後にクラスが変わるため、ちらつきが発生する。

### 4. UI: ドロップダウンではなくトグルボタン

ヘッダーにアイコンボタンを1つ配置し、クリックで light → dark → system の順に切り替える。現在のモードをアイコンで表現する（Sun = light, Moon = dark, Monitor = system）。lucide-react の既存アイコンを使用する。

**代替案**: ドロップダウンメニュー → 3択のために DropdownMenu を導入するのはオーバーキル。ボタン1つで十分直感的。

### 5. テーマフック: useTheme

テーマ管理のロジックを `src/lib/theme.ts` に `useTheme` カスタムフックとして実装する。

```typescript
type Theme = "light" | "dark" | "system";

function useTheme(): {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}
```

`resolvedTheme` は system の場合に実際に適用されるテーマ（light or dark）を返す。`cycleTheme` は light → dark → system → light の順に切り替える。

## Risks / Trade-offs

- **[インラインスクリプトと CSP]** → Cloudflare Pages ではデフォルトで厳格な CSP を設定していないため問題なし。将来 CSP を導入する場合は nonce または hash の設定が必要。
- **[system モードの OS 設定変更追従]** → `matchMedia` の `change` イベントをリッスンする必要がある。useEffect のクリーンアップでリスナーを解除する。
