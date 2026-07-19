import { describe, it, expect, vi, beforeEach } from "vitest"
import { captureGraphImage } from "@/lib/capture-graph"

// modern-screenshot を動的 import しているため、モジュール全体をモックする。
// jsdom では canvas レンダリングが動作しないため、
// 呼び出しパラメータと結果の受け渡しを検証することが目的。
vi.mock("modern-screenshot", () => ({
  domToBlob: vi.fn(),
}))

describe("captureGraphImage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("domToBlob を PNG・2倍スケールで呼び出して Blob を返す", async () => {
    // Arrange
    const element = document.createElement("div")
    const fakeBlob = new Blob(["fake"], { type: "image/png" })
    const { domToBlob } = await import("modern-screenshot")
    vi.mocked(domToBlob).mockResolvedValue(fakeBlob)

    // Act
    const result = await captureGraphImage(element)

    // Assert
    expect(domToBlob).toHaveBeenCalledWith(element, {
      type: "image/png",
      scale: 2,
    })
    expect(result).toBe(fakeBlob)
  })

  it("domToBlob が失敗した場合はエラーを伝播する", async () => {
    // Arrange
    const element = document.createElement("div")
    const { domToBlob } = await import("modern-screenshot")
    vi.mocked(domToBlob).mockRejectedValue(new Error("capture failed"))

    // Act & Assert
    await expect(captureGraphImage(element)).rejects.toThrow("capture failed")
  })
})
