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
    id: "cash-1-2",
    name: "Cash 1/2",
    category: "system",
    blindAmount: 2,
    blindUnit: "1",
    chips: [
      { amount: 1, unit: "1", count: 10, color: WHITE },
      { amount: 5, unit: "1", count: 18, color: RED },
      { amount: 25, unit: "1", count: 4, color: GREEN },
    ],
  },
  {
    id: "cash-1-3",
    name: "Cash 1/3",
    category: "system",
    blindAmount: 3,
    blindUnit: "1",
    chips: [
      { amount: 1, unit: "1", count: 15, color: WHITE },
      { amount: 5, unit: "1", count: 17, color: RED },
      { amount: 25, unit: "1", count: 8, color: GREEN },
    ],
  },
  {
    id: "cash-2-5",
    name: "Cash 2/5",
    category: "system",
    blindAmount: 5,
    blindUnit: "1",
    chips: [
      { amount: 5, unit: "1", count: 20, color: RED },
      { amount: 25, unit: "1", count: 8, color: GREEN },
      { amount: 100, unit: "1", count: 2, color: BLACK },
    ],
  },
  {
    id: "cash-5-10",
    name: "Cash 5/10",
    category: "system",
    blindAmount: 10,
    blindUnit: "1",
    chips: [
      { amount: 5, unit: "1", count: 10, color: RED },
      { amount: 25, unit: "1", count: 18, color: GREEN },
      { amount: 100, unit: "1", count: 5, color: BLACK },
    ],
  },
  {
    id: "tournament-5k",
    name: "Tournament 5K",
    category: "system",
    blindAmount: 50,
    blindUnit: "1",
    chips: [
      { amount: 25, unit: "1", count: 8, color: WHITE },
      { amount: 100, unit: "1", count: 8, color: RED },
      { amount: 500, unit: "1", count: 4, color: GREEN },
      { amount: 1000, unit: "1", count: 2, color: BLACK },
    ],
  },
  {
    id: "tournament-30k",
    name: "Tournament 30K",
    category: "system",
    blindAmount: 300,
    blindUnit: "1",
    chips: [
      { amount: 100, unit: "1", count: 10, color: RED },
      { amount: 500, unit: "1", count: 2, color: GREEN },
      { amount: 1000, unit: "1", count: 8, color: BLACK },
      { amount: 5000, unit: "1", count: 4, color: PURPLE },
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
