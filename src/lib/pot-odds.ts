export interface PotOddsInput {
  potSize: number     // BB単位
  callAmount: number  // BB単位
}

export interface PotOddsResult {
  potOdds: number        // 0-100 のパーセント値
  requiredEquity: number // 0-100（= potOdds）
}

export function calculatePotOdds(input: PotOddsInput): PotOddsResult {
  if (input.callAmount <= 0 || input.potSize + input.callAmount <= 0) {
    return { potOdds: 0, requiredEquity: 0 }
  }
  const potOdds = (input.callAmount / (input.potSize + input.callAmount)) * 100
  return { potOdds, requiredEquity: potOdds }
}

/**
 * パーセント値を表示用にフォーマットする。
 * 整数なら小数なし ("25%")、端数ありなら小数1桁 ("33.3%")。
 */
export function formatPercent(value: number): string {
  if (value % 1 === 0) {
    return `${value}%`
  }
  return `${value.toFixed(1)}%`
}
