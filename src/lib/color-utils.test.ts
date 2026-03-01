import { describe, it, expect } from "vitest"
import { hslToHex, generateColorGrid, isValidHex } from "./color-utils"

describe("hslToHex", () => {
  it("赤（H:0, S:100, L:50）を #ff0000 に変換する", () => {
    expect(hslToHex(0, 100, 50)).toBe("#ff0000")
  })

  it("緑（H:120, S:100, L:50）を #00ff00 に変換する", () => {
    expect(hslToHex(120, 100, 50)).toBe("#00ff00")
  })

  it("青（H:240, S:100, L:50）を #0000ff に変換する", () => {
    expect(hslToHex(240, 100, 50)).toBe("#0000ff")
  })

  it("白（H:0, S:0, L:100）を #ffffff に変換する", () => {
    expect(hslToHex(0, 0, 100)).toBe("#ffffff")
  })

  it("黒（H:0, S:0, L:0）を #000000 に変換する", () => {
    expect(hslToHex(0, 0, 0)).toBe("#000000")
  })

  it("彩度50%・明度75%の中間色を正しく変換する", () => {
    // H:210, S:50, L:75 → rgb(159, 191, 223) → #9fbfdf
    expect(hslToHex(210, 50, 75)).toBe("#9fbfdf")
  })
})

describe("generateColorGrid", () => {
  it("16列×16行の256色グリッドを返す", () => {
    const grid = generateColorGrid()
    expect(grid).toHaveLength(16) // 16 rows (lightness)
    for (const row of grid) {
      expect(row).toHaveLength(16) // 16 columns (hue)
    }
  })

  it("各セルは有効な hex カラーコード文字列である", () => {
    const grid = generateColorGrid()
    const hexPattern = /^#[0-9a-f]{6}$/
    for (const row of grid) {
      for (const color of row) {
        expect(color).toMatch(hexPattern)
      }
    }
  })

  it("上の行ほど明るく（Lightness が高く）下の行ほど暗い", () => {
    const grid = generateColorGrid()
    // 最上行の最初の色（高明度）は最下行の最初の色（低明度）より明るい
    // hex の RGB 値を合算して比較
    const sumRgb = (hex: string) => {
      const h = hex.replace("#", "")
      return parseInt(h.substring(0, 2), 16) + parseInt(h.substring(2, 4), 16) + parseInt(h.substring(4, 6), 16)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sumRgb(grid[0]![0]!)).toBeGreaterThan(sumRgb(grid[15]![0]!))
  })

  it("同じ行内で色相が変化する", () => {
    const grid = generateColorGrid()
    // 中間行の全色がユニークであること
    const middleRow = grid[8]!
    const unique = new Set(middleRow)
    expect(unique.size).toBe(16)
  })

  it("重複する色がない", () => {
    const grid = generateColorGrid()
    const all = grid.flat()
    const unique = new Set(all)
    expect(unique.size).toBe(256)
  })
})

describe("isValidHex", () => {
  it("6桁のhex文字列は有効", () => {
    expect(isValidHex("ff5733")).toBe(true)
  })

  it("#付き6桁のhex文字列は有効", () => {
    expect(isValidHex("#ff5733")).toBe(true)
  })

  it("大文字のhex文字列は有効", () => {
    expect(isValidHex("FF5733")).toBe(true)
  })

  it("5桁以下は無効", () => {
    expect(isValidHex("ff573")).toBe(false)
  })

  it("7桁以上は無効", () => {
    expect(isValidHex("ff57331")).toBe(false)
  })

  it("hex以外の文字を含む場合は無効", () => {
    expect(isValidHex("gggggg")).toBe(false)
  })

  it("空文字は無効", () => {
    expect(isValidHex("")).toBe(false)
  })
})
