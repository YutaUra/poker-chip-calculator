import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { useCalculatedValues } from "./use-calculated-values"
import type { ChipRow } from "./chip-logic"

function makeChip(overrides: Partial<ChipRow> & Pick<ChipRow, "amount" | "unit">): ChipRow {
  return {
    id: 1,
    count: null,
    color: "#ef4444",
    ...overrides,
  }
}

describe("useCalculatedValues", () => {
  it("空のチップ配列の場合は total=0, bbValue=0, bbDisplay='0' を返す", () => {
    const { result } = renderHook(() => useCalculatedValues([], 100, "1"))
    expect(result.current.total).toBe(0)
    expect(result.current.bbValue).toBe(0)
    expect(result.current.bbDisplay).toBe("0")
  })

  it("チップの合計額を正しく計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: 10 }),
      makeChip({ id: 2, amount: 500, unit: "1", count: 5 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, 100, "1"))
    expect(result.current.total).toBe(3500)
  })

  it("BB値を正しく計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 10 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, 100, "1"))
    expect(result.current.bbValue).toBe(10)
    expect(result.current.bbDisplay).toBe("10")
  })

  it("BB値が小数の場合は小数点1桁で表示する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 15 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, 200, "1"))
    expect(result.current.bbValue).toBe(7.5)
    expect(result.current.bbDisplay).toBe("7.5")
  })

  it("blindAmount が null の場合は bbValue=0 を返す", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 10 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, null, "1"))
    expect(result.current.bbValue).toBe(0)
    expect(result.current.bbDisplay).toBe("0")
  })

  it("blindAmount が 0 の場合は bbValue=0 を返す", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 10 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, 0, "1"))
    expect(result.current.bbValue).toBe(0)
    expect(result.current.bbDisplay).toBe("0")
  })

  it("K単位のブラインドで正しく計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 5, unit: "K", count: 3 }),
    ]
    const { result } = renderHook(() => useCalculatedValues(chips, 1, "K"))
    expect(result.current.total).toBe(15000)
    expect(result.current.bbValue).toBe(15)
    expect(result.current.bbDisplay).toBe("15")
  })
})
