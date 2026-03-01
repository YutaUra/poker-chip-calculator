## ADDED Requirements

### Requirement: セッションデータを CSV 形式でエクスポートする

システム SHALL 現在のセッションのスナップショットデータを CSV ファイルとしてダウンロードする機能を提供する。

CSV フォーマット:
- ヘッダー行: `Record,Timestamp,BB Value,Total Chips,Blind Amount,Blind Unit,Memo`
- タイムスタンプ: ISO 8601 形式
- メモ: null の場合は空文字。カンマを含む場合はダブルクォートで囲む
- エンコーディング: UTF-8 BOM 付き

#### Scenario: CSV エクスポート

- **WHEN** スナップショットが1件以上存在する状態で CSV エクスポートを実行した場合
- **THEN** `poker-session-{YYYY-MM-DD}.csv` がダウンロードされる
- **THEN** ファイルにはヘッダー行とスナップショット数分のデータ行が含まれる

#### Scenario: メモにカンマが含まれる場合

- **WHEN** メモに「Won big pot, moved tables」のようにカンマが含まれるスナップショットをエクスポートした場合
- **THEN** メモフィールドがダブルクォートで囲まれる

#### Scenario: スナップショットが0件の場合

- **WHEN** スナップショットが0件の状態でエクスポートを試みた場合
- **THEN** エクスポートボタンは disabled であり、操作できない

### Requirement: セッションデータを JSON 形式でエクスポートする

システム SHALL 現在のセッションデータを JSON ファイルとしてダウンロードする機能を提供する。

JSON フォーマット:
- `version`: フォーマットバージョン（現在は `1`）
- `exportedAt`: エクスポート日時（ISO 8601）
- `session`: Session オブジェクト（id, startedAt, snapshots）

#### Scenario: JSON エクスポート

- **WHEN** スナップショットが1件以上存在する状態で JSON エクスポートを実行した場合
- **THEN** `poker-session-{YYYY-MM-DD}.json` がダウンロードされる
- **THEN** ファイルに version, exportedAt, session が含まれる

#### Scenario: エクスポート JSON の再インポート可能性

- **WHEN** エクスポートした JSON ファイルをインポートした場合
- **THEN** 元のセッションデータが完全に復元される

### Requirement: JSON ファイルからセッションデータをインポートする

システム SHALL JSON ファイルからセッションデータを読み込み、現在のセッションに復元する機能を提供する。

#### Scenario: 正常なインポート

- **WHEN** 有効な JSON ファイルを選択した場合
- **THEN** 確認ダイアログが表示される
- **WHEN** 確認ダイアログで承認した場合
- **THEN** 現在のセッションがインポートデータで上書きされる

#### Scenario: インポートのキャンセル

- **WHEN** 確認ダイアログでキャンセルした場合
- **THEN** 現在のセッションは変更されない

#### Scenario: 無効な JSON ファイル

- **WHEN** JSON として解析できないファイルを選択した場合
- **THEN** トースト通知で「ファイルの形式が正しくありません」と表示される
- **THEN** 現在のセッションは変更されない

#### Scenario: バージョン不一致

- **WHEN** version フィールドがサポート外の値のファイルを選択した場合
- **THEN** トースト通知で「サポートされていないバージョンです」と表示される

#### Scenario: 必須フィールド不足

- **WHEN** session や snapshots の必須フィールドが欠けたファイルを選択した場合
- **THEN** トースト通知で「データの形式が正しくありません」と表示される

### Requirement: インポートデータをバリデーションする

システム SHALL インポートされた JSON データの構造と値を検証する。

バリデーション項目:
- `version` フィールドの存在と値（`1` のみ許容）
- `session` オブジェクトの存在
- `session.id`（string）、`session.startedAt`（number）の存在
- `session.snapshots` が配列であること
- 各 snapshot の必須フィールド: id, recordNumber, timestamp, totalChips, bbValue, blindAmount, blindUnit
- `blindUnit` が有効な Unit 型の値であること

#### Scenario: すべてのフィールドが有効

- **WHEN** すべての必須フィールドが正しい型と値を持つファイルをバリデーションした場合
- **THEN** バリデーションは成功する

#### Scenario: snapshots が空配列

- **WHEN** snapshots が空配列のファイルをバリデーションした場合
- **THEN** バリデーションは成功する（空セッションのインポートは許容）

#### Scenario: blindUnit が無効な値

- **WHEN** blindUnit が "1", "K", "M", "B", "T" 以外の値を持つスナップショットが含まれる場合
- **THEN** バリデーションは失敗する
