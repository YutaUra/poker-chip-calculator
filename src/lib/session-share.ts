import type { Session } from "@/lib/stack-history"
import type { Unit } from "@/lib/units"

// --- Types ---

export interface SessionShareSummary {
  bbProfit: number
  durationMinutes: number
  snapshotCount: number
}

export interface ShareConfig {
  chips: Array<{ amount: number; unit: Unit; count: number; color: string }>
  blind: { amount: number; unit: Unit }
}

// --- Session Summary ---

export function calculateShareSummary(session: Session): SessionShareSummary | null {
  if (session.snapshots.length < 2) return null

  const first = session.snapshots[0]
  const last = session.snapshots[session.snapshots.length - 1]

  // length >= 2 を事前チェック済みのため first/last は必ず存在するが、
  // TypeScript の noUncheckedIndexedAccess では undefined の可能性が残る。
  if (!first || !last) return null

  return {
    bbProfit: last.bbValue - first.bbValue,
    durationMinutes: Math.round((last.timestamp - first.timestamp) / (60 * 1000)),
    snapshotCount: session.snapshots.length,
  }
}

// --- Share Text ---

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return `${hours}h ${mins}m`
}

function formatBBProfit(bbProfit: number): string {
  const formatted = bbProfit.toFixed(1)
  if (bbProfit > 0) return `+${formatted}`
  return formatted
}

export function generateShareText(summary: SessionShareSummary): string {
  const profit = formatBBProfit(summary.bbProfit)
  const duration = formatDuration(summary.durationMinutes)
  return `Session Result: ${profit}BB (${duration}) \u{1F4CA} #PokerChipCalc`
}

// --- Chip Config Encode/Decode ---

const VALID_UNITS: readonly string[] = ["1", "K", "M", "B", "T"]

function isValidUnit(value: unknown): value is Unit {
  return typeof value === "string" && VALID_UNITS.includes(value)
}

function isValidShareConfig(data: unknown): data is ShareConfig {
  if (typeof data !== "object" || data === null) return false
  const obj = data as Record<string, unknown>

  const chips = obj["chips"]
  if (!Array.isArray(chips)) return false
  for (const chip of chips) {
    if (typeof chip !== "object" || chip === null) return false
    const c = chip as Record<string, unknown>
    if (typeof c["amount"] !== "number") return false
    if (!isValidUnit(c["unit"])) return false
    if (typeof c["count"] !== "number") return false
    if (typeof c["color"] !== "string") return false
  }

  const blind = obj["blind"]
  if (typeof blind !== "object" || blind === null) return false
  const b = blind as Record<string, unknown>
  if (typeof b["amount"] !== "number") return false
  if (!isValidUnit(b["unit"])) return false

  return true
}

export function encodeChipConfig(config: ShareConfig): string {
  return btoa(JSON.stringify(config))
}

export function decodeChipConfig(encoded: string): ShareConfig | null {
  try {
    const json = atob(encoded)
    const data: unknown = JSON.parse(json)
    if (!isValidShareConfig(data)) return null
    return data
  } catch {
    return null
  }
}
