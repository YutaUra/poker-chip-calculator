import { describe, it, expect } from "vitest"
import { getColorName } from "./color-names"

describe("getColorName", () => {
  it("赤のhexコードに対して「赤」を返す", () => {
    expect(getColorName("#ef4444")).toBe("赤")
  })

  it("青のhexコードに対して「青」を返す", () => {
    expect(getColorName("#3b82f6")).toBe("青")
  })

  it("緑のhexコードに対して「緑」を返す", () => {
    expect(getColorName("#22c55e")).toBe("緑")
  })

  it("紫のhexコードに対して「紫」を返す", () => {
    expect(getColorName("#a855f7")).toBe("紫")
  })

  it("黄のhexコードに対して「黄」を返す", () => {
    expect(getColorName("#eab308")).toBe("黄")
  })

  it("ピンクのhexコードに対して「ピンク」を返す", () => {
    expect(getColorName("#ec4899")).toBe("ピンク")
  })

  it("オレンジのhexコードに対して「オレンジ」を返す", () => {
    expect(getColorName("#f97316")).toBe("オレンジ")
  })

  it("グレーのhexコードに対して「グレー」を返す", () => {
    expect(getColorName("#6b7280")).toBe("グレー")
  })

  it("白のhexコードに対して「白」を返す", () => {
    expect(getColorName("#e5e7eb")).toBe("白")
  })

  it("黒のhexコードに対して「黒」を返す", () => {
    expect(getColorName("#1f2937")).toBe("黒")
  })

  it("マッチしないhexコードに対して「カスタム」を返す", () => {
    expect(getColorName("#abcdef")).toBe("カスタム")
  })

  it("大文字のhexコードでもマッチする", () => {
    expect(getColorName("#EF4444")).toBe("赤")
  })
})
