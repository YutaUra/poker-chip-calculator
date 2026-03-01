export interface MRatioInput {
  totalStack: number
  bbAmount: number
  anteAmount: number
  players: number
}

export type MZone = "green" | "yellow" | "orange" | "red"

/**
 * M = totalStack / (SB + BB + ante × players)
 * SB = bbAmount / 2
 */
export function calculateMRatio(input: MRatioInput): number {
  const { totalStack, bbAmount, anteAmount, players } = input
  if (bbAmount === 0 || totalStack === 0) return 0

  const sb = bbAmount / 2
  const pot = sb + bbAmount + anteAmount * players
  return totalStack / pot
}

export function getMZone(m: number): MZone {
  if (m >= 20) return "green"
  if (m >= 10) return "yellow"
  if (m >= 5) return "orange"
  return "red"
}
