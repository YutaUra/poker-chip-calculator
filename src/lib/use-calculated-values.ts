import { useMemo } from "react"
import { calculateTotal, calculateBB } from "@/lib/chip-logic"
import type { ChipRow } from "@/lib/chip-logic"
import type { Unit } from "@/lib/units"

export interface CalculatedValues {
  total: number
  bbValue: number
  bbDisplay: string
}

export function useCalculatedValues(
  chips: ChipRow[],
  blindAmount: number | null,
  blindUnit: Unit,
): CalculatedValues {
  return useMemo(() => {
    const total = calculateTotal(chips)
    const bbValue = calculateBB(total, blindAmount, blindUnit)
    const bbDisplay = bbValue % 1 === 0 ? bbValue.toString() : bbValue.toFixed(1)
    return { total, bbValue, bbDisplay }
  }, [chips, blindAmount, blindUnit])
}
