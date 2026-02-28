import { describe, it, expect } from "vitest"
import { calculateTotal, calculateBB, sortChipsByValue, ChipRow } from "./chip-logic"

function makeChip(overrides: Partial<ChipRow> & Pick<ChipRow, "amount" | "unit">): ChipRow {
  return {
    id: 1,
    count: null,
    color: "#ef4444",
    ...overrides,
  }
}

describe("calculateTotal", () => {
  it("空配列の場合は0を返す", () => {
    expect(calculateTotal([])).toBe(0)
  })

  it("チップ1種類の合計を計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 10 }),
    ]
    expect(calculateTotal(chips)).toBe(1000)
  })

  it("複数チップの合計を計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: 20 }),
      makeChip({ id: 2, amount: 500, unit: "1", count: 5 }),
    ]
    expect(calculateTotal(chips)).toBe(4500)
  })

  it("異なる単位のチップを合算できる", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 1, unit: "K", count: 5 }),   // 5,000
      makeChip({ id: 2, amount: 500, unit: "1", count: 10 }), // 5,000
    ]
    expect(calculateTotal(chips)).toBe(10000)
  })

  it("K単位のチップを正しく計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 5, unit: "K", count: 3 }),
    ]
    expect(calculateTotal(chips)).toBe(15000)
  })

  it("M単位のチップを正しく計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 2, unit: "M", count: 4 }),
    ]
    expect(calculateTotal(chips)).toBe(8000000)
  })

  it("count が null のチップは 0 として扱う", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: null }),
      makeChip({ id: 2, amount: 500, unit: "1", count: 5 }),
    ]
    expect(calculateTotal(chips)).toBe(2500)
  })

  it("count が 0 のチップは合計に影響しない", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: 0 }),
      makeChip({ id: 2, amount: 500, unit: "1", count: 5 }),
    ]
    expect(calculateTotal(chips)).toBe(2500)
  })

  it("大量のチップでも正確に計算する", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1", count: 99999 }),
    ]
    expect(calculateTotal(chips)).toBe(9999900)
  })

  it("全チップの count が null の場合は 0 を返す", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: null }),
      makeChip({ id: 2, amount: 500, unit: "1", count: null }),
    ]
    expect(calculateTotal(chips)).toBe(0)
  })
})

describe("calculateBB", () => {
  it("Total / Blind でBB数を計算する", () => {
    expect(calculateBB(1000, 100, "1")).toBe(10)
  })

  it("小数点以下のBBを正確に計算する", () => {
    expect(calculateBB(4500, 200, "1")).toBe(22.5)
  })

  it("ブラインドがK単位の場合も正しく計算する", () => {
    // 15000 / (1 × 1000) = 15
    expect(calculateBB(15000, 1, "K")).toBe(15)
  })

  it("ブラインドがM単位の場合も正しく計算する", () => {
    // 5000000 / (1 × 1000000) = 5
    expect(calculateBB(5000000, 1, "M")).toBe(5)
  })

  it("blindAmount が 0 の場合は 0 を返す", () => {
    expect(calculateBB(1000, 0, "1")).toBe(0)
  })

  it("blindAmount が null の場合は 0 を返す", () => {
    expect(calculateBB(1000, null, "1")).toBe(0)
  })

  it("total が 0 の場合は 0 を返す", () => {
    expect(calculateBB(0, 100, "1")).toBe(0)
  })

  it("total と blind が同じ場合は 1 を返す", () => {
    expect(calculateBB(100, 100, "1")).toBe(1)
  })

  it("大きな BB 値を正確に計算する", () => {
    expect(calculateBB(9999900, 100, "1")).toBe(99999)
  })
})

describe("sortChipsByValue", () => {
  it("空配列はそのまま返す", () => {
    expect(sortChipsByValue([])).toEqual([])
  })

  it("1要素の配列はそのまま返す", () => {
    const chips: ChipRow[] = [
      makeChip({ amount: 100, unit: "1" }),
    ]
    expect(sortChipsByValue(chips)).toEqual(chips)
  })

  it("実効値の降順でソートする", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 100, unit: "1", count: 10 }),
      makeChip({ id: 2, amount: 500, unit: "1", count: 5 }),
    ]
    const sorted = sortChipsByValue(chips)
    expect(sorted[0].id).toBe(2) // 500
    expect(sorted[1].id).toBe(1) // 100
  })

  it("異なる単位のチップを降順でソートする", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 1, unit: "M", count: 1 }),  // 1,000,000
      makeChip({ id: 2, amount: 500, unit: "1", count: 1 }), // 500
      makeChip({ id: 3, amount: 5, unit: "K", count: 1 }),   // 5,000
    ]
    const sorted = sortChipsByValue(chips)
    expect(sorted.map(c => c.id)).toEqual([1, 3, 2])
  })

  it("同じ実効値のチップは元の順序を維持する", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 1, unit: "K", count: 1 }),  // 1,000
      makeChip({ id: 2, amount: 1000, unit: "1", count: 1 }), // 1,000
    ]
    const sorted = sortChipsByValue(chips)
    // 同値の場合、sort は stable なので元の順序を維持
    expect(sorted[0].id).toBe(1)
    expect(sorted[1].id).toBe(2)
  })

  it("元の配列を変更しない（イミュータブル）", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 500, unit: "1" }),
      makeChip({ id: 2, amount: 100, unit: "1" }),
    ]
    const original = [...chips]
    sortChipsByValue(chips)
    expect(chips).toEqual(original)
  })

  it("3種類以上のチップを降順でソートする", () => {
    const chips: ChipRow[] = [
      makeChip({ id: 1, amount: 1, unit: "K" }),   // 1,000
      makeChip({ id: 2, amount: 25, unit: "1" }),   // 25
      makeChip({ id: 3, amount: 500, unit: "1" }),   // 500
      makeChip({ id: 4, amount: 100, unit: "1" }),   // 100
      makeChip({ id: 5, amount: 5, unit: "K" }),     // 5,000
    ]
    const sorted = sortChipsByValue(chips)
    expect(sorted.map(c => c.id)).toEqual([5, 1, 3, 4, 2])
  })
})
