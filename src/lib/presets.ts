import type { ChipRow } from "./chip-logic"
import { generateUUID } from "./stack-history"
import type { Unit } from "./units"

export interface PresetChip {
  amount: number
  unit: Unit
  count: number
  color: string
}

export interface ChipPreset {
  id: string
  name: string
  category: "system" | "user"
  blindAmount: number
  blindUnit: Unit
  chips: PresetChip[]
}

const WHITE = "#e5e7eb"
const RED = "#ef4444"
const GREEN = "#22c55e"
const BLACK = "#1f2937"
const PURPLE = "#a855f7"

export const SYSTEM_PRESETS: ChipPreset[] = [
  {
    id: "standard",
    name: "Standard (1/5/25/100/500)",
    category: "system",
    blindAmount: 5,
    blindUnit: "1",
    chips: [
      { amount: 1, unit: "1", count: 20, color: WHITE },
      { amount: 5, unit: "1", count: 16, color: RED },
      { amount: 25, unit: "1", count: 8, color: GREEN },
      { amount: 100, unit: "1", count: 2, color: BLACK },
      { amount: 500, unit: "1", count: 1, color: PURPLE },
    ],
  },
  {
    id: "tournament",
    name: "Tournament (100/500/1K/5K)",
    category: "system",
    blindAmount: 100,
    blindUnit: "1",
    chips: [
      { amount: 100, unit: "1", count: 10, color: WHITE },
      { amount: 500, unit: "1", count: 8, color: RED },
      { amount: 1000, unit: "1", count: 6, color: GREEN },
      { amount: 5000, unit: "1", count: 2, color: BLACK },
    ],
  },
  {
    id: "home-game",
    name: "Home Game (10/25/50/100)",
    category: "system",
    blindAmount: 25,
    blindUnit: "1",
    chips: [
      { amount: 10, unit: "1", count: 20, color: WHITE },
      { amount: 25, unit: "1", count: 12, color: RED },
      { amount: 50, unit: "1", count: 8, color: GREEN },
      { amount: 100, unit: "1", count: 4, color: BLACK },
    ],
  },
]

export function loadPreset(preset: ChipPreset, startId = 1): ChipRow[] {
  return preset.chips.map((chip, index) => ({
    id: startId + index,
    amount: chip.amount,
    unit: chip.unit,
    count: chip.count,
    color: chip.color,
  }))
}

export function saveCurrentAsPreset(
  chips: ChipRow[],
  blindAmount: number | null,
  blindUnit: Unit,
  name: string,
  existingUserPresets: ChipPreset[],
): ChipPreset {
  const presetName = name.trim() || `Preset ${existingUserPresets.length + 1}`
  return {
    id: generateUUID(),
    name: presetName,
    category: "user",
    blindAmount: blindAmount ?? 0,
    blindUnit,
    chips: chips.map(({ amount, unit, count, color }) => ({
      amount,
      unit,
      count: count ?? 0,
      color,
    })),
  }
}

export function deleteUserPreset(presets: ChipPreset[], id: string): ChipPreset[] {
  return presets.filter((p) => p.id !== id)
}
