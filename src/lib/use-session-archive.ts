import { useMemo } from "react"
import { useLocalStorage } from "usehooks-ts"
import { toast } from "sonner"
import type { ArchivedSession, OverallSummary } from "@/lib/session-archive"
import { calculateOverallSummary } from "@/lib/session-archive"
import { STORAGE_KEY_SESSION_ARCHIVE } from "@/lib/storage-keys"

const MAX_ARCHIVES = 50

interface UseSessionArchiveReturn {
  archives: ArchivedSession[]
  overallSummary: OverallSummary
  addArchive: (session: ArchivedSession) => void
  removeArchive: (id: string) => void
}

export function useSessionArchive(): UseSessionArchiveReturn {
  const [archives, setArchives] = useLocalStorage<ArchivedSession[]>(
    STORAGE_KEY_SESSION_ARCHIVE,
    [],
  )

  const overallSummary = useMemo(
    () => calculateOverallSummary(archives),
    [archives],
  )

  const addArchive = (session: ArchivedSession) => {
    try {
      setArchives((prev) => {
        const next = [...prev, session]
        if (next.length > MAX_ARCHIVES) {
          return next.slice(next.length - MAX_ARCHIVES)
        }
        return next
      })
    } catch {
      toast.error("履歴の保存に失敗しました")
    }
  }

  const removeArchive = (id: string) => {
    try {
      setArchives((prev) => prev.filter((a) => a.id !== id))
    } catch {
      toast.error("履歴の削除に失敗しました")
    }
  }

  return { archives, overallSummary, addArchive, removeArchive }
}
