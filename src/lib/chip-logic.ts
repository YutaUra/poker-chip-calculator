import { calculateUnitValue, Unit } from "@/lib/units"

export interface ChipRow {
  id: number
  amount: number
  unit: Unit
  count: number | null
  color: string
}

export function calculateTotal(chips: ChipRow[]): number {
  return chips.reduce(
    (total, chip) => total + calculateUnitValue(chip.amount, chip.unit) * (chip.count ?? 0),
    0,
  )
}

export function calculateBB(
  total: number,
  blindAmount: number | null,
  blindUnit: Unit,
): number {
  if (blindAmount === null || blindAmount === 0) return 0
  return total / calculateUnitValue(blindAmount, blindUnit)
}

export function sortChipsByValue(chips: ChipRow[]): ChipRow[] {
  return [...chips].sort(
    (a, b) => calculateUnitValue(b.amount, b.unit) - calculateUnitValue(a.amount, a.unit),
  )
}
