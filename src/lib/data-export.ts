import type { Session, StackSnapshot } from "@/lib/stack-history"

export interface ExportData {
  version: 1
  exportedAt: string
  session: Session
}

const CSV_HEADER = "Record,Timestamp,BB Value,Total Chips,Blind Amount,Blind Unit,Memo"

function escapeCSVField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportToCSV(snapshots: StackSnapshot[]): string {
  const BOM = "\uFEFF"
  const lines = [CSV_HEADER]

  for (const snap of snapshots) {
    const timestamp = new Date(snap.timestamp).toISOString()
    const memo = snap.memo ? escapeCSVField(snap.memo) : ""
    lines.push(
      `${snap.recordNumber},${timestamp},${snap.bbValue},${snap.totalChips},${snap.blindAmount},${snap.blindUnit},${memo}`,
    )
  }

  return BOM + lines.join("\r\n") + "\r\n"
}

export function exportToJSON(session: Session): string {
  const exportData: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    session,
  }
  return JSON.stringify(exportData, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function generateExportFilename(format: "csv" | "json"): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `poker-session-${year}-${month}-${day}.${format}`
}

const VALID_UNITS = new Set(["1", "K", "M", "B", "T"])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isValidSnapshot(snap: unknown): boolean {
  if (!isRecord(snap)) return false
  const requiredFields: Array<[string, string]> = [
    ["id", "string"],
    ["recordNumber", "number"],
    ["timestamp", "number"],
    ["totalChips", "number"],
    ["bbValue", "number"],
    ["blindAmount", "number"],
    ["blindUnit", "string"],
  ]
  for (const [field, type] of requiredFields) {
    if (typeof snap[field] !== type) return false
  }
  if (!VALID_UNITS.has(snap["blindUnit"] as string)) return false
  return true
}

export function validateImportData(data: unknown): data is ExportData {
  if (!isRecord(data)) return false
  if (data["version"] !== 1) return false

  const session = data["session"]
  if (!isRecord(session)) return false
  if (typeof session["id"] !== "string") return false
  if (typeof session["startedAt"] !== "number") return false
  if (!Array.isArray(session["snapshots"])) return false

  for (const snap of session["snapshots"]) {
    if (!isValidSnapshot(snap)) return false
  }

  return true
}

export function importFromJSON(jsonString: string): Session | { error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    return { error: "JSONの解析に失敗しました" }
  }

  if (!validateImportData(parsed)) {
    return { error: "データ形式が不正です" }
  }

  return parsed.session
}
