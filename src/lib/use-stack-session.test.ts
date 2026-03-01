import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useStackSession } from "./use-stack-session"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe("useStackSession", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    let callCount = 0
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
      callCount++
      return `test-uuid-${callCount}`
    })
  })

  describe("初期状態", () => {
    it("空のセッション（スナップショット0件）を返す", () => {
      const { result } = renderHook(() => useStackSession())

      expect(result.current.session.snapshots).toEqual([])
      expect(result.current.session.id).toBeTruthy()
      expect(result.current.session.startedAt).toBeTypeOf("number")
    })
  })

  describe("record", () => {
    it("スナップショットが追加される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      expect(result.current.session.snapshots).toHaveLength(1)
      expect(result.current.session.snapshots[0].totalChips).toBe(50000)
      expect(result.current.session.snapshots[0].bbValue).toBe(100)
      expect(result.current.session.snapshots[0].blindAmount).toBe(500)
      expect(result.current.session.snapshots[0].blindUnit).toBe("1")
    })

    it("recordNumber が自動インクリメントされる", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      act(() => {
        result.current.record({
          total: 60000,
          bbValue: 120,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      expect(result.current.session.snapshots[0].recordNumber).toBe(1)
      expect(result.current.session.snapshots[1].recordNumber).toBe(2)
    })

    it("memo が trim されて空文字は null に変換される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "  ",
        })
      })

      expect(result.current.session.snapshots[0].memo).toBeNull()
    })

    it("memo が trim されて非空文字はそのまま保存される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "  ダブルアップ  ",
        })
      })

      expect(result.current.session.snapshots[0].memo).toBe("ダブルアップ")
    })

    it("blindAmount が null の場合は 0 に変換される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: null,
          blindUnit: "1",
          memo: "",
        })
      })

      expect(result.current.session.snapshots[0].blindAmount).toBe(0)
    })

    it("toast.success が呼ばれる", async () => {
      const { toast } = await import("sonner")
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      expect(toast.success).toHaveBeenCalledWith("記録しました (#1)")
    })
  })

  describe("removeLast", () => {
    it("直前のスナップショットが削除される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      act(() => {
        result.current.record({
          total: 60000,
          bbValue: 120,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      act(() => {
        result.current.removeLast()
      })

      expect(result.current.session.snapshots).toHaveLength(1)
      expect(result.current.session.snapshots[0].recordNumber).toBe(1)
    })

    it("空セッションの場合は何もしない", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.removeLast()
      })

      expect(result.current.session.snapshots).toHaveLength(0)
    })
  })

  describe("reset", () => {
    it("新しいセッションが作成される", () => {
      const { result } = renderHook(() => useStackSession())
      const originalId = result.current.session.id

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.session.snapshots).toEqual([])
      expect(result.current.session.id).not.toBe(originalId)
    })
  })

  describe("updateMemo", () => {
    it("メモが更新される", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "",
        })
      })

      const snapshotId = result.current.session.snapshots[0].id

      act(() => {
        result.current.updateMemo(snapshotId, "ダブルアップ")
      })

      expect(result.current.session.snapshots[0].memo).toBe("ダブルアップ")
    })

    it("メモを null に更新できる", () => {
      const { result } = renderHook(() => useStackSession())

      act(() => {
        result.current.record({
          total: 50000,
          bbValue: 100,
          blindAmount: 500,
          blindUnit: "1",
          memo: "メモ",
        })
      })

      const snapshotId = result.current.session.snapshots[0].id

      act(() => {
        result.current.updateMemo(snapshotId, null)
      })

      expect(result.current.session.snapshots[0].memo).toBeNull()
    })
  })
})
