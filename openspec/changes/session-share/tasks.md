## 1. セッションサマリー計算

- [ ] 1.1 `src/lib/stack-history.ts` に `SessionSummary` 型と `calculateSessionSummary` 関数を実装する（BB損益、セッション時間、記録回数）
- [ ] 1.2 セッションサマリー計算のテストを作成する（プラス損益、マイナス損益、損益なし、スナップショット不足の各ケース）

## 2. シェアテキスト生成

- [ ] 2.1 `src/lib/session-share.ts` を作成し、`generateShareText` 関数を実装する（`Session Result: {損益}BB ({時間}) 📊 #PokerChipCalc` 形式）
- [ ] 2.2 シェアテキスト生成のテストを作成する

## 3. URLパラメータエンコード/デコード

- [ ] 3.1 `src/lib/session-share.ts` に `encodeChipConfig` / `decodeChipConfig` 関数を実装する（Base64 JSON エンコード/デコード）
- [ ] 3.2 URLパラメータのバリデーションを実装する（不正なパラメータは無視してデフォルト状態で起動）
- [ ] 3.3 エンコード/デコードのテストを作成する（正常系、不正データ）

## 4. Web Share API / クリップボードフォールバック

- [ ] 4.1 `src/lib/session-share.ts` に `shareResult` 関数を実装する（Web Share API 対応 / Clipboard API フォールバック）

## 5. QRコード生成

- [ ] 5.1 `qrcode` パッケージを依存に追加する
- [ ] 5.2 チップ設定URLからQRコードを生成するユーティリティを実装する（動的 import で遅延読み込み）

## 6. ShareDialog UI

- [ ] 6.1 `src/components/ShareDialog.tsx` を作成し、シェアテキストプレビュー、シェアボタン、QRコード表示、URLコピーボタンを実装する
- [ ] 6.2 QRコードのPNGダウンロード機能を実装する

## 7. 既存コンポーネントとの統合

- [ ] 7.1 `PokerChipCalculator.tsx` の Stack Graph セクションにシェアボタンを追加する（スナップショット2件以上で有効化）
- [ ] 7.2 アプリ起動時に URL の `config` パラメータを読み取り、チップ構成とブラインド設定を復元する処理を実装する
