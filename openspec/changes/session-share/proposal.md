## Why

ポーカーセッション後に結果をSNSでシェアする文化があり、バイラル獲得の最大トリガーとなる。またホームゲーム主催者がチップ設定のURLやQRコードを配布することで、参加者が同じチップ構成を即座にセットアップでき、新規ユーザー獲得につながる。

## What Changes

- セッション結果サマリーの計算ロジックを追加する（BB損益、セッション時間）
- 「結果をシェア」ボタンを追加し、シェアテキストを生成する（例: 「Session Result: +15BB (3h) #PokerChipCalc」）
- Web Share API に対応し、非対応ブラウザではクリップボードコピーにフォールバックする
- チップ設定のURLパラメータエンコード機能を実装する（`?chips=...&blind=...`）
- QRコード生成機能を追加し、ホームゲーム主催者がチップ設定URLを配布できるようにする

## Capabilities

### New Capabilities

- `session-share`: セッション結果のシェア機能全般。シェアテキスト生成、Web Share API / クリップボードフォールバック、URLパラメータエンコード/デコード、QRコード生成を包括する。

### Modified Capabilities

- `ui`: シェアボタンの配置とQRコード表示UIを追加する。
- `stack-history`: セッション結果サマリー（BB損益、セッション時間）の計算ロジックを追加する。

## Impact

- **新規ファイル**: `src/lib/session-share.ts`（シェアテキスト生成、URLエンコード/デコード）、`src/components/ShareDialog.tsx`（シェアUI、QRコード表示）
- **変更ファイル**: `src/lib/stack-history.ts`（セッションサマリー計算）、`src/components/PokerChipCalculator.tsx`（シェアボタン統合、URLパラメータ読み込み）
- **依存関係**: `qrcode` ライブラリの追加（QRコード生成用）
- **API**: Web Share API（navigator.share）、Clipboard API（navigator.clipboard.writeText）

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 4 | 2 | 8 |
| PM-2 | 5 | 3 | 15 |
| TL-1 | 3 | 2 | 6 |
| TL-2 | 3 | 2 | 6 |
| **平均** | **3.8** | **2.3** | **8.8** |

**ティア: C** — PM-2 のみ高評価(15)、TL は低評価(6)。バイラル効果は大きいが qrcode 依存追加＋複合実装でバグリスク高。

## Cross-Feature Dependencies

- **builtin-presets**: URLパラメータで読み込んだチップ設定を「プリセットとして保存」するボタンの連携が自然な UX になる。builtin-presets 実装後に session-share を実装するのが効率的
- **multi-session-history**: アーカイブされた過去セッションの結果もシェアできるようにするか検討。セッション詳細画面からの「シェア」ボタン配置
- **ante-and-m-ratio**: シェアテキストにアンティ/M値を含めるか検討。含める場合はシェアテキスト生成ロジックへの影響あり
- **pwa-support**: PWA インストール済みの場合、Web Share API のシェアシートにアプリアイコンが表示される。PWA → session-share の順で実装するとシェア体験が向上
- **URLパラメータとルーティング**: `?chips=...&blind=...` のURLパラメータは SPA のルーティングと競合しないよう設計が必要。現在はルーティングなし（単一ページ）だが、将来のルーティング追加時に破壊的変更にならないようクエリパラメータ方式を採用
- **チュートリアル**: シェア機能はチュートリアルの最終ステップ付近で紹介する価値あり → `TUTORIAL_VERSION` インクリメント
