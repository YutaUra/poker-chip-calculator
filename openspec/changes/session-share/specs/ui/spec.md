## ADDED Requirements

### Requirement: セッション結果シェアボタンを表示する

Stack Graph セクション SHALL 「シェア」ボタンを提供し、セッション結果のシェアとチップ設定の共有を可能にする。

#### Scenario: シェアボタンの配置

- **WHEN** Stack Graph セクションを表示する場合
- **THEN** セッション管理ボタン群（取消、リセット）と同じ行に「シェア」ボタンが表示される

#### Scenario: シェアボタンのタップ

- **WHEN** シェアボタンをタップした場合
- **THEN** ShareDialog が開き、結果シェアとチップ設定共有（QRコード含む）の選択肢が表示される

### Requirement: ShareDialog を提供する

システム SHALL セッション結果のシェアとチップ設定URLの共有を行う ShareDialog を提供する。

#### Scenario: ShareDialog の表示内容

- **WHEN** ShareDialog を開いた場合
- **THEN** セッション結果のシェアテキストプレビューが表示される
- **THEN** 「シェア」ボタン（Web Share API / クリップボードコピー）が表示される
- **THEN** チップ設定URLのQRコードが表示される
- **THEN** QRコードのダウンロードボタンが表示される

#### Scenario: チップ設定URLのコピー

- **WHEN** チップ設定URLの「コピー」ボタンをタップした場合
- **THEN** チップ設定URLがクリップボードにコピーされる
- **THEN** トースト通知で「URLをコピーしました」と表示される
