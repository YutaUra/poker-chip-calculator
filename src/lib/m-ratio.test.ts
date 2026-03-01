import { describe, it, expect } from "vitest"
import { calculateMRatio, getMZone } from "./m-ratio"
import type { MRatioInput } from "./m-ratio"

describe("calculateMRatio", () => {
  it("標準トーナメント条件でM値を計算する", () => {
    // M = totalStack / (SB + BB + ante × players)
    // SB = BB / 2 = 50
    // M = 10000 / (50 + 100 + 10 × 9) = 10000 / 240 ≈ 41.67
    const input: MRatioInput = {
      totalStack: 10000,
      bbAmount: 100,
      anteAmount: 10,
      players: 9,
    }
    expect(calculateMRatio(input)).toBeCloseTo(41.67, 1)
  })

  it("アンティなしの場合はSB+BBのみで計算する", () => {
    // M = 10000 / (50 + 100 + 0 × 9) = 10000 / 150 ≈ 66.67
    const input: MRatioInput = {
      totalStack: 10000,
      bbAmount: 100,
      anteAmount: 0,
      players: 9,
    }
    expect(calculateMRatio(input)).toBeCloseTo(66.67, 1)
  })

  it("BB=0の場合は0を返す", () => {
    const input: MRatioInput = {
      totalStack: 10000,
      bbAmount: 0,
      anteAmount: 10,
      players: 9,
    }
    expect(calculateMRatio(input)).toBe(0)
  })

  it("totalStack=0の場合は0を返す", () => {
    const input: MRatioInput = {
      totalStack: 0,
      bbAmount: 100,
      anteAmount: 10,
      players: 9,
    }
    expect(calculateMRatio(input)).toBe(0)
  })

  it("プレイヤー2人の場合を正しく計算する", () => {
    // M = 10000 / (50 + 100 + 10 × 2) = 10000 / 170 ≈ 58.82
    const input: MRatioInput = {
      totalStack: 10000,
      bbAmount: 100,
      anteAmount: 10,
      players: 2,
    }
    expect(calculateMRatio(input)).toBeCloseTo(58.82, 1)
  })

  it("大きなアンティでM値が小さくなる", () => {
    // M = 5000 / (50 + 100 + 100 × 9) = 5000 / 1050 ≈ 4.76
    const input: MRatioInput = {
      totalStack: 5000,
      bbAmount: 100,
      anteAmount: 100,
      players: 9,
    }
    expect(calculateMRatio(input)).toBeCloseTo(4.76, 1)
  })
})

describe("getMZone", () => {
  it("M >= 20 の場合は green ゾーンを返す", () => {
    expect(getMZone(20)).toBe("green")
    expect(getMZone(100)).toBe("green")
  })

  it("10 <= M < 20 の場合は yellow ゾーンを返す", () => {
    expect(getMZone(10)).toBe("yellow")
    expect(getMZone(15)).toBe("yellow")
    expect(getMZone(19.9)).toBe("yellow")
  })

  it("5 <= M < 10 の場合は orange ゾーンを返す", () => {
    expect(getMZone(5)).toBe("orange")
    expect(getMZone(7.5)).toBe("orange")
    expect(getMZone(9.9)).toBe("orange")
  })

  it("M < 5 の場合は red ゾーンを返す", () => {
    expect(getMZone(4.9)).toBe("red")
    expect(getMZone(1)).toBe("red")
    expect(getMZone(0)).toBe("red")
  })

  it("境界値 20 は green ゾーンである", () => {
    expect(getMZone(20)).toBe("green")
  })

  it("境界値 10 は yellow ゾーンである", () => {
    expect(getMZone(10)).toBe("yellow")
  })

  it("境界値 5 は orange ゾーンである", () => {
    expect(getMZone(5)).toBe("orange")
  })

  it("境界値の直下は1つ下のゾーンである", () => {
    expect(getMZone(19.999)).toBe("yellow")
    expect(getMZone(9.999)).toBe("orange")
    expect(getMZone(4.999)).toBe("red")
  })
})
