import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PokerChipCalculator from "./PokerChipCalculator"
import { TUTORIAL_VERSION, TUTORIAL_STEPS } from "@/lib/tutorial"

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 400, height: 200 }}>{children}</div>
    ),
  }
})

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})

describe("PokerChipCalculator", () => {
  describe("初期表示", () => {
    it("タイトルが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("Poker Chip Calculator")).toBeInTheDocument()
    })

    it("初期状態で Total Stack が 1K と表示される", () => {
      render(<PokerChipCalculator />)
      // 初期: 100 × 10枚 = 1,000
      expect(screen.getByText("Total Stack: 1K")).toBeInTheDocument()
      expect(screen.getByText("(1,000 chips)")).toBeInTheDocument()
    })

    it("初期状態で 10 Big Blinds と表示される（整数のため小数なし）", () => {
      render(<PokerChipCalculator />)
      // 1,000 / 100 = 10 BB
      expect(screen.getByText("(10 Big Blinds)")).toBeInTheDocument()
    })

    it("Current amount のサマリーが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText(/Current amount: 1K \(10 BB\)/)).toBeInTheDocument()
    })

    it("Chips セクションが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("Chips")).toBeInTheDocument()
    })

    it("add chip ボタンが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("add chip")).toBeInTheDocument()
    })

    it("Big Blind (BB): ラベルが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("Big Blind (BB):")).toBeInTheDocument()
    })

    it("count: ラベルが表示されない", () => {
      render(<PokerChipCalculator />)
      expect(screen.queryByText("count:")).not.toBeInTheDocument()
    })

  })

  describe("チップ追加", () => {
    it("add chip ボタンでダイアログが表示される", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("add chip"))

      expect(screen.getByText("Add Chip")).toBeInTheDocument()
      expect(screen.getByText("Amount")).toBeInTheDocument()
      expect(screen.getByText("Color")).toBeInTheDocument()
    })

    it("ダイアログのデフォルト値が amount:100, color:Red", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("add chip"))

      expect(screen.getByLabelText("Red")).toHaveAttribute("aria-pressed", "true")
    })

    it("ダイアログで Save するとチップ行が追加される", () => {
      render(<PokerChipCalculator />)

      const countInputsBefore = screen.getAllByLabelText("チップ枚数")
      const initialCount = countInputsBefore.length

      fireEvent.click(screen.getByText("add chip"))
      fireEvent.click(screen.getByText("Save"))

      const countInputsAfter = screen.getAllByLabelText("チップ枚数")
      expect(countInputsAfter.length).toBe(initialCount + 1)
    })

    it("ダイアログで Cancel するとチップは追加されない", () => {
      render(<PokerChipCalculator />)

      const countInputsBefore = screen.getAllByLabelText("チップ枚数")
      const initialCount = countInputsBefore.length

      fireEvent.click(screen.getByText("add chip"))
      fireEvent.click(screen.getByText("Cancel"))

      const countInputsAfter = screen.getAllByLabelText("チップ枚数")
      expect(countInputsAfter.length).toBe(initialCount)
    })

    it("追加されたチップは count=0 で Total に影響しない", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("add chip"))
      fireEvent.click(screen.getByText("Save"))

      // Total は変わらず 1,000
      expect(screen.getByText("Total Stack: 1K")).toBeInTheDocument()
    })
  })

  describe("チップ枚数変更", () => {
    it("枚数を変更すると Total Stack が更新される", () => {
      render(<PokerChipCalculator />)

      const chipCounter = screen.getByLabelText("チップ枚数")

      // ArrowUp を10回押して枚数を 10 → 20 に増やす
      for (let i = 0; i < 10; i++) {
        fireEvent.keyDown(chipCounter, { key: "ArrowUp" })
      }

      // 100 × 20 = 2,000
      expect(screen.getByText("Total Stack: 2K")).toBeInTheDocument()
      expect(screen.getByText("(2,000 chips)")).toBeInTheDocument()
      expect(screen.getByText("(20 Big Blinds)")).toBeInTheDocument()
    })
  })

  describe("チップ削除", () => {
    it("チップが1行のみの場合、削除ボタンは disabled", () => {
      render(<PokerChipCalculator />)

      const removeButton = screen.getByLabelText("Remove chip")
      expect(removeButton).toBeDisabled()
    })

    it("チップが2行以上の場合、削除ボタンは有効になる", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("add chip"))
      fireEvent.click(screen.getByText("Save"))

      const removeButtons = screen.getAllByLabelText("Remove chip")
      expect(removeButtons.length).toBe(2)
      for (const btn of removeButtons) {
        expect(btn).not.toBeDisabled()
      }
    })
  })

  describe("小計表示", () => {
    it("各チップ行に小計が表示される", () => {
      render(<PokerChipCalculator />)
      // 100 × 10 = 1,000 → formatChipAmount(1000) = "1K"
      expect(screen.getByText("= 1K")).toBeInTheDocument()
    })
  })

  describe("スタック記録", () => {
    it("記録ボタンが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("記録")).toBeInTheDocument()
    })

    it("Stack Graph セクションが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("Stack Graph")).toBeInTheDocument()
    })

    it("記録0件の場合プレースホルダーが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByText("記録ボタンを押してスタックを記録しましょう")).toBeInTheDocument()
    })

    it("記録ボタンを押すとプレースホルダーが消える", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("記録"))

      expect(screen.queryByText("記録ボタンを押してスタックを記録しましょう")).not.toBeInTheDocument()
    })

    it("記録ボタンを押すと取消ボタンとリセットボタンが表示される", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("記録"))

      expect(screen.getByLabelText("直前の記録を削除")).toBeInTheDocument()
      expect(screen.getByLabelText("新しいセッションを開始")).toBeInTheDocument()
    })

    it("記録0件の場合は取消・リセットボタンが表示されない", () => {
      render(<PokerChipCalculator />)

      expect(screen.queryByLabelText("直前の記録を削除")).not.toBeInTheDocument()
      expect(screen.queryByLabelText("新しいセッションを開始")).not.toBeInTheDocument()
    })

    it("取消ボタンで直前の記録が削除される", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("記録"))
      fireEvent.click(screen.getByLabelText("直前の記録を削除"))

      expect(screen.getByText("記録ボタンを押してスタックを記録しましょう")).toBeInTheDocument()
    })

    it("リセットボタンで確認ダイアログが表示される", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("記録"))
      fireEvent.click(screen.getByLabelText("新しいセッションを開始"))

      expect(screen.getByText("新しいセッションを開始")).toBeInTheDocument()
      expect(screen.getByText("リセットする")).toBeInTheDocument()
    })

    it("確認ダイアログでリセットすると記録がクリアされる", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("記録"))
      fireEvent.click(screen.getByLabelText("新しいセッションを開始"))
      fireEvent.click(screen.getByText("リセットする"))

      expect(screen.getByText("記録ボタンを押してスタックを記録しましょう")).toBeInTheDocument()
    })

    it("メモ入力欄が表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByLabelText("記録メモ")).toBeInTheDocument()
    })

    it("メモ入力後に記録するとメモ欄がクリアされる", () => {
      render(<PokerChipCalculator />)

      const memoInput = screen.getByLabelText("記録メモ")
      fireEvent.change(memoInput, { target: { value: "ダブルアップ" } })
      fireEvent.click(screen.getByText("記録"))

      expect(memoInput).toHaveValue("")
    })
  })

  describe("チュートリアル統合", () => {
    it("初回アクセス時にチュートリアルが自動表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByRole("dialog", { name: "チュートリアル" })).toBeInTheDocument()
      expect(screen.getByText(TUTORIAL_STEPS[0]!.title)).toBeInTheDocument()
    })

    it("ステップを全て進行するとチュートリアルが閉じる", () => {
      render(<PokerChipCalculator />)

      for (let i = 0; i < TUTORIAL_STEPS.length - 1; i++) {
        fireEvent.click(screen.getByText("次へ"))
      }
      fireEvent.click(screen.getByText("完了"))

      expect(screen.queryByRole("dialog", { name: "チュートリアル" })).not.toBeInTheDocument()
    })

    it("チュートリアル完了後に再レンダリングしても表示されない", () => {
      const { unmount } = render(<PokerChipCalculator />)
      fireEvent.click(screen.getByText("スキップ"))
      unmount()

      render(<PokerChipCalculator />)
      expect(screen.queryByRole("dialog", { name: "チュートリアル" })).not.toBeInTheDocument()
    })

    it("バージョン更新するとチュートリアルが再表示される", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION - 1))
      render(<PokerChipCalculator />)
      expect(screen.getByRole("dialog", { name: "チュートリアル" })).toBeInTheDocument()
    })

    it("ヘルプボタンでチュートリアルを再表示できる", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION))
      render(<PokerChipCalculator />)

      expect(screen.queryByRole("dialog", { name: "チュートリアル" })).not.toBeInTheDocument()

      fireEvent.click(screen.getByLabelText("チュートリアルを表示"))

      expect(screen.getByRole("dialog", { name: "チュートリアル" })).toBeInTheDocument()
      expect(screen.getByText(TUTORIAL_STEPS[0]!.title)).toBeInTheDocument()
    })

    it("ヘルプボタンがヘッダーに表示される", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION))
      render(<PokerChipCalculator />)
      expect(screen.getByLabelText("チュートリアルを表示")).toBeInTheDocument()
    })

    it("data-tutorial 属性が対象要素に付与されている", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION))
      render(<PokerChipCalculator />)
      expect(document.querySelector('[data-tutorial="blind-input"]')).toBeInTheDocument()
      expect(document.querySelector('[data-tutorial="chip-counter"]')).toBeInTheDocument()
      expect(document.querySelector('[data-tutorial="add-chip"]')).toBeInTheDocument()
      expect(document.querySelector('[data-tutorial="record-button"]')).toBeInTheDocument()
    })
  })

  describe("ScrollableCounter 統合", () => {
    it("チップ枚数の入力に ScrollableCounter が使用されている", () => {
      render(<PokerChipCalculator />)

      // ScrollableCounter は aria-label="チップ枚数" を持つ
      // 統合されていれば、この要素が存在するはず
      const counter = screen.getByLabelText("チップ枚数")
      expect(counter).toBeInTheDocument()
      expect(counter).toHaveAttribute("role", "spinbutton")
      expect(counter).toHaveAttribute("aria-valuenow", "10")
    })

    it("ScrollableCounter のキーボード操作で合計額が更新される", () => {
      render(<PokerChipCalculator />)

      const counter = screen.getByLabelText("チップ枚数")

      // ArrowUp を5回押して枚数を 10 → 15 に増やす
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(counter, { key: "ArrowUp" })
      }

      // 100 × 15 = 1,500 → "1.5K"
      expect(screen.getByText("Total Stack: 1.5K")).toBeInTheDocument()
      expect(screen.getByText("(1,500 chips)")).toBeInTheDocument()
      expect(screen.getByText("(15 Big Blinds)")).toBeInTheDocument()
    })
  })
})
