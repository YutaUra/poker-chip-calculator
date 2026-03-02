## Why

現在はセッションリセット時に記録が完全に消えるため、長期的なプレイデータの蓄積ができない。通算成績を確認できることで継続利用の動機となり、ユーザーリテンションの核となる機能である。

## What Changes

- セッションリセット時に現在のセッションを localStorage にアーカイブ保存する
- セッション履歴一覧画面を追加し、過去のセッション（日付、時間、最終BB、+/- BB）を一覧表示する
- 通算サマリー表示（総セッション数、総プレイ時間、通算 +/- BB）を提供する
- セッション詳細表示で過去のグラフを閲覧できるようにする
- 個別セッションの削除機能を提供する
- localStorage の容量管理として最大50セッションを保持し、超過時に古いものから自動削除する

## Capabilities

### New Capabilities
- `session-archive`: セッションのアーカイブ保存・一覧表示・詳細閲覧・削除・容量管理に関するすべての機能を包括する。通算サマリー計算も含む。

### Modified Capabilities
- `stack-history`: セッションリセット時にアーカイブ保存を行うフローを追加する。リセット確認ダイアログにアーカイブ保存の選択肢を追加する。
- `ui`: セッション履歴一覧画面・通算サマリー・セッション詳細表示の UI を追加する。

## Impact

- **新規ファイル**: `src/lib/session-archive.ts`（アーカイブロジック・型定義）、`src/components/SessionHistoryDialog.tsx`（履歴一覧・サマリー・詳細表示）
- **変更ファイル**: `PokerChipCalculator.tsx`（リセットフローにアーカイブ保存を統合）、`src/lib/stack-history.ts`（リセット時のアーカイブ連携）
- **ストレージ**: localStorage に `session-archive` キーでアーカイブセッション配列を永続化（既存の `stack-session` とは独立）
- **依存関係**: 追加なし（既存の shadcn/ui Dialog, ScrollArea, Button で実装可能）

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 5 | 2 | 10 |
| PM-2 | 5 | 2 | 10 |
| TL-1 | 4 | 2 | 8 |
| TL-2 | 5 | 2 | 10 |
| **平均** | **4.8** | **2.0** | **9.5** |

**ティア: C** — Impact 最高(4.8) だが Ease 最低(2.0)。リテンション核機能。S/Aティアで基盤を整えてから着手推奨。

## Cross-Feature Dependencies

- **StackSnapshot 型拡張**: ante-and-m-ratio 実装後は StackSnapshot に mValue/anteAmount を含める必要がある。session-archive もこの拡張型を使うべきで、実装順序が重要（ante → multi-session-history）
- **localStorage 容量**: 最大50セッションのアーカイブは localStorage の5MB制限に対して注意が必要。各セッションのスナップショット数が多い場合、容量超過のリスクあり。stack-export（JSON エクスポート）と組み合わせて容量管理を設計すべき
- **stack-export との統合**: アーカイブデータのエクスポート/インポートを stack-export と共通設計にすべき。同時に設計することで重複実装を回避できる
- **session-share**: アーカイブされた過去セッションの結果もシェアできるようにするか検討。session-share と multi-session-history の UI 連携が必要
- **PokerChipCalculator.tsx 肥大化**: セッション履歴ダイアログの状態管理が追加される。コンポーネント分割後に着手するのが理想
- **チュートリアル**: セッション履歴機能のチュートリアルステップ追加を検討 → `TUTORIAL_VERSION` インクリメント
