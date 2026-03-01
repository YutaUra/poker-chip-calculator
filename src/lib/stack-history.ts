import type { Unit } from "@/lib/units"

// crypto.randomUUID() は Secure Context (HTTPS) でのみ利用可能。
// HTTP 接続（LAN 内 IP アクセスなど）ではフォールバックで UUID v4 を生成する。
export function generateUUID(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant 10
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export interface StackSnapshot {
  id: string
  recordNumber: number
  timestamp: number
  totalChips: number
  bbValue: number
  blindAmount: number
  blindUnit: Unit
  memo: string | null
}

export interface Session {
  id: string
  startedAt: number
  snapshots: StackSnapshot[]
}

export function createSnapshot(params: {
  totalChips: number
  bbValue: number
  blindAmount: number
  blindUnit: Unit
  recordNumber: number
  memo?: string | null
}): StackSnapshot {
  return {
    id: generateUUID(),
    recordNumber: params.recordNumber,
    timestamp: Date.now(),
    totalChips: params.totalChips,
    bbValue: params.bbValue,
    blindAmount: params.blindAmount,
    blindUnit: params.blindUnit,
    memo: params.memo || null,
  }
}

export function addSnapshot(session: Session, snapshot: StackSnapshot): Session {
  return {
    ...session,
    snapshots: [...session.snapshots, snapshot],
  }
}

export function removeLastSnapshot(session: Session): Session {
  return {
    ...session,
    snapshots: session.snapshots.slice(0, -1),
  }
}

export function updateSnapshotMemo(
  session: Session,
  snapshotId: string,
  memo: string | null,
): Session {
  return {
    ...session,
    snapshots: session.snapshots.map((s) =>
      s.id === snapshotId ? { ...s, memo } : s,
    ),
  }
}

export function createSession(): Session {
  return {
    id: generateUUID(),
    startedAt: Date.now(),
    snapshots: [],
  }
}

export function resetSession(): Session {
  return createSession()
}
