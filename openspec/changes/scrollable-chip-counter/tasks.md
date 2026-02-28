## 1. ScrollableCounter コンポーネント作成

- [ ] 1.1 `src/components/ScrollableCounter.tsx` を作成し、Props 型定義（value, onChange, min=0, max=999）とコンポーネントの骨格を実装する
- [ ] 1.2 3行表示（前の値・現在値・次の値）のドラムロール風UIと、グラデーションオーバーレイ・中央ハイライトバーのスタイリングを実装する
- [ ] 1.3 PointerEvent ベースのジョグダイアル操作を実装する（pointerdown で原点記録 + setPointerCapture、pointerMove で距離計算、pointerup で停止）
- [ ] 1.4 rAF ループによる速度制御を実装する（原点からの距離→速度カーブ変換、デッドゾーン、浮動小数累積→整数丸め）
- [ ] 1.5 値変化時のドラムロールアニメーション（CSS transform: translateY）を実装する

## 2. 補助操作の実装

- [ ] 2.1 マウスホイール操作で値を1ずつ増減するハンドラを実装する
- [ ] 2.2 上下矢印キーで値を1ずつ増減するキーボードハンドラを実装する
- [ ] 2.3 `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` を設定する

## 3. PokerChipCalculator への統合

- [ ] 3.1 `PokerChipCalculator.tsx` のチップ個数入力部分を `<Input>` から `<ScrollableCounter>` に差し替える
- [ ] 3.2 グリッドレイアウトを ScrollableCounter の高さ（3行分、72px程度）に合わせて調整する

## 4. テスト

- [ ] 4.1 ScrollableCounter の単体テスト（初期値表示、境界値0/999、ARIA属性、キーボード操作、onChange コールバック）を作成する
- [ ] 4.2 PokerChipCalculator の統合テスト（ScrollableCounter 操作で合計額が更新されること）を確認する
