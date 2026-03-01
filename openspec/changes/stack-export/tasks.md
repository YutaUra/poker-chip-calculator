## 1. エクスポートロジック

- [ ] 1.1 `src/lib/data-export.ts` を作成し、エクスポート/インポート関連の型を定義する
- [ ] 1.2 StackSnapshot 配列を CSV 文字列に変換する `exportToCSV` 関数を実装する（UTF-8 BOM 付き、カンマ含みメモのエスケープ対応）
- [ ] 1.3 Session を JSON エクスポート形式に変換する `exportToJSON` 関数を実装する（version, exportedAt, session）
- [ ] 1.4 Blob + URL.createObjectURL でファイルダウンロードをトリガーする `downloadFile` ユーティリティを実装する
- [ ] 1.5 CSV エクスポートのフォーマットが正しいことを検証するテストを作成する（ヘッダー行、日付形式、メモエスケープ）

## 2. インポートロジック

- [ ] 2.1 JSON インポートデータのバリデーション関数 `validateImportData` を実装する（version, session 構造, blindUnit の検証）
- [ ] 2.2 バリデーション済み JSON から Session オブジェクトを復元する `importFromJSON` 関数を実装する
- [ ] 2.3 バリデーションの成功・失敗パターンのテストを作成する（正常データ、不正 version、欠損フィールド、不正 blindUnit）

## 3. エクスポート UI

- [ ] 3.1 Stack Graph セクションに「Export」ドロップダウンボタンを追加する（CSV / JSON の2択）
- [ ] 3.2 記録が0件の場合に Export ボタンを disabled にする制御を実装する
- [ ] 3.3 エクスポート実行時のファイル名生成（`poker-session-{YYYY-MM-DD}`）を実装する

## 4. インポート UI

- [ ] 4.1 Stack Graph セクションに「Import」ボタンを追加し、隠し file input（accept=".json"）と連携する
- [ ] 4.2 ファイル選択後の確認ダイアログ（「現在のセッションを上書きしますか？」）を実装する
- [ ] 4.3 インポート成功時のトースト通知とエラー時のトースト通知を実装する

## 5. 既存コンポーネントとの統合

- [ ] 5.1 `PokerChipCalculator.tsx` にエクスポート/インポートハンドラを統合する
- [ ] 5.2 インポート時の状態更新（session の上書き + localStorage への書き込み）を実装する
