import type { Unit } from "@/lib/units"
import type { Session, StackSnapshot } from "@/lib/stack-history"

export interface SessionSummary {
  snapshotCount: number
  durationMs: number
  startBB: number
  endBB: number
  deltaBB: number
  peakBB: number
  lastBlindAmount: number
  lastBlindUnit: Unit
}

export interface ArchivedSession {
  id: string
  startedAt: number
  endedAt: number
  snapshots: StackSnapshot[]
  summary: SessionSummary
}

export interface OverallSummary {
  totalSessions: number
  totalPlayTimeMs: number
  totalDeltaBB: number
  winSessions: number
  loseSessions: number
}

function calculateSummary(snapshots: StackSnapshot[]): SessionSummary {
  if (snapshots.length === 0) {
    return {
      snapshotCount: 0,
      durationMs: 0,
      startBB: 0,
      endBB: 0,
      deltaBB: 0,
      peakBB: 0,
      lastBlindAmount: 0,
      lastBlindUnit: "1",
    }
  }

  const first = snapshots[0]
  const last = snapshots[snapshots.length - 1]
  const peakBB = Math.max(...snapshots.map((s) => s.bbValue))

  return {
    snapshotCount: snapshots.length,
    durationMs: last.timestamp - first.timestamp,
    startBB: first.bbValue,
    endBB: last.bbValue,
    deltaBB: last.bbValue - first.bbValue,
    peakBB,
    lastBlindAmount: last.blindAmount,
    lastBlindUnit: last.blindUnit,
  }
}

export function archiveSession(session: Session): ArchivedSession {
  const { snapshots } = session
  const endedAt = snapshots.length > 0
    ? snapshots[snapshots.length - 1].timestamp
    : session.startedAt

  return {
    id: session.id,
    startedAt: session.startedAt,
    endedAt,
    snapshots,
    summary: calculateSummary(snapshots),
  }
}

export function calculateOverallSummary(sessions: ArchivedSession[]): OverallSummary {
  return {
    totalSessions: sessions.length,
    totalPlayTimeMs: sessions.reduce((sum, s) => sum + s.summary.durationMs, 0),
    totalDeltaBB: sessions.reduce((sum, s) => sum + s.summary.deltaBB, 0),
    winSessions: sessions.filter((s) => s.summary.deltaBB > 0).length,
    loseSessions: sessions.filter((s) => s.summary.deltaBB < 0).length,
  }
}
