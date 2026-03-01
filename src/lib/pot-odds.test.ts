import { describe, it, expect } from "vitest"
import { calculatePotOdds, formatPercent } from "./pot-odds"

describe("calculatePotOdds", () => {
  describe("標準ケース", () => {
    it("ポット10BB・コール額5BBの場合、ポットオッズは33.3%になる", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: 5 })
      // 5 / (10 + 5) * 100 = 33.333...
      expect(result.potOdds).toBeCloseTo(33.333, 2)
    })

    it("ポット100BB・コール額50BBの場合、ポットオッズは33.3%になる", () => {
      const result = calculatePotOdds({ potSize: 100, callAmount: 50 })
      expect(result.potOdds).toBeCloseTo(33.333, 2)
    })

    it("ポット6BB・コール額2BBの場合、ポットオッズは25%になる", () => {
      const result = calculatePotOdds({ potSize: 6, callAmount: 2 })
      // 2 / (6 + 2) * 100 = 25
      expect(result.potOdds).toBe(25)
    })

    it("ポット3BB・コール額1BBの場合、ポットオッズは25%になる", () => {
      const result = calculatePotOdds({ potSize: 3, callAmount: 1 })
      expect(result.potOdds).toBe(25)
    })
  })

  describe("コール額0のケース", () => {
    it("コール額が0の場合、ポットオッズは0%を返す", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: 0 })
      expect(result.potOdds).toBe(0)
      expect(result.requiredEquity).toBe(0)
    })

    it("コール額が負の場合、ポットオッズは0%を返す", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: -5 })
      expect(result.potOdds).toBe(0)
      expect(result.requiredEquity).toBe(0)
    })
  })

  describe("ポット0のケース", () => {
    it("ポットサイズが0でコール額が正の場合、正しく計算する", () => {
      const result = calculatePotOdds({ potSize: 0, callAmount: 5 })
      // 5 / (0 + 5) * 100 = 100
      expect(result.potOdds).toBe(100)
    })

    it("ポットサイズとコール額が両方0の場合、0%を返す", () => {
      const result = calculatePotOdds({ potSize: 0, callAmount: 0 })
      expect(result.potOdds).toBe(0)
      expect(result.requiredEquity).toBe(0)
    })
  })

  describe("ポットサイズと同額ベットのケース", () => {
    it("ポット10BBに対してコール額10BBの場合、ポットオッズは50%になる", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: 10 })
      // 10 / (10 + 10) * 100 = 50
      expect(result.potOdds).toBe(50)
    })
  })

  describe("必要エクイティがポットオッズと同値であること", () => {
    it("ポットオッズと必要エクイティが一致する（25%のケース）", () => {
      const result = calculatePotOdds({ potSize: 6, callAmount: 2 })
      expect(result.requiredEquity).toBe(result.potOdds)
      expect(result.requiredEquity).toBe(25)
    })

    it("ポットオッズと必要エクイティが一致する（33.3%のケース）", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: 5 })
      expect(result.requiredEquity).toBe(result.potOdds)
      expect(result.requiredEquity).toBeCloseTo(33.333, 2)
    })

    it("ポットオッズと必要エクイティが一致する（50%のケース）", () => {
      const result = calculatePotOdds({ potSize: 10, callAmount: 10 })
      expect(result.requiredEquity).toBe(result.potOdds)
      expect(result.requiredEquity).toBe(50)
    })
  })
})

describe("formatPercent", () => {
  it("整数値は小数なしで表示する", () => {
    expect(formatPercent(25)).toBe("25%")
    expect(formatPercent(50)).toBe("50%")
    expect(formatPercent(100)).toBe("100%")
    expect(formatPercent(0)).toBe("0%")
  })

  it("端数ありの値は小数1桁で表示する", () => {
    expect(formatPercent(33.333)).toBe("33.3%")
    expect(formatPercent(28.571)).toBe("28.6%")
    expect(formatPercent(16.667)).toBe("16.7%")
  })

  it("小数1桁で丸めが正しく行われる", () => {
    expect(formatPercent(33.35)).toBe("33.4%")
    expect(formatPercent(33.34)).toBe("33.3%")
  })
})
