import { describe, it, expect } from "vitest"
import type { Session, StackSnapshot } from "./stack-history"
import type { ArchivedSession } from "./session-archive"
import { archiveSession, calculateOverallSummary } from "./session-archive"

function makeSnapshot(overrides: Partial<StackSnapshot> & { bbValue: number; recordNumber: number }): StackSnapshot {
  return {
    id: `snap-${overrides.recordNumber}`,
    recordNumber: overrides.recordNumber,
    timestamp: overrides.timestamp ?? Date.now(),
    totalChips: overrides.totalChips ?? 50000,
    bbValue: overrides.bbValue,
    blindAmount: overrides.blindAmount ?? 500,
    blindUnit: overrides.blindUnit ?? "1",
    memo: overrides.memo ?? null,
  }
}

function makeSession(snapshots: StackSnapshot[], startedAt?: number): Session {
  return {
    id: "session-1",
    startedAt: startedAt ?? 1000000,
    snapshots,
  }
}

describe("archiveSession", () => {
  it("セッションからArchivedSessionを生成する", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 120, timestamp: 1060000 }),
      makeSnapshot({ recordNumber: 3, bbValue: 90, timestamp: 1120000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.id).toBe("session-1")
    expect(archived.startedAt).toBe(1000000)
    expect(archived.endedAt).toBe(1120000)
    expect(archived.snapshots).toEqual(snapshots)
  })

  it("サマリーのsnapshotCountが正確である", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 120, timestamp: 1060000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.snapshotCount).toBe(2)
  })

  it("durationMsが最初と最後のスナップショットの差である", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 120, timestamp: 1060000 }),
      makeSnapshot({ recordNumber: 3, bbValue: 90, timestamp: 1120000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.durationMs).toBe(120000)
  })

  it("deltaBBが最初と最後のBBの差である", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 150, timestamp: 1060000 }),
      makeSnapshot({ recordNumber: 3, bbValue: 130, timestamp: 1120000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.startBB).toBe(100)
    expect(archived.summary.endBB).toBe(130)
    expect(archived.summary.deltaBB).toBe(30)
  })

  it("負のdeltaBBを正しく計算する", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 60, timestamp: 1060000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.deltaBB).toBe(-40)
  })

  it("peakBBが全スナップショットの最大値である", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
      makeSnapshot({ recordNumber: 2, bbValue: 200, timestamp: 1060000 }),
      makeSnapshot({ recordNumber: 3, bbValue: 130, timestamp: 1120000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.peakBB).toBe(200)
  })

  it("lastBlindAmountとlastBlindUnitが最後のスナップショットの値である", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000, blindAmount: 500, blindUnit: "1" }),
      makeSnapshot({ recordNumber: 2, bbValue: 120, timestamp: 1060000, blindAmount: 1, blindUnit: "K" }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.lastBlindAmount).toBe(1)
    expect(archived.summary.lastBlindUnit).toBe("K")
  })

  it("スナップショットが1件の場合でもサマリーを計算できる", () => {
    const snapshots = [
      makeSnapshot({ recordNumber: 1, bbValue: 100, timestamp: 1000000 }),
    ]
    const session = makeSession(snapshots, 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.snapshotCount).toBe(1)
    expect(archived.summary.durationMs).toBe(0)
    expect(archived.summary.startBB).toBe(100)
    expect(archived.summary.endBB).toBe(100)
    expect(archived.summary.deltaBB).toBe(0)
    expect(archived.summary.peakBB).toBe(100)
  })

  it("空のスナップショットの場合はデフォルトサマリーを返す", () => {
    const session = makeSession([], 1000000)

    const archived = archiveSession(session)

    expect(archived.summary.snapshotCount).toBe(0)
    expect(archived.summary.durationMs).toBe(0)
    expect(archived.summary.startBB).toBe(0)
    expect(archived.summary.endBB).toBe(0)
    expect(archived.summary.deltaBB).toBe(0)
    expect(archived.summary.peakBB).toBe(0)
    expect(archived.summary.lastBlindAmount).toBe(0)
    expect(archived.summary.lastBlindUnit).toBe("1")
  })
})

describe("calculateOverallSummary", () => {
  function makeArchived(overrides: Partial<ArchivedSession["summary"]> & { durationMs: number; deltaBB: number }): ArchivedSession {
    return {
      id: `archived-${Math.random()}`,
      startedAt: 1000000,
      endedAt: 2000000,
      snapshots: [],
      summary: {
        snapshotCount: 3,
        durationMs: overrides.durationMs,
        startBB: overrides.startBB ?? 100,
        endBB: overrides.endBB ?? 100 + overrides.deltaBB,
        deltaBB: overrides.deltaBB,
        peakBB: overrides.peakBB ?? 150,
        lastBlindAmount: overrides.lastBlindAmount ?? 500,
        lastBlindUnit: overrides.lastBlindUnit ?? "1",
      },
    }
  }

  it("総セッション数を返す", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 10 }),
      makeArchived({ durationMs: 120000, deltaBB: -5 }),
      makeArchived({ durationMs: 90000, deltaBB: 20 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.totalSessions).toBe(3)
  })

  it("合計プレイ時間を返す", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 10 }),
      makeArchived({ durationMs: 120000, deltaBB: -5 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.totalPlayTimeMs).toBe(180000)
  })

  it("通算deltaBBを返す", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 10 }),
      makeArchived({ durationMs: 120000, deltaBB: -5 }),
      makeArchived({ durationMs: 90000, deltaBB: 20 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.totalDeltaBB).toBe(25)
  })

  it("勝ちセッション数を返す（deltaBB > 0）", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 10 }),
      makeArchived({ durationMs: 120000, deltaBB: -5 }),
      makeArchived({ durationMs: 90000, deltaBB: 20 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.winSessions).toBe(2)
  })

  it("負けセッション数を返す（deltaBB < 0）", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 10 }),
      makeArchived({ durationMs: 120000, deltaBB: -5 }),
      makeArchived({ durationMs: 90000, deltaBB: -20 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.loseSessions).toBe(2)
  })

  it("deltaBBが0のセッションは勝ちにも負けにもカウントされない", () => {
    const archives = [
      makeArchived({ durationMs: 60000, deltaBB: 0 }),
    ]

    const summary = calculateOverallSummary(archives)

    expect(summary.winSessions).toBe(0)
    expect(summary.loseSessions).toBe(0)
  })

  it("空の配列の場合はゼロ値を返す", () => {
    const summary = calculateOverallSummary([])

    expect(summary.totalSessions).toBe(0)
    expect(summary.totalPlayTimeMs).toBe(0)
    expect(summary.totalDeltaBB).toBe(0)
    expect(summary.winSessions).toBe(0)
    expect(summary.loseSessions).toBe(0)
  })
})
