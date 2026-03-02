import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSessionArchive } from "./use-session-archive"
import type { ArchivedSession } from "./session-archive"
import { STORAGE_KEY_SESSION_ARCHIVE } from "./storage-keys"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function makeArchivedSession(id: string, deltaBB = 10): ArchivedSession {
  return {
    id,
    startedAt: 1000000,
    endedAt: 2000000,
    snapshots: [],
    summary: {
      snapshotCount: 3,
      durationMs: 1000000,
      startBB: 100,
      endBB: 100 + deltaBB,
      deltaBB,
      peakBB: 150,
      lastBlindAmount: 500,
      lastBlindUnit: "1",
    },
  }
}

describe("useSessionArchive", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("初期状態", () => {
    it("空の配列を返す", () => {
      const { result } = renderHook(() => useSessionArchive())

      expect(result.current.archives).toEqual([])
    })
  })

  describe("addArchive", () => {
    it("アーカイブを追加できる", () => {
      const { result } = renderHook(() => useSessionArchive())
      const archived = makeArchivedSession("s-1")

      act(() => {
        result.current.addArchive(archived)
      })

      expect(result.current.archives).toHaveLength(1)
      expect(result.current.archives[0].id).toBe("s-1")
    })

    it("複数のアーカイブを追加できる", () => {
      const { result } = renderHook(() => useSessionArchive())

      act(() => {
        result.current.addArchive(makeArchivedSession("s-1"))
      })
      act(() => {
        result.current.addArchive(makeArchivedSession("s-2"))
      })

      expect(result.current.archives).toHaveLength(2)
    })

    it("50件を超えると最古のアーカイブが削除される", () => {
      const { result } = renderHook(() => useSessionArchive())

      // 50件追加
      for (let i = 1; i <= 50; i++) {
        act(() => {
          result.current.addArchive(makeArchivedSession(`s-${i}`))
        })
      }

      expect(result.current.archives).toHaveLength(50)

      // 51件目を追加
      act(() => {
        result.current.addArchive(makeArchivedSession("s-51"))
      })

      expect(result.current.archives).toHaveLength(50)
      // 最古（s-1）が削除されている
      expect(result.current.archives[0].id).toBe("s-2")
      // 最新（s-51）が末尾にある
      expect(result.current.archives[49].id).toBe("s-51")
    })

    it("localStorageに永続化される", () => {
      const { result } = renderHook(() => useSessionArchive())
      const archived = makeArchivedSession("s-1")

      act(() => {
        result.current.addArchive(archived)
      })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION_ARCHIVE) ?? "[]") as ArchivedSession[]
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe("s-1")
    })
  })

  describe("removeArchive", () => {
    it("指定IDのアーカイブを削除できる", () => {
      const { result } = renderHook(() => useSessionArchive())

      act(() => {
        result.current.addArchive(makeArchivedSession("s-1"))
      })
      act(() => {
        result.current.addArchive(makeArchivedSession("s-2"))
      })
      act(() => {
        result.current.addArchive(makeArchivedSession("s-3"))
      })

      act(() => {
        result.current.removeArchive("s-2")
      })

      expect(result.current.archives).toHaveLength(2)
      expect(result.current.archives.map((a) => a.id)).toEqual(["s-1", "s-3"])
    })

    it("存在しないIDを指定しても何も起こらない", () => {
      const { result } = renderHook(() => useSessionArchive())

      act(() => {
        result.current.addArchive(makeArchivedSession("s-1"))
      })

      act(() => {
        result.current.removeArchive("nonexistent")
      })

      expect(result.current.archives).toHaveLength(1)
    })
  })

  describe("overallSummary", () => {
    it("全アーカイブの通算サマリーを返す", () => {
      const { result } = renderHook(() => useSessionArchive())

      act(() => {
        result.current.addArchive(makeArchivedSession("s-1", 10))
      })
      act(() => {
        result.current.addArchive(makeArchivedSession("s-2", -5))
      })

      expect(result.current.overallSummary.totalSessions).toBe(2)
      expect(result.current.overallSummary.totalDeltaBB).toBe(5)
      expect(result.current.overallSummary.winSessions).toBe(1)
      expect(result.current.overallSummary.loseSessions).toBe(1)
    })

    it("空の場合はゼロ値を返す", () => {
      const { result } = renderHook(() => useSessionArchive())

      expect(result.current.overallSummary.totalSessions).toBe(0)
      expect(result.current.overallSummary.totalDeltaBB).toBe(0)
    })
  })
})
