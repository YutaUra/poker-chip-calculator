## 1. 依存関係とセットアップ

- [ ] 1.1 Recharts をインストールする (`pnpm add recharts`)
- [ ] 1.2 `src/lib/stack-history.ts` にデータ型定義 (StackSnapshot, Session) を作成する

## 2. スタック記録ロジック (src/lib/stack-history.ts)

- [ ] 2.1 `createSnapshot()` — 現在のスタック情報からスナップショットを生成する純粋関数を実装する
- [ ] 2.2 `addSnapshot()` / `removeLastSnapshot()` — セッションへのスナップショット追加・直前削除の純粋関数を実装する
- [ ] 2.3 `updateSnapshotMemo()` — スナップショットにメモを追加/編集する純粋関数を実装する
- [ ] 2.4 `createSession()` / `resetSession()` — セッション管理の純粋関数を実装する
- [ ] 2.5 `src/lib/stack-history.test.ts` — 上記すべての関数のユニットテストを TDD で作成する

## 3. localStorage 永続化

- [ ] 3.1 `useLocalStorage` フック（usehooks-ts）でセッションデータの読み書きを実装する
- [ ] 3.2 localStorage への保存・復元のテストを作成する

## 4. グラフコンポーネント (src/components/StackGraph.tsx)

- [ ] 4.1 Recharts の LineChart / Line / XAxis / YAxis / Tooltip / ReferenceLine を使って BB 推移グラフを実装する
- [ ] 4.2 チップ額推移グラフを実装し、BB グラフの下に縦並びで配置する
- [ ] 4.3 各グラフのツールチップに記録番号、時刻、BB値、チップ額、メモを表示する
- [ ] 4.4 各グラフに開始スタックの水平基準線（ReferenceLine）を実装する
- [ ] 4.5 記録0件のプレースホルダー表示を実装する
- [ ] 4.6 `src/components/StackGraph.test.tsx` — コンポーネントテストを作成する

## 5. PokerChipCalculator への統合

- [ ] 5.1 「グラフに記録」ボタンを追加し、クリック時に createSnapshot → addSnapshot を呼び出す
- [ ] 5.2 StackGraph コンポーネントを Chips セクションの下に配置する
- [ ] 5.3 「新しいセッションを開始」ボタンと確認ダイアログを実装する
- [ ] 5.4 直前の記録を削除するボタンを実装する
- [ ] 5.5 記録時のトースト通知（「記録しました (#N)」）を実装する
- [ ] 5.6 `src/components/PokerChipCalculator.test.tsx` — 既存テストが壊れていないことを確認し、新機能のテストを追加する

## 6. openspec 仕様更新

- [ ] 6.1 `openspec/specs/` 配下の architecture, ui spec を更新して新しいコンポーネントと依存関係を反映する
