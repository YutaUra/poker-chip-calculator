import { useMemo, useCallback } from "react"
import { useSessionStorage } from "usehooks-ts"
import { calculatePotOdds, formatPercent } from "@/lib/pot-odds"
import type { PotOddsResult } from "@/lib/pot-odds"
import {
  STORAGE_KEY_POT_ODDS_ENABLED,
  STORAGE_KEY_POT_SIZE_BB,
  STORAGE_KEY_CALL_AMOUNT_BB,
} from "@/lib/storage-keys"

export interface UsePotOddsReturn {
  enabled: boolean
  potSize: number
  callAmount: number
  result: PotOddsResult
  formattedPotOdds: string
  formattedEquity: string
  toggleEnabled: () => void
  setPotSize: (value: number) => void
  setCallAmount: (value: number) => void
}

export function usePotOdds(): UsePotOddsReturn {
  const [enabled, setEnabled] = useSessionStorage<boolean>(STORAGE_KEY_POT_ODDS_ENABLED, false)
  const [potSize, setPotSize] = useSessionStorage<number>(STORAGE_KEY_POT_SIZE_BB, 0)
  const [callAmount, setCallAmount] = useSessionStorage<number>(STORAGE_KEY_CALL_AMOUNT_BB, 0)

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev)
  }, [setEnabled])

  const result = useMemo(
    () => calculatePotOdds({ potSize, callAmount }),
    [potSize, callAmount],
  )

  const formattedPotOdds = useMemo(() => formatPercent(result.potOdds), [result.potOdds])
  const formattedEquity = useMemo(() => formatPercent(result.requiredEquity), [result.requiredEquity])

  return {
    enabled,
    potSize,
    callAmount,
    result,
    formattedPotOdds,
    formattedEquity,
    toggleEnabled,
    setPotSize,
    setCallAmount,
  }
}
