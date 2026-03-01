## Why

ライブポーカーでは、コール判断時にポットオッズ（pot odds = call / (pot + call)）を暗算する必要がある。特にポットが大きくなった場面やオッズが微妙なケースでは暗算ミスが頻発する。ポットオッズと必要エクイティを即座に計算・表示することで、定量的根拠に基づいたコール/フォールド判断を支援する。

## What Changes

- 「Pot Odds」セクションを追加し、トグルでON/OFF可能にする（デフォルトOFF）
- ポットサイズ入力（BB単位）を提供する
- ベット/コール額入力（BB単位）を提供する
- ポットオッズ計算: potOdds = call / (pot + call) → パーセント表示
- 必要エクイティ（= ポットオッズ）との比較表示
- 入力値とトグル状態を sessionStorage に永続化する

## Capabilities

### New Capabilities
- `pot-odds`: ポットオッズ計算ロジック、ポットサイズ・コール額の入力、ポットオッズと必要エクイティの表示、トグルON/OFFを包括する

### Modified Capabilities
（なし。独立したセクションとして追加するため、既存specの変更は不要）

## Impact

- **新規ファイル**: `src/lib/pot-odds.ts`（ポットオッズ計算ロジック）
- **変更ファイル**: `PokerChipCalculator.tsx`（Pot Odds セクションの統合、状態管理）
- **ストレージ**: sessionStorage にポットサイズ・コール額・トグル状態を追加
- **依存関係**: 追加なし

## Priority Assessment

| 評価者 | 重要度(1-5) | 難易度(1-5) | スコア |
|--------|------------|------------|--------|
| PM-1 | 4 | 3 | 12 |
| PM-2 | 3 | 3 | 9 |
| TL-1 | 4 | 4 | 16 |
| TL-2 | 3 | 3 | 9 |
| **平均** | **3.5** | **3.3** | **11.5** |

**ティア: B** — ロジックは math 関数1つで自己完結。独立セクションで既存コードへの影響ゼロ。

## Cross-Feature Dependencies

- **PokerChipCalculator.tsx 肥大化**: 新セクション追加は PokerChipCalculator.tsx にさらに状態（potSize, callAmount, potOddsEnabled）を追加する。Phase 2a でのコンポーネント分割リファクタリング後に着手するのが理想
- **effective-stack との UI 配置**: 両機能ともトグル ON/OFF の独立セクション。表示位置の一貫性（Total Stack の下に並べるか、別タブにするか）を決定する必要がある
- **sessionStorage 増加**: pot-odds 用に3キー追加。effective-stack と合わせると sessionStorage のキー数が大幅増加するため、オブジェクトにまとめる設計を検討
- **チュートリアル**: Pot Odds はデフォルト OFF のため、チュートリアルで直接言及する必要はないが、「高度な機能」セクションとして将来追加する選択肢あり
