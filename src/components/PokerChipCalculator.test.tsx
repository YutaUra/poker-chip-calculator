import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PokerChipCalculator from "./PokerChipCalculator"

beforeEach(() => {
  sessionStorage.clear()
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

    it("チップ count 入力に qty プレースホルダーが表示される", () => {
      render(<PokerChipCalculator />)
      expect(screen.getByPlaceholderText("qty")).toBeInTheDocument()
    })
  })

  describe("チップ追加", () => {
    it("add chip ボタンでチップ行が追加される", () => {
      render(<PokerChipCalculator />)

      const countInputsBefore = screen.getAllByRole("spinbutton")
      const initialCount = countInputsBefore.length

      fireEvent.click(screen.getByText("add chip"))

      const countInputsAfter = screen.getAllByRole("spinbutton")
      expect(countInputsAfter.length).toBe(initialCount + 1)
    })

    it("追加されたチップは count=0 で Total に影響しない", () => {
      render(<PokerChipCalculator />)

      fireEvent.click(screen.getByText("add chip"))

      // Total は変わらず 1,000
      expect(screen.getByText("Total Stack: 1K")).toBeInTheDocument()
    })
  })

  describe("チップ枚数変更", () => {
    it("枚数を変更すると Total Stack が更新される", () => {
      render(<PokerChipCalculator />)

      // 初期チップの count 入力を取得（最初の spinbutton がブラインド、その次がチップ count）
      const spinbuttons = screen.getAllByRole("spinbutton")
      // ブラインド入力の次にチップの count 入力がある
      const chipCountInput = spinbuttons.find(
        input => (input as HTMLInputElement).value === "10"
      )
      expect(chipCountInput).toBeDefined()

      fireEvent.change(chipCountInput!, { target: { value: "20" } })

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
})
