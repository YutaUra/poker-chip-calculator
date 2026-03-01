import { useMemo, useCallback } from "react"
import { useSessionStorage } from "usehooks-ts"
import { calculateEffectiveStack } from "@/lib/effective-stack"
import {
  STORAGE_KEY_EFFECTIVE_STACK_ENABLED,
  STORAGE_KEY_OPPONENT_STACK_BB,
} from "@/lib/storage-keys"

export interface UseEffectiveStackReturn {
  enabled: boolean
  opponentBB: number
  effectiveBB: number
  effectiveDisplay: string
  toggleEnabled: () => void
  setOpponentBB: (bb: number) => void
}

export function useEffectiveStack(myBB: number): UseEffectiveStackReturn {
  const [enabled, setEnabled] = useSessionStorage<boolean>(
    STORAGE_KEY_EFFECTIVE_STACK_ENABLED,
    false,
  )
  const [opponentBB, setOpponentBB] = useSessionStorage<number>(
    STORAGE_KEY_OPPONENT_STACK_BB,
    100,
  )

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev)
  }, [setEnabled])

  const { effectiveBB, effectiveDisplay } = useMemo(() => {
    const bb = calculateEffectiveStack(myBB, opponentBB)
    const display = bb % 1 === 0 ? bb.toString() : bb.toFixed(1)
    return { effectiveBB: bb, effectiveDisplay: display }
  }, [myBB, opponentBB])

  return {
    enabled,
    opponentBB,
    effectiveBB,
    effectiveDisplay,
    toggleEnabled,
    setOpponentBB,
  }
}
