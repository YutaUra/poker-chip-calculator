import { describe, it, expect } from "vitest"
import { calculateEffectiveStack } from "./effective-stack"

describe("calculateEffectiveStack", () => {
  it("自分のスタックが小さい場合は自分のスタックを返す", () => {
    expect(calculateEffectiveStack(50, 100)).toBe(50)
  })

  it("相手のスタックが小さい場合は相手のスタックを返す", () => {
    expect(calculateEffectiveStack(100, 50)).toBe(50)
  })

  it("同値の場合はその値を返す", () => {
    expect(calculateEffectiveStack(75, 75)).toBe(75)
  })

  it("相手のスタックが0の場合は0を返す", () => {
    expect(calculateEffectiveStack(100, 0)).toBe(0)
  })

  it("自分のスタックが0の場合は0を返す", () => {
    expect(calculateEffectiveStack(0, 100)).toBe(0)
  })

  it("小数のBB値でも正しく計算する", () => {
    expect(calculateEffectiveStack(33.3, 50.5)).toBe(33.3)
  })
})
