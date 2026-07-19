# Stack Graph 右のアクションボタンが画面幅からはみ出るバグ修正

## Why

SP 表示で Stack Graph の右側にあるアクションボタンが画面幅からはみ出ており、押しにくい／見切れている。レイアウトバグ。

## What Changes

- Stack Graph セクションのレイアウトを修正し、狭い画面幅でもアクションボタンが収まるようにする
- 原因調査: グラフ（recharts）の固定幅 or flex レイアウトの `min-width` 未指定が典型原因
- 回帰防止のため、狭幅レイアウトを検証するテストを追加する

## Impact

- **変更ファイル**: `src/components/StackGraph.tsx` / `src/components/StackRecordSection.tsx`（＋テスト）

## Status

- [ ] 未着手（backlog）
