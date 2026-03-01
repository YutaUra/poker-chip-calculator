import { describe, it, expect } from "vitest"
import { saveCurrentAsPreset, deleteUserPreset } from "./presets"
import type { ChipPreset } from "./presets"
import type { ChipRow } from "./chip-logic"
import type { Unit } from "./units"

describe("saveCurrentAsPreset", () => {
  const chips: ChipRow[] = [
    { id: 1, amount: 5, unit: "1", count: 20, color: "#ef4444" },
    { id: 2, amount: 25, unit: "1", count: 8, color: "#22c55e" },
  ]
  const blindAmount = 5
  const blindUnit: Unit = "1"

  it("現在のチップ構成からユーザープリセットを生成する", () => {
    const preset = saveCurrentAsPreset(chips, blindAmount, blindUnit, "My Preset", [])
    expect(preset.name).toBe("My Preset")
    expect(preset.category).toBe("user")
    expect(preset.blindAmount).toBe(5)
    expect(preset.blindUnit).toBe("1")
    expect(preset.chips).toHaveLength(2)
    expect(preset.chips[0]).toEqual({ amount: 5, unit: "1", count: 20, color: "#ef4444" })
    expect(preset.chips[1]).toEqual({ amount: 25, unit: "1", count: 8, color: "#22c55e" })
  })

  it("id はプリセットに含まれない（ChipRow の id を除外する）", () => {
    const preset = saveCurrentAsPreset(chips, blindAmount, blindUnit, "Test", [])
    for (const chip of preset.chips) {
      expect(chip).not.toHaveProperty("id")
    }
  })

  it("名前が空の場合は Preset N と自動命名される", () => {
    const preset = saveCurrentAsPreset(chips, blindAmount, blindUnit, "", [])
    expect(preset.name).toBe("Preset 1")
  })

  it("既存ユーザープリセットが1件ある場合は Preset 2 になる", () => {
    const existing: ChipPreset[] = [
      {
        id: "existing",
        name: "Existing",
        category: "user",
        blindAmount: 2,
        blindUnit: "1",
        chips: [],
      },
    ]
    const preset = saveCurrentAsPreset(chips, blindAmount, blindUnit, "", existing)
    expect(preset.name).toBe("Preset 2")
  })

  it("count が null のチップは 0 として保存する", () => {
    const chipsWithNull: ChipRow[] = [
      { id: 1, amount: 5, unit: "1", count: null, color: "#ef4444" },
    ]
    const preset = saveCurrentAsPreset(chipsWithNull, blindAmount, blindUnit, "Test", [])
    expect(preset.chips[0]!.count).toBe(0)
  })
})

describe("deleteUserPreset", () => {
  it("指定した id のプリセットを削除する", () => {
    const presets: ChipPreset[] = [
      { id: "a", name: "A", category: "user", blindAmount: 2, blindUnit: "1", chips: [] },
      { id: "b", name: "B", category: "user", blindAmount: 5, blindUnit: "1", chips: [] },
    ]
    const result = deleteUserPreset(presets, "a")
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe("b")
  })

  it("存在しない id を削除しても元の配列と同じ長さを返す", () => {
    const presets: ChipPreset[] = [
      { id: "a", name: "A", category: "user", blindAmount: 2, blindUnit: "1", chips: [] },
    ]
    const result = deleteUserPreset(presets, "nonexistent")
    expect(result).toHaveLength(1)
  })
})
