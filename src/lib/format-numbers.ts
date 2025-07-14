export function formatChipAmount(amount: number): string {
  if (amount === 0) return "0"

  // コンパクト表記で有効数字3桁
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumSignificantDigits: 3,
    minimumSignificantDigits: 1,
  })

  const formatted = formatter.format(amount)

  // ポーカーでは大文字のK/M/B/Tが一般的なので変換
  return formatted.replace("k", "K").replace("m", "M").replace("b", "B").replace("t", "T")
}

// 通常の数値フォーマット（カンマ区切り）
export function formatFullNumber(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount)
}

// 単位付き文字列を数値に変換
export function parseUnitValue(value: string): number {
  if (!value || value.trim() === "") return 0

  const cleanValue = value.trim().toUpperCase()
  const numericPart = Number.parseFloat(cleanValue)

  if (isNaN(numericPart)) return 0

  if (cleanValue.endsWith("T")) {
    return numericPart * 1000000000000 // 兆
  } else if (cleanValue.endsWith("B")) {
    return numericPart * 1000000000 // 十億
  } else if (cleanValue.endsWith("M")) {
    return numericPart * 1000000 // 百万
  } else if (cleanValue.endsWith("K")) {
    return numericPart * 1000 // 千
  } else {
    return numericPart
  }
}

// 数値を適切な単位付き文字列に変換（入力フィールド用）
export function formatInputValue(amount: number): string {
  if (amount === 0) return "0"

  if (amount >= 1000000000000 && amount % 1000000000000 === 0) {
    return amount / 1000000000000 + "T"
  } else if (amount >= 1000000000 && amount % 1000000000 === 0) {
    return amount / 1000000000 + "B"
  } else if (amount >= 1000000 && amount % 1000000 === 0) {
    return amount / 1000000 + "M"
  } else if (amount >= 1000 && amount % 1000 === 0) {
    return amount / 1000 + "K"
  } else {
    return amount.toString()
  }
}
