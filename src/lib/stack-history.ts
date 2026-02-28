import type { Unit } from "@/lib/units"

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
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    startedAt: Date.now(),
    snapshots: [],
  }
}

export function resetSession(): Session {
  return createSession()
}
