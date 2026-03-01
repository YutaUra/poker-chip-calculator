import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePresets } from "./use-presets"
import type { ChipRow } from "./chip-logic"
import type { ChipPreset } from "./presets"
import { SYSTEM_PRESETS } from "./presets"
import type { UsePresetsOptions } from "./use-presets"

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}))

const defaultChips: ChipRow[] = [
  { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
]

function renderUsePresets(overrides?: {
  chips?: ChipRow[]
  blindAmount?: number | null
  blindUnit?: "1" | "K" | "M" | "B" | "T"
  onApplyPreset?: UsePresetsOptions["onApplyPreset"]
}) {
  const onApplyPreset: UsePresetsOptions["onApplyPreset"] = overrides?.onApplyPreset ?? vi.fn()
  return {
    ...renderHook(() =>
      usePresets({
        chips: overrides?.chips ?? defaultChips,
        blindAmount: overrides?.blindAmount ?? 100,
        blindUnit: overrides?.blindUnit ?? "1",
        onApplyPreset,
      }),
    ),
    onApplyPreset,
  }
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe("usePresets", () => {
  describe("初期状態", () => {
    it("ユーザープリセットが空配列で初期化される", () => {
      const { result } = renderUsePresets()
      expect(result.current.userPresets).toEqual([])
    })

    it("ダイアログが閉じた状態で初期化される", () => {
      const { result } = renderUsePresets()
      expect(result.current.dialogOpen).toBe(false)
    })
  })

  describe("ダイアログ制御", () => {
    it("setDialogOpen(true) でダイアログが開く", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.setDialogOpen(true)
      })

      expect(result.current.dialogOpen).toBe(true)
    })

    it("setDialogOpen(false) でダイアログが閉じる", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.setDialogOpen(true)
      })
      act(() => {
        result.current.setDialogOpen(false)
      })

      expect(result.current.dialogOpen).toBe(false)
    })
  })

  describe("selectPreset", () => {
    it("プリセット選択時に onApplyPreset が呼ばれる", () => {
      const onApplyPreset = vi.fn()
      const { result } = renderUsePresets({ onApplyPreset })
      const preset = SYSTEM_PRESETS[0]!

      act(() => {
        result.current.selectPreset(preset)
      })

      expect(onApplyPreset).toHaveBeenCalledTimes(1)
      const call = onApplyPreset.mock.calls[0]![0]
      expect(call.rows).toHaveLength(preset.chips.length)
      expect(call.blindAmount).toBe(preset.blindAmount)
      expect(call.blindUnit).toBe(preset.blindUnit)
    })

    it("プリセット選択後にダイアログが閉じる", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.setDialogOpen(true)
      })
      act(() => {
        result.current.selectPreset(SYSTEM_PRESETS[0]!)
      })

      expect(result.current.dialogOpen).toBe(false)
    })
  })

  describe("savePreset", () => {
    it("現在のチップ構成をユーザープリセットとして保存する", async () => {
      const { toast } = await import("sonner")
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("My Preset")
      })

      expect(result.current.userPresets).toHaveLength(1)
      expect(result.current.userPresets[0]!.name).toBe("My Preset")
      expect(result.current.userPresets[0]!.category).toBe("user")
      expect(toast.success).toHaveBeenCalled()
    })

    it("名前が空の場合は自動命名される", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("")
      })

      expect(result.current.userPresets[0]!.name).toBe("Preset 1")
    })

    it("複数のプリセットを保存できる", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("Preset A")
      })
      act(() => {
        result.current.savePreset("Preset B")
      })

      expect(result.current.userPresets).toHaveLength(2)
    })
  })

  describe("deletePreset", () => {
    it("指定した id のプリセットを削除する", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("To Delete")
      })
      const id = result.current.userPresets[0]!.id

      act(() => {
        result.current.deletePreset(id)
      })

      expect(result.current.userPresets).toHaveLength(0)
    })

    it("存在しない id を指定しても既存のプリセットに影響しない", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("Keep")
      })

      act(() => {
        result.current.deletePreset("nonexistent")
      })

      expect(result.current.userPresets).toHaveLength(1)
    })
  })

  describe("localStorage 永続化", () => {
    it("保存したプリセットが localStorage に永続化される", () => {
      const { result } = renderUsePresets()

      act(() => {
        result.current.savePreset("Persisted")
      })

      const stored = JSON.parse(localStorage.getItem("chip-presets") ?? "[]") as ChipPreset[]
      expect(stored).toHaveLength(1)
      expect(stored[0]!.name).toBe("Persisted")
    })
  })
})
