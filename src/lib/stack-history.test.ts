import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  createSnapshot,
  addSnapshot,
  removeLastSnapshot,
  updateSnapshotMemo,
  createSession,
  resetSession,
} from "./stack-history"
import type { Session, StackSnapshot } from "./stack-history"

// crypto.randomUUID のモック
beforeEach(() => {
  let callCount = 0
  vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
    callCount++
    return `test-uuid-${callCount}`
  })
})

describe("createSnapshot", () => {
  it("現在のスタック情報からスナップショットを生成する", () => {
    const snapshot = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })

    expect(snapshot.id).toBe("test-uuid-1")
    expect(snapshot.recordNumber).toBe(1)
    expect(snapshot.totalChips).toBe(50000)
    expect(snapshot.bbValue).toBe(100)
    expect(snapshot.blindAmount).toBe(500)
    expect(snapshot.blindUnit).toBe("1")
    expect(snapshot.memo).toBeNull()
    expect(snapshot.timestamp).toBeTypeOf("number")
  })

  it("タイムスタンプに現在時刻が記録される", () => {
    const before = Date.now()
    const snapshot = createSnapshot({
      totalChips: 10000,
      bbValue: 20,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    const after = Date.now()

    expect(snapshot.timestamp).toBeGreaterThanOrEqual(before)
    expect(snapshot.timestamp).toBeLessThanOrEqual(after)
  })
})

describe("addSnapshot", () => {
  it("セッションにスナップショットを追加する", () => {
    const session = createSession()
    const snapshot = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })

    const updated = addSnapshot(session, snapshot)

    expect(updated.snapshots).toHaveLength(1)
    expect(updated.snapshots[0]).toEqual(snapshot)
  })

  it("元のセッションを変更しない（イミュータブル）", () => {
    const session = createSession()
    const snapshot = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })

    const updated = addSnapshot(session, snapshot)

    expect(session.snapshots).toHaveLength(0)
    expect(updated).not.toBe(session)
  })

  it("複数のスナップショットを順に追加できる", () => {
    let session = createSession()
    const snap1 = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    const snap2 = createSnapshot({
      totalChips: 60000,
      bbValue: 120,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 2,
    })

    session = addSnapshot(session, snap1)
    session = addSnapshot(session, snap2)

    expect(session.snapshots).toHaveLength(2)
    expect(session.snapshots[0].recordNumber).toBe(1)
    expect(session.snapshots[1].recordNumber).toBe(2)
  })
})

describe("removeLastSnapshot", () => {
  it("最新のスナップショットを削除する", () => {
    let session = createSession()
    const snap1 = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    const snap2 = createSnapshot({
      totalChips: 60000,
      bbValue: 120,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 2,
    })
    session = addSnapshot(session, snap1)
    session = addSnapshot(session, snap2)

    const updated = removeLastSnapshot(session)

    expect(updated.snapshots).toHaveLength(1)
    expect(updated.snapshots[0].recordNumber).toBe(1)
  })

  it("記録が0件の場合は何も起こらない", () => {
    const session = createSession()
    const updated = removeLastSnapshot(session)

    expect(updated.snapshots).toHaveLength(0)
  })

  it("元のセッションを変更しない（イミュータブル）", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)

    const updated = removeLastSnapshot(session)

    expect(session.snapshots).toHaveLength(1)
    expect(updated).not.toBe(session)
  })
})

describe("updateSnapshotMemo", () => {
  it("指定したスナップショットにメモを追加する", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)

    const updated = updateSnapshotMemo(session, snap.id, "ダブルアップ")

    expect(updated.snapshots[0].memo).toBe("ダブルアップ")
  })

  it("メモを null に戻せる", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)
    session = updateSnapshotMemo(session, snap.id, "メモ")

    const updated = updateSnapshotMemo(session, snap.id, null)

    expect(updated.snapshots[0].memo).toBeNull()
  })

  it("存在しないIDを指定した場合はセッションをそのまま返す", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)

    const updated = updateSnapshotMemo(session, "nonexistent-id", "メモ")

    expect(updated.snapshots[0].memo).toBeNull()
  })

  it("元のセッションを変更しない（イミュータブル）", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)

    const updated = updateSnapshotMemo(session, snap.id, "メモ")

    expect(session.snapshots[0].memo).toBeNull()
    expect(updated).not.toBe(session)
  })
})

describe("createSession", () => {
  it("空のセッションを生成する", () => {
    const session = createSession()

    expect(session.id).toBe("test-uuid-1")
    expect(session.snapshots).toEqual([])
    expect(session.startedAt).toBeTypeOf("number")
  })

  it("タイムスタンプに現在時刻が記録される", () => {
    const before = Date.now()
    const session = createSession()
    const after = Date.now()

    expect(session.startedAt).toBeGreaterThanOrEqual(before)
    expect(session.startedAt).toBeLessThanOrEqual(after)
  })
})

describe("resetSession", () => {
  it("新しい空のセッションを返す", () => {
    let session = createSession()
    const snap = createSnapshot({
      totalChips: 50000,
      bbValue: 100,
      blindAmount: 500,
      blindUnit: "1",
      recordNumber: 1,
    })
    session = addSnapshot(session, snap)

    const newSession = resetSession()

    expect(newSession.snapshots).toEqual([])
    expect(newSession.id).not.toBe(session.id)
  })
})
