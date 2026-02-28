import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("単一のクラス名をそのまま返す", () => {
    expect(cn("text-red-500")).toBe("text-red-500")
  })

  it("複数のクラス名を結合する", () => {
    expect(cn("text-red-500", "bg-white")).toBe("text-red-500 bg-white")
  })

  it("Tailwind の衝突するクラスをマージする", () => {
    // tailwind-merge が後のクラスを優先する
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("条件付きクラスを処理する", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe("base visible")
  })

  it("undefined / null を無視する", () => {
    expect(cn("base", undefined, null)).toBe("base")
  })

  it("空文字列を渡しても正しく動作する", () => {
    expect(cn("")).toBe("")
  })

  it("オブジェクト形式の条件付きクラスを処理する", () => {
    expect(cn({ "text-red-500": true, "bg-white": false })).toBe("text-red-500")
  })

  it("配列形式のクラスを処理する", () => {
    expect(cn(["text-red-500", "bg-white"])).toBe("text-red-500 bg-white")
  })

  it("Tailwind のパディング衝突をマージする", () => {
    expect(cn("p-4", "p-2")).toBe("p-2")
  })

  it("異なる方向のパディングは保持する", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })
})
