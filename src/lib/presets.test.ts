import { describe, it, expect } from "vitest"
import { SYSTEM_PRESETS, loadPreset } from "./presets"
import type { ChipPreset } from "./presets"
import { calculateUnitValue } from "./units"

describe("SYSTEM_PRESETS", () => {
  const expectedTotals: Record<string, number> = {
    standard: 1000,
    tournament: 21000,
    "home-game": 1300,
  }

  it.each(Object.entries(expectedTotals))(
    "%s の合計額が %d になる",
    (presetId, expectedTotal) => {
      const preset = SYSTEM_PRESETS.find((p) => p.id === presetId)
      expect(preset).toBeDefined()

      const total = preset!.chips.reduce(
        (sum, chip) => sum + calculateUnitValue(chip.amount, chip.unit) * chip.count,
        0,
      )
      expect(total).toBe(expectedTotal)
    },
  )

  it.each(Object.entries(expectedTotals))(
    "%s にブラインド値が設定されている",
    (presetId) => {
      const preset = SYSTEM_PRESETS.find((p) => p.id === presetId)!
      const blindValue = calculateUnitValue(preset.blindAmount, preset.blindUnit)
      expect(blindValue).toBeGreaterThan(0)
    },
  )

  it("すべてのビルトインプリセットの category が system である", () => {
    for (const preset of SYSTEM_PRESETS) {
      expect(preset.category).toBe("system")
    }
  })

  it("ビルトインプリセットが3種類存在する", () => {
    expect(SYSTEM_PRESETS).toHaveLength(3)
  })
})

describe("loadPreset", () => {
  it("プリセットから ChipRow[] を生成し各行に一意な id を採番する", () => {
    const preset: ChipPreset = {
      id: "test",
      name: "Test",
      category: "system",
      blindAmount: 2,
      blindUnit: "1",
      chips: [
        { amount: 1, unit: "1", count: 10, color: "#e5e7eb" },
        { amount: 5, unit: "1", count: 18, color: "#ef4444" },
      ],
    }

    const rows = loadPreset(preset)
    expect(rows).toHaveLength(2)
    expect(rows[0]!.id).not.toBe(rows[1]!.id)
    expect(rows[0]!.amount).toBe(1)
    expect(rows[0]!.count).toBe(10)
    expect(rows[1]!.amount).toBe(5)
    expect(rows[1]!.count).toBe(18)
  })

  it("startId を指定すると指定値から連番が振られる", () => {
    const preset: ChipPreset = {
      id: "test",
      name: "Test",
      category: "user",
      blindAmount: 5,
      blindUnit: "1",
      chips: [
        { amount: 5, unit: "1", count: 20, color: "#ef4444" },
        { amount: 25, unit: "1", count: 8, color: "#22c55e" },
      ],
    }

    const rows = loadPreset(preset, 10)
    expect(rows[0]!.id).toBe(10)
    expect(rows[1]!.id).toBe(11)
  })
})
