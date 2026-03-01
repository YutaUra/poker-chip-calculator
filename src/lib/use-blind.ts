import { useSessionStorage } from "usehooks-ts"
import { STORAGE_KEY_BLIND_AMOUNT, STORAGE_KEY_BLIND_UNIT } from "@/lib/storage-keys"
import type { Unit } from "@/lib/units"

export interface UseBlindReturn {
  amount: number | null
  unit: Unit
  setAmount: (amount: number | null) => void
  setUnit: (unit: Unit) => void
  set: (amount: number | null, unit: Unit) => void
}

export function useBlind(): UseBlindReturn {
  const [amount, setAmount] = useSessionStorage<number | null>(STORAGE_KEY_BLIND_AMOUNT, 100)
  const [unit, setUnit] = useSessionStorage<Unit>(STORAGE_KEY_BLIND_UNIT, "1")

  const set = (newAmount: number | null, newUnit: Unit) => {
    setAmount(newAmount)
    setUnit(newUnit)
  }

  return { amount, unit, setAmount, setUnit, set }
}
