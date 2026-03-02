## 1. アーカイブデータ層

- [x] 1.1 `src/lib/session-archive.ts` を作成し、`ArchivedSession`、`SessionSummary`、`OverallSummary` 型を定義する
- [x] 1.2 `Session` から `ArchivedSession` を生成する `archiveSession` 関数を実装する（サマリーの事前計算を含む）
- [x] 1.3 通算サマリーを計算する `calculateOverallSummary` 関数を実装する
- [x] 1.4 アーカイブのサマリー計算（deltaBB, peakBB 等）が正しいことを検証するテストを作成する

## 2. アーカイブ永続化

- [x] 2.1 localStorage の `session-archive` キーを使った useLocalStorage フックでのアーカイブ CRUD ロジックを実装する
- [x] 2.2 アーカイブ追加時の容量管理（最大50件、古いものから削除）を実装する
- [x] 2.3 localStorage 書き込みエラー時のエラーハンドリング（try-catch + トースト通知）を実装する
- [x] 2.4 アーカイブの保存・削除・容量管理のテストを作成する

## 3. リセットフローの変更

- [x] 3.1 `stack-history.ts` にアーカイブ保存フラグを受け取れるようリセットフローを拡張する
- [x] 3.2 リセット確認ダイアログを「保存してリセット」「保存せずリセット」「キャンセル」の3択に変更する
- [x] 3.3 `PokerChipCalculator.tsx` のリセットハンドラにアーカイブ保存ロジックを統合する

## 4. セッション履歴 UI

- [x] 4.1 `src/components/SessionHistoryDialog.tsx` を作成し、通算サマリーとセッション一覧を表示するダイアログを実装する
- [x] 4.2 セッションカードコンポーネント（日付、プレイ時間、最終BB、+/- BB 表示）を実装する
- [x] 4.3 セッション詳細の展開表示（過去の BB 推移グラフ・チップ額推移グラフ）を実装する
- [x] 4.4 セッション削除機能（確認 + 削除 + 通算サマリー再計算）を実装する

## 5. 既存コンポーネントとの統合

- [x] 5.1 Stack Graph セクションに「履歴」ボタンを追加する
- [x] 5.2 StackGraph コンポーネントに readOnly モードを追加し、過去セッションの閲覧表示に対応する
- [x] 5.3 通算サマリーの +/- BB 表示にカラーコーディング（緑/赤）を適用する
