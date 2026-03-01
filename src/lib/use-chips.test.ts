import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useChips } from "@/lib/use-chips"

beforeEach(() => {
  sessionStorage.clear()
})

describe("useChips", () => {
  describe("初期状態", () => {
    it("デフォルトのチップ1行が設定される", () => {
      const { result } = renderHook(() => useChips())

      expect(result.current.chips).toEqual([
        { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
      ])
    })
  })

  describe("addChip", () => {
    it("新しいチップを追加できる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })

      expect(result.current.chips).toHaveLength(2)
      expect(result.current.chips.some(c => c.amount === 500 && c.color === "#3b82f6")).toBe(true)
    })

    it("追加されたチップの count は 0 になる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })

      const added = result.current.chips.find(c => c.amount === 500)
      expect(added?.count).toBe(0)
    })

    it("追加後にチップが実効値の昇順でソートされる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(25, "1", "#22c55e")
      })

      expect(result.current.chips[0].amount).toBe(25)
      expect(result.current.chips[1].amount).toBe(100)
    })

    it("複数回追加しても ID が重複しない", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })
      act(() => {
        result.current.addChip(1000, "1", "#a855f7")
      })

      const ids = result.current.chips.map(c => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe("updateChipCount", () => {
    it("指定したチップの count を更新できる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.updateChipCount(1, 20)
      })

      expect(result.current.chips[0].count).toBe(20)
    })

    it("count を null に更新できる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.updateChipCount(1, null)
      })

      expect(result.current.chips[0].count).toBeNull()
    })
  })

  describe("updateChip", () => {
    it("指定したチップの amount, unit, color を更新できる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.updateChip(1, 500, "1", "#3b82f6")
      })

      expect(result.current.chips[0].amount).toBe(500)
      expect(result.current.chips[0].unit).toBe("1")
      expect(result.current.chips[0].color).toBe("#3b82f6")
    })

    it("更新後にチップが実効値の昇順でソートされる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })

      // 100 のチップを 1000 に更新すると、500 の後ろに移動する
      act(() => {
        result.current.updateChip(1, 1000, "1", "#ef4444")
      })

      expect(result.current.chips[0].amount).toBe(500)
      expect(result.current.chips[1].amount).toBe(1000)
    })
  })

  describe("removeChip", () => {
    it("指定したチップを削除できる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })

      const chipToRemove = result.current.chips.find(c => c.amount === 500)!

      act(() => {
        result.current.removeChip(chipToRemove.id)
      })

      expect(result.current.chips).toHaveLength(1)
      expect(result.current.chips[0].amount).toBe(100)
    })

    it("チップが1行しかない場合は削除しない", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.removeChip(1)
      })

      expect(result.current.chips).toHaveLength(1)
    })
  })

  describe("resetCounts", () => {
    it("全チップの count を 0 にリセットする", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })
      act(() => {
        result.current.updateChipCount(1, 20)
      })

      act(() => {
        result.current.resetCounts()
      })

      for (const chip of result.current.chips) {
        expect(chip.count).toBe(0)
      }
    })
  })

  describe("setChips", () => {
    it("チップを一括設定できる", () => {
      const { result } = renderHook(() => useChips())

      const newChips = [
        { id: 10, amount: 25, unit: "1" as const, count: 5, color: "#22c55e" },
        { id: 11, amount: 100, unit: "1" as const, count: 10, color: "#ef4444" },
      ]

      act(() => {
        result.current.setChips(newChips)
      })

      expect(result.current.chips).toEqual(newChips)
    })
  })

  describe("setNextId", () => {
    it("setNextId 後の addChip で指定した ID 以降が使われる", () => {
      const { result } = renderHook(() => useChips())

      act(() => {
        result.current.setNextId(100)
      })
      act(() => {
        result.current.addChip(500, "1", "#3b82f6")
      })

      const addedChip = result.current.chips.find(c => c.amount === 500)
      expect(addedChip?.id).toBe(100)
    })
  })
})
