import { describe, it, expect } from "vitest"
import { parseConfigFromUrl } from "@/lib/use-config-from-url"
import { encodeChipConfig } from "@/lib/session-share"
import type { ShareConfig } from "@/lib/session-share"

describe("parseConfigFromUrl", () => {
  it("有効なconfigパラメータからShareConfigを復元する", () => {
    // Arrange
    const config: ShareConfig = {
      chips: [{ amount: 100, unit: "1", count: 10, color: "#ef4444" }],
      blind: { amount: 100, unit: "1" },
    }
    const encoded = encodeChipConfig(config)
    const url = `https://example.com/?config=${encoded}`

    // Act
    const result = parseConfigFromUrl(url)

    // Assert
    expect(result).toEqual(config)
  })

  it("configパラメータがない場合はnullを返す", () => {
    // Act
    const result = parseConfigFromUrl("https://example.com/")

    // Assert
    expect(result).toBeNull()
  })

  it("不正なconfigパラメータの場合はnullを返す", () => {
    // Act
    const result = parseConfigFromUrl("https://example.com/?config=invalid!!!")

    // Assert
    expect(result).toBeNull()
  })

  it("空のconfigパラメータの場合はnullを返す", () => {
    // Act
    const result = parseConfigFromUrl("https://example.com/?config=")

    // Assert
    expect(result).toBeNull()
  })
})
