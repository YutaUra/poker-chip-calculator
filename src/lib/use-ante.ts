import { useSessionStorage } from "usehooks-ts"
import type { Unit } from "@/lib/units"

export interface UseAnteReturn {
  anteAmount: number | null
  anteUnit: Unit
  players: number
  setAnteAmount: (v: number | null) => void
  setAnteUnit: (u: Unit) => void
  setPlayers: (n: number) => void
}

export function useAnte(): UseAnteReturn {
  const [anteAmount, setAnteAmount] = useSessionStorage<number | null>("current-ante-amount", 0)
  const [anteUnit, setAnteUnit] = useSessionStorage<Unit>("current-ante-unit", "1")
  const [players, setPlayers] = useSessionStorage<number>("current-players", 9)

  return { anteAmount, anteUnit, players, setAnteAmount, setAnteUnit, setPlayers }
}
