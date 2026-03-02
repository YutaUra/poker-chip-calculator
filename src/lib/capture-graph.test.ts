import { describe, it, expect, vi, beforeEach } from "vitest"
import { captureGraphImage } from "@/lib/capture-graph"

// html2canvas を動的 import しているため、モジュール全体をモックする。
// jsdom では canvas レンダリングが動作しないため、
// html2canvas の呼び出しを検証することが目的。
const mockCanvas = {
  toBlob: vi.fn(),
}

vi.mock("html2canvas", () => ({
  default: vi.fn().mockResolvedValue(mockCanvas),
}))

describe("captureGraphImage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("html2canvasを呼び出してPNG Blobを返す", async () => {
    // Arrange
    const element = document.createElement("div")
    const fakeBlob = new Blob(["fake"], { type: "image/png" })
    mockCanvas.toBlob.mockImplementation((callback: BlobCallback) => {
      callback(fakeBlob)
    })

    // Act
    const result = await captureGraphImage(element)

    // Assert
    const html2canvas = (await import("html2canvas")).default
    expect(html2canvas).toHaveBeenCalledWith(element, {
      backgroundColor: null,
      scale: 2,
    })
    expect(result).toBe(fakeBlob)
  })

  it("toBlobがnullを返した場合はエラーをスローする", async () => {
    // Arrange
    const element = document.createElement("div")
    mockCanvas.toBlob.mockImplementation((callback: BlobCallback) => {
      callback(null)
    })

    // Act & Assert
    await expect(captureGraphImage(element)).rejects.toThrow(
      "Failed to capture graph image"
    )
  })
})
