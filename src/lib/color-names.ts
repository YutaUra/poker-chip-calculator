// ChipEditForm の chipColors と COLOR_NAMES 仕様の両方をカバーする。
// ChipEditForm が使う hex（#10b981 など）と仕様で指定された hex（#22c55e など）が
// 異なるケースがあるため、両方を登録している。
const COLOR_NAMES: Record<string, string> = {
  "#ef4444": "赤",
  "#3b82f6": "青",
  "#22c55e": "緑",
  "#10b981": "緑",
  "#a855f7": "紫",
  "#8b5cf6": "紫",
  "#eab308": "黄",
  "#ec4899": "ピンク",
  "#f97316": "オレンジ",
  "#6b7280": "グレー",
  "#e5e7eb": "白",
  "#ffffff": "白",
  "#1f2937": "黒",
  "#171717": "黒",
}

export function getColorName(hex: string): string {
  return COLOR_NAMES[hex.toLowerCase()] ?? "カスタム"
}
