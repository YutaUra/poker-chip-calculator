import { describe, it, expect, vi, beforeEach } from "vitest"
import { shareResult } from "@/lib/share-result"

describe("shareResult", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("navigator.share対応時はWeb Share APIを呼び出す", async () => {
    // Arrange
    const shareSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "share", {
      value: shareSpy,
      writable: true,
      configurable: true,
    })

    // Act
    await shareResult("Session Result: +15.0BB", "https://example.com")

    // Assert
    expect(shareSpy).toHaveBeenCalledWith({
      text: "Session Result: +15.0BB",
      url: "https://example.com",
    })
  })

  it("navigator.share対応時にURLなしでもテキストのみでシェアできる", async () => {
    // Arrange
    const shareSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "share", {
      value: shareSpy,
      writable: true,
      configurable: true,
    })

    // Act
    await shareResult("Session Result: +15.0BB")

    // Assert
    expect(shareSpy).toHaveBeenCalledWith({
      text: "Session Result: +15.0BB",
    })
  })

  it("navigator.share非対応時はクリップボードにコピーする", async () => {
    // Arrange
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    })
    const writeTextSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      writable: true,
      configurable: true,
    })

    // Act
    await shareResult("Session Result: +15.0BB", "https://example.com")

    // Assert
    expect(writeTextSpy).toHaveBeenCalledWith("Session Result: +15.0BB\nhttps://example.com")
  })

  it("navigator.share非対応かつURL無しの場合はテキストのみクリップボードにコピーする", async () => {
    // Arrange
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    })
    const writeTextSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      writable: true,
      configurable: true,
    })

    // Act
    await shareResult("Session Result: +15.0BB")

    // Assert
    expect(writeTextSpy).toHaveBeenCalledWith("Session Result: +15.0BB")
  })

  it("navigator.shareがAbortErrorを投げた場合は静かに無視する", async () => {
    // Arrange
    const abortError = new DOMException("Share canceled", "AbortError")
    const shareSpy = vi.fn().mockRejectedValue(abortError)
    Object.defineProperty(navigator, "share", {
      value: shareSpy,
      writable: true,
      configurable: true,
    })

    // Act & Assert
    await expect(shareResult("text")).resolves.toBeUndefined()
  })

  it("navigator.shareがAbortError以外のエラーを投げた場合はクリップボードにフォールバックする", async () => {
    // Arrange
    const shareSpy = vi.fn().mockRejectedValue(new Error("Share failed"))
    Object.defineProperty(navigator, "share", {
      value: shareSpy,
      writable: true,
      configurable: true,
    })
    const writeTextSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      writable: true,
      configurable: true,
    })

    // Act
    await shareResult("Session Result: +15.0BB", "https://example.com")

    // Assert
    expect(writeTextSpy).toHaveBeenCalledWith("Session Result: +15.0BB\nhttps://example.com")
  })
})
