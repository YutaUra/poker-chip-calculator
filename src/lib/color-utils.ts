/**
 * HSL色空間の値をhexカラーコードに変換する。
 *
 * @param h - 色相 (0-360)
 * @param s - 彩度 (0-100)
 * @param l - 明度 (0-100)
 * @returns "#rrggbb" 形式の hex カラーコード
 */
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c; g = x; b = 0
  } else if (h < 120) {
    r = x; g = c; b = 0
  } else if (h < 180) {
    r = 0; g = c; b = x
  } else if (h < 240) {
    r = 0; g = x; b = c
  } else if (h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0")

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const HUE_STEPS = 16
const LIGHTNESS_STEPS = 16
const SATURATION = 80

/**
 * HSLベースの16×16カラーグリッドを生成する。
 * 行（Y軸）= Lightness（上が明るい）、列（X軸）= Hue。
 *
 * @returns 16行×16列の hex カラーコード二次元配列
 */
export function generateColorGrid(): string[][] {
  const grid: string[][] = []

  for (let li = 0; li < LIGHTNESS_STEPS; li++) {
    // 明度: 上から下へ 90% → 15%
    const l = 90 - (li * 75) / (LIGHTNESS_STEPS - 1)
    const row: string[] = []

    for (let hi = 0; hi < HUE_STEPS; hi++) {
      const h = (hi * 360) / HUE_STEPS
      row.push(hslToHex(h, SATURATION, l))
    }

    grid.push(row)
  }

  return grid
}

export function isValidHex(value: string): boolean {
  const stripped = value.startsWith("#") ? value.slice(1) : value
  return /^[0-9a-fA-F]{6}$/.test(stripped)
}
