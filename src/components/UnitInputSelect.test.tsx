import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import UnitInputSelect, { calculateUnitValue, Unit } from "./UnitInputSelect"

describe("calculateUnitValue", () => {
  describe("各単位の乗数が正しい", () => {
    it.each<[Unit, number]>([
      ["1", 1],
      ["K", 1000],
      ["M", 1000000],
      ["B", 1000000000],
      ["T", 1000000000000],
    ])("単位 '%s' の乗数は %d", (unit, multiplier) => {
      expect(calculateUnitValue(1, unit)).toBe(multiplier)
    })
  })

  describe("amount と unit の乗算が正しい", () => {
    it("100 × 1 = 100", () => {
      expect(calculateUnitValue(100, "1")).toBe(100)
    })

    it("5 × K = 5,000", () => {
      expect(calculateUnitValue(5, "K")).toBe(5000)
    })

    it("2.5 × M = 2,500,000", () => {
      expect(calculateUnitValue(2.5, "M")).toBe(2500000)
    })

    it("3 × B = 3,000,000,000", () => {
      expect(calculateUnitValue(3, "B")).toBe(3000000000)
    })

    it("1.5 × T = 1,500,000,000,000", () => {
      expect(calculateUnitValue(1.5, "T")).toBe(1500000000000)
    })
  })

  describe("境界値", () => {
    it("amount が 0 の場合は 0 を返す", () => {
      expect(calculateUnitValue(0, "K")).toBe(0)
      expect(calculateUnitValue(0, "M")).toBe(0)
    })

    it("小数の amount を正しく計算する", () => {
      expect(calculateUnitValue(0.1, "K")).toBe(100)
      expect(calculateUnitValue(0.5, "1")).toBe(0.5)
    })
  })

  describe("PokerChipCalculator の計算シナリオ", () => {
    it("初期状態: チップ100×10枚, Blind100 → Total=1000, BB=10", () => {
      const chipValue = calculateUnitValue(100, "1")
      const total = chipValue * 10
      const blindValue = calculateUnitValue(100, "1")
      const bb = total / blindValue

      expect(total).toBe(1000)
      expect(bb).toBe(10)
    })

    it("複数チップ: 100×20枚 + 500×5枚, Blind200 → Total=4500, BB=22.5", () => {
      const chip1Total = calculateUnitValue(100, "1") * 20
      const chip2Total = calculateUnitValue(500, "1") * 5
      const total = chip1Total + chip2Total
      const blindValue = calculateUnitValue(200, "1")
      const bb = total / blindValue

      expect(total).toBe(4500)
      expect(bb).toBe(22.5)
    })

    it("Blind が 0 の場合、BB 計算で Infinity になる（既知の問題）", () => {
      const total = calculateUnitValue(100, "1") * 10
      const blindValue = calculateUnitValue(0, "1")

      expect(blindValue).toBe(0)
      expect(total / blindValue).toBe(Infinity)
    })
  })
})

describe("UnitInputSelect コンポーネント", () => {
  it("数値入力フィールドが表示される", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={100} unit="1" onChange={onChange} />)

    const input = screen.getByRole("spinbutton")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(100)
  })

  it("amount が null の場合、入力フィールドは空", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={null} unit="1" onChange={onChange} />)

    const input = screen.getByRole("spinbutton")
    expect(input).toHaveValue(null)
  })

  it("数値入力を変更すると onChange が呼ばれる", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={100} unit="1" onChange={onChange} />)

    const input = screen.getByRole("spinbutton")
    fireEvent.change(input, { target: { value: "200" } })

    expect(onChange).toHaveBeenCalled()
  })

  it("空文字列を入力すると onChange が {amount: null, unit} で呼ばれる", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={100} unit="1" onChange={onChange} />)

    const input = screen.getByRole("spinbutton")
    fireEvent.change(input, { target: { value: "" } })

    expect(onChange).toHaveBeenCalledWith({ amount: null, unit: "1" })
  })

  it("数値入力を変更すると onChange が {amount: number, unit} で呼ばれる", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={100} unit="1" onChange={onChange} />)

    const input = screen.getByRole("spinbutton")
    fireEvent.change(input, { target: { value: "200" } })

    expect(onChange).toHaveBeenCalledWith({ amount: 200, unit: "1" })
  })

  it("console.log が呼ばれない", () => {
    const consoleSpy = vi.spyOn(console, "log")
    const onChange = vi.fn()
    render(<UnitInputSelect amount={100} unit="1" onChange={onChange} />)

    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("placeholder が表示される", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={null} unit="1" onChange={onChange} placeholder="500" />)

    const input = screen.getByPlaceholderText("500")
    expect(input).toBeInTheDocument()
  })

  it("デフォルトの placeholder は '100'", () => {
    const onChange = vi.fn()
    render(<UnitInputSelect amount={null} unit="1" onChange={onChange} />)

    const input = screen.getByPlaceholderText("100")
    expect(input).toBeInTheDocument()
  })
})
