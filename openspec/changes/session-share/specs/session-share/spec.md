## ADDED Requirements

### Requirement: セッション結果のシェアテキストを生成する

システム SHALL セッションのスナップショットからシェア用テキストを生成する。フォーマットは `Session Result: {BB損益}BB ({セッション時間}) 📊 #PokerChipCalc` とする。

- BB損益: 最後のスナップショットの bbCount - 最初のスナップショットの bbCount（正の場合は `+` を付与）
- セッション時間: 最初の recordedAt から最後の recordedAt までの経過時間を `Xh Ym` 形式で表示

#### Scenario: プラス損益のシェアテキスト生成

- **WHEN** 最初のスナップショットが 100BB、最後が 115BB、経過時間が 3時間20分の場合
- **THEN** シェアテキストは `Session Result: +15BB (3h 20m) 📊 #PokerChipCalc` となる

#### Scenario: マイナス損益のシェアテキスト生成

- **WHEN** 最初のスナップショットが 100BB、最後が 80BB、経過時間が 1時間45分の場合
- **THEN** シェアテキストは `Session Result: -20BB (1h 45m) 📊 #PokerChipCalc` となる

#### Scenario: 損益なしのシェアテキスト生成

- **WHEN** 最初と最後のスナップショットが同じ BB 値の場合
- **THEN** シェアテキストは `Session Result: 0BB ({時間}) 📊 #PokerChipCalc` となる

### Requirement: Web Share API でシェアする

システム SHALL Web Share API（navigator.share）が利用可能な場合、シェアテキストとURLをネイティブシェア機能で共有する。

#### Scenario: Web Share API 対応ブラウザでのシェア

- **WHEN** navigator.share が利用可能な環境でシェアボタンをタップした場合
- **THEN** ネイティブのシェアシートが表示され、シェアテキストとURLが渡される

#### Scenario: Web Share API 非対応ブラウザでのフォールバック

- **WHEN** navigator.share が利用できない環境でシェアボタンをタップした場合
- **THEN** シェアテキストとURLがクリップボードにコピーされる
- **THEN** トースト通知で「クリップボードにコピーしました」と表示される

### Requirement: チップ設定をURLパラメータにエンコードする

システム SHALL 現在のチップ構成とブラインド設定をBase64エンコードしたJSONとしてURLの `config` パラメータに含める。

#### Scenario: チップ設定のURLエンコード

- **WHEN** チップ設定のシェアURLを生成する場合
- **THEN** チップ構成（amount, unit, count, color）とブラインド設定（amount, unit）がJSON化され、Base64エンコードされて `?config=` パラメータに含まれる

#### Scenario: URLパラメータからのチップ設定復元

- **WHEN** `config` パラメータ付きのURLでアプリを開いた場合
- **THEN** パラメータをデコードしてチップ構成とブラインド設定を復元する

#### Scenario: 不正なURLパラメータ

- **WHEN** `config` パラメータの値が不正（デコード不可、JSON不正、スキーマ不一致）な場合
- **THEN** パラメータを無視してデフォルト状態で起動する

### Requirement: QRコードを生成する

システム SHALL チップ設定URLのQRコードを生成し、ShareDialog 内に表示する。

#### Scenario: QRコードの表示

- **WHEN** ShareDialog でQRコードタブを選択した場合
- **THEN** 現在のチップ設定URLのQRコードが表示される

#### Scenario: QRコードのダウンロード

- **WHEN** QRコードの「ダウンロード」ボタンをタップした場合
- **THEN** QRコード画像がPNGファイルとしてダウンロードされる

### Requirement: シェアボタンの有効条件

システム SHALL スナップショットが2件以上ある場合のみ結果シェアボタンを有効にする。

#### Scenario: スナップショットが1件以下

- **WHEN** セッションのスナップショットが0件または1件の場合
- **THEN** 結果シェアボタンは disabled 状態で表示される

#### Scenario: スナップショットが2件以上

- **WHEN** セッションのスナップショットが2件以上の場合
- **THEN** 結果シェアボタンが有効になる
