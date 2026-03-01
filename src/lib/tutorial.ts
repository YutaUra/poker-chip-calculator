export const TUTORIAL_VERSION = 1

export interface TutorialStep {
  id: string
  selector: string | null
  title: string
  description: string
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    selector: null,
    title: "Poker Chip Calculator へようこそ！",
    description:
      "このアプリはポーカーのチップスタックを簡単に計算できるツールです。主な機能をご紹介します。",
  },
  {
    id: "blind-input",
    selector: '[data-tutorial="blind-input"]',
    title: "ブラインド設定",
    description:
      "Big Blind の金額を設定します。ここの値を元に、スタックが何 BB かを自動計算します。",
  },
  {
    id: "chip-counter",
    selector: '[data-tutorial="chip-counter"]',
    title: "チップ枚数の操作",
    description:
      "上下にドラッグまたはスクロールでチップの枚数を変更できます。",
  },
  {
    id: "add-chip",
    selector: '[data-tutorial="add-chip"]',
    title: "チップの追加",
    description:
      "新しい額面のチップを追加できます。額面・色を自由にカスタマイズできます。",
  },
  {
    id: "record-button",
    selector: '[data-tutorial="record-button"]',
    title: "スタックの記録",
    description:
      "現在のスタックをグラフに記録します。セッション中のスタック推移を可視化できます。",
  },
]
