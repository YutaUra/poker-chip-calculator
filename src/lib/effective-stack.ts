export function calculateEffectiveStack(myStackBB: number, opponentStackBB: number): number {
  return Math.min(myStackBB, opponentStackBB)
}
