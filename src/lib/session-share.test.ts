import { describe, it, expect } from "vitest"
import type { Session } from "@/lib/stack-history"
import { calculateShareSummary, generateShareText, encodeChipConfig, decodeChipConfig } from "@/lib/session-share"
import type { SessionShareSummary, ShareConfig } from "@/lib/session-share"

// --- calculateShareSummary ---
describe("calculateShareSummary", () => {
  const baseSession: Session = {
    id: "test-session",
    startedAt: 1000000,
    snapshots: [],
  }

  it("スナップショットが2件未満の場合はnullを返す", () => {
    // Arrange
    const sessionEmpty = { ...baseSession, snapshots: [] }
    const sessionOne = {
      ...baseSession,
      snapshots: [
        {
          id: "s1",
          recordNumber: 1,
          timestamp: 1000000,
          totalChips: 10000,
          bbValue: 100,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
      ],
    }

    // Act & Assert
    expect(calculateShareSummary(sessionEmpty)).toBeNull()
    expect(calculateShareSummary(sessionOne)).toBeNull()
  })

  it("プラス損益を正しく計算する", () => {
    // Arrange
    const session: Session = {
      ...baseSession,
      snapshots: [
        {
          id: "s1",
          recordNumber: 1,
          timestamp: 1000000,
          totalChips: 10000,
          bbValue: 100,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
        {
          id: "s2",
          recordNumber: 2,
          timestamp: 1000000 + 200 * 60 * 1000, // 200分後
          totalChips: 11500,
          bbValue: 115,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
      ],
    }

    // Act
    const result = calculateShareSummary(session)

    // Assert
    expect(result).not.toBeNull()
    expect(result!.bbProfit).toBe(15)
    expect(result!.durationMinutes).toBe(200)
    expect(result!.snapshotCount).toBe(2)
  })

  it("マイナス損益を正しく計算する", () => {
    // Arrange
    const session: Session = {
      ...baseSession,
      snapshots: [
        {
          id: "s1",
          recordNumber: 1,
          timestamp: 1000000,
          totalChips: 10000,
          bbValue: 100,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
        {
          id: "s2",
          recordNumber: 2,
          timestamp: 1000000 + 75 * 60 * 1000, // 75分後
          totalChips: 9500,
          bbValue: 95,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
      ],
    }

    // Act
    const result = calculateShareSummary(session)

    // Assert
    expect(result).not.toBeNull()
    expect(result!.bbProfit).toBe(-5)
    expect(result!.durationMinutes).toBe(75)
    expect(result!.snapshotCount).toBe(2)
  })

  it("損益ゼロの場合も正しく計算する", () => {
    // Arrange
    const session: Session = {
      ...baseSession,
      snapshots: [
        {
          id: "s1",
          recordNumber: 1,
          timestamp: 1000000,
          totalChips: 10000,
          bbValue: 100,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
        {
          id: "s2",
          recordNumber: 2,
          timestamp: 1000000 + 30 * 60 * 1000,
          totalChips: 10000,
          bbValue: 100,
          blindAmount: 100,
          blindUnit: "1" as const,
          memo: null,
        },
      ],
    }

    // Act
    const result = calculateShareSummary(session)

    // Assert
    expect(result).not.toBeNull()
    expect(result!.bbProfit).toBe(0)
    expect(result!.durationMinutes).toBe(30)
    expect(result!.snapshotCount).toBe(2)
  })
})

// --- generateShareText ---
describe("generateShareText", () => {
  it("プラス損益の場合、先頭に+をつけてフォーマットする", () => {
    // Arrange
    const summary: SessionShareSummary = {
      bbProfit: 15,
      durationMinutes: 200,
      snapshotCount: 5,
    }

    // Act
    const text = generateShareText(summary)

    // Assert
    expect(text).toBe("Session Result: +15.0BB (3h 20m) 📊 #PokerChipCalc")
  })

  it("マイナス損益の場合、先頭に-をつけてフォーマットする", () => {
    // Arrange
    const summary: SessionShareSummary = {
      bbProfit: -5,
      durationMinutes: 75,
      snapshotCount: 3,
    }

    // Act
    const text = generateShareText(summary)

    // Assert
    expect(text).toBe("Session Result: -5.0BB (1h 15m) 📊 #PokerChipCalc")
  })

  it("損益ゼロの場合、符号なしでフォーマットする", () => {
    // Arrange
    const summary: SessionShareSummary = {
      bbProfit: 0,
      durationMinutes: 30,
      snapshotCount: 2,
    }

    // Act
    const text = generateShareText(summary)

    // Assert
    expect(text).toBe("Session Result: 0.0BB (30m) 📊 #PokerChipCalc")
  })

  it("分のみの時間表示で正しくフォーマットする", () => {
    // Arrange
    const summary: SessionShareSummary = {
      bbProfit: 10,
      durationMinutes: 45,
      snapshotCount: 2,
    }

    // Act
    const text = generateShareText(summary)

    // Assert
    expect(text).toBe("Session Result: +10.0BB (45m) 📊 #PokerChipCalc")
  })

  it("ちょうど1時間の場合の時間表示", () => {
    // Arrange
    const summary: SessionShareSummary = {
      bbProfit: 20,
      durationMinutes: 60,
      snapshotCount: 3,
    }

    // Act
    const text = generateShareText(summary)

    // Assert
    expect(text).toBe("Session Result: +20.0BB (1h 0m) 📊 #PokerChipCalc")
  })
})

// --- encodeChipConfig / decodeChipConfig ---
describe("encodeChipConfig / decodeChipConfig", () => {
  it("正常なConfigをエンコード/デコードで往復できる", () => {
    // Arrange
    const config: ShareConfig = {
      chips: [
        { amount: 100, unit: "1", count: 10, color: "#ef4444" },
        { amount: 500, unit: "1", count: 5, color: "#22c55e" },
      ],
      blind: { amount: 100, unit: "1" },
    }

    // Act
    const encoded = encodeChipConfig(config)
    const decoded = decodeChipConfig(encoded)

    // Assert
    expect(decoded).toEqual(config)
  })

  it("不正なBase64文字列の場合はnullを返す", () => {
    // Act & Assert
    expect(decodeChipConfig("!!!not-base64!!!")).toBeNull()
  })

  it("Base64は有効だがJSONとして不正な場合はnullを返す", () => {
    // Arrange
    const invalidJson = btoa("this is not json")

    // Act & Assert
    expect(decodeChipConfig(invalidJson)).toBeNull()
  })

  it("JSONは有効だがShareConfig構造でない場合はnullを返す", () => {
    // Arrange
    const wrongShape = btoa(JSON.stringify({ foo: "bar" }))

    // Act & Assert
    expect(decodeChipConfig(wrongShape)).toBeNull()
  })

  it("不正なUnit値を含む場合はnullを返す", () => {
    // Arrange
    const invalidUnit = btoa(
      JSON.stringify({
        chips: [{ amount: 100, unit: "X", count: 10, color: "#ef4444" }],
        blind: { amount: 100, unit: "1" },
      }),
    )

    // Act & Assert
    expect(decodeChipConfig(invalidUnit)).toBeNull()
  })

  it("blindのUnit値が不正な場合はnullを返す", () => {
    // Arrange
    const invalidBlindUnit = btoa(
      JSON.stringify({
        chips: [{ amount: 100, unit: "1", count: 10, color: "#ef4444" }],
        blind: { amount: 100, unit: "Z" },
      }),
    )

    // Act & Assert
    expect(decodeChipConfig(invalidBlindUnit)).toBeNull()
  })
})
