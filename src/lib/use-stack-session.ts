import { useLocalStorage } from "usehooks-ts"
import { toast } from "sonner"
import type { Unit } from "@/lib/units"
import type { Session } from "@/lib/stack-history"
import type { ArchivedSession } from "@/lib/session-archive"
import {
  createSession,
  createSnapshot,
  addSnapshot,
  removeLastSnapshot,
  updateSnapshotMemo,
} from "@/lib/stack-history"
import { archiveSession } from "@/lib/session-archive"

interface UseStackSessionReturn {
  session: Session
  record: (params: {
    total: number
    bbValue: number
    blindAmount: number | null
    blindUnit: Unit
    memo: string
  }) => void
  removeLast: () => void
  reset: () => void
  archiveAndReset: (onArchive: (archived: ArchivedSession) => void) => void
  updateMemo: (snapshotId: string, memo: string | null) => void
  importSession: (imported: Session) => void
}

export function useStackSession(): UseStackSessionReturn {
  const [session, setSession] = useLocalStorage<Session>("stack-session", createSession())

  const record: UseStackSessionReturn["record"] = (params) => {
    const recordNumber = session.snapshots.length + 1
    const memo = params.memo.trim() || null
    const snapshot = createSnapshot({
      totalChips: params.total,
      bbValue: params.bbValue,
      blindAmount: params.blindAmount ?? 0,
      blindUnit: params.blindUnit,
      recordNumber,
      memo,
    })
    setSession((prev) => addSnapshot(prev, snapshot))
    toast.success(`記録しました (#${recordNumber})`)
  }

  const removeLast = () => {
    if (session.snapshots.length === 0) return
    setSession((prev) => removeLastSnapshot(prev))
  }

  const reset = () => {
    setSession(createSession())
  }

  const archiveAndResetFn: UseStackSessionReturn["archiveAndReset"] = (onArchive) => {
    const archived = archiveSession(session)
    onArchive(archived)
    setSession(createSession())
    toast.success("セッションを保存しました")
  }

  const updateMemo = (snapshotId: string, memo: string | null) => {
    setSession((prev) => updateSnapshotMemo(prev, snapshotId, memo))
  }

  const importSession = (imported: Session) => {
    setSession(imported)
    toast.success("セッションをインポートしました")
  }

  return { session, record, removeLast, reset, archiveAndReset: archiveAndResetFn, updateMemo, importSession }
}
