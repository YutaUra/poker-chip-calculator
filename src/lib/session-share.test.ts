import { describe, it, expect } from "vitest"
import type { Session } from "@/lib/stack-history"
import { calculateShareSummary, generateShareText } from "@/lib/session-share"
import type { SessionShareSummary } from "@/lib/session-share"

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
          timestamp: 1000000 + 200 * 60 * 1000,
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
          timestamp: 1000000 + 75 * 60 * 1000,
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
    expect(text).toBe("Session Result: +15.0BB (3h 20m) \u{1F4CA} #PokerChipCalc")
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
    expect(text).toBe("Session Result: -5.0BB (1h 15m) \u{1F4CA} #PokerChipCalc")
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
    expect(text).toBe("Session Result: 0.0BB (30m) \u{1F4CA} #PokerChipCalc")
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
    expect(text).toBe("Session Result: +10.0BB (45m) \u{1F4CA} #PokerChipCalc")
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
    expect(text).toBe("Session Result: +20.0BB (1h 0m) \u{1F4CA} #PokerChipCalc")
  })
})
