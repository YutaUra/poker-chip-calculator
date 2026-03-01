import { useRef } from "react"
import { useSessionStorage } from "usehooks-ts"
import { sortChipsByValue } from "@/lib/chip-logic"
import type { ChipRow } from "@/lib/chip-logic"
import type { Unit } from "@/lib/units"

export interface UseChipsReturn {
  chips: ChipRow[]
  updateChip: (id: number, amount: number, unit: Unit, color: string) => void
  updateChipCount: (id: number, value: number | null) => void
  addChip: (amount: number, unit: Unit, color: string) => void
  removeChip: (id: number) => void
  resetCounts: () => void
  setChips: (chips: ChipRow[]) => void
  setNextId: (id: number) => void
}

export function useChips(): UseChipsReturn {
  const [chips, setChipsStorage] = useSessionStorage<ChipRow[]>("chips", [
    { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
  ])
  const nextIdRef = useRef(Math.max(0, ...chips.map(c => c.id)) + 1)

  const updateChip = (id: number, amount: number, unit: Unit, color: string) => {
    setChipsStorage((prev) => sortChipsByValue(prev.map((chip) => (chip.id === id ? { ...chip, amount, unit, color } : chip))))
  }

  const updateChipCount = (id: number, value: number | null) => {
    setChipsStorage((prev) => prev.map((chip) => (chip.id === id ? { ...chip, count: value } : chip)))
  }

  const addChip = (amount: number, unit: Unit, color: string) => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setChipsStorage((prev) => sortChipsByValue([...prev, { id, amount, unit, count: 0, color }]))
  }

  const removeChip = (id: number) => {
    setChipsStorage((prev) => prev.length > 1 ? prev.filter((chip) => chip.id !== id) : prev)
  }

  const resetCounts = () => {
    setChipsStorage((prev) => prev.map((chip) => ({ ...chip, count: 0 })))
  }

  const setChips = (newChips: ChipRow[]) => {
    setChipsStorage(newChips)
  }

  const setNextId = (id: number) => {
    nextIdRef.current = id
  }

  return {
    chips,
    updateChip,
    updateChipCount,
    addChip,
    removeChip,
    resetCounts,
    setChips,
    setNextId,
  }
}
