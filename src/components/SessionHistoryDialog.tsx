import { useState } from "react"
import { Trash2 } from "lucide-react"
import type { ArchivedSession, OverallSummary } from "@/lib/session-archive"
import StackGraph from "./StackGraph"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface SessionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  archives: ArchivedSession[]
  overallSummary: OverallSummary
  onRemoveArchive: (id: string) => void
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function formatDeltaBB(delta: number): string {
  const sign = delta >= 0 ? "+" : ""
  return `${sign}${delta.toFixed(1)} BB`
}

export default function SessionHistoryDialog({
  open,
  onOpenChange,
  archives,
  overallSummary,
  onRemoveArchive,
}: SessionHistoryDialogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onRemoveArchive(deleteConfirmId)
      setDeleteConfirmId(null)
      setExpandedId(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>セッション履歴</DialogTitle>
            <DialogDescription>
              過去のセッション記録を確認できます
            </DialogDescription>
          </DialogHeader>

          {archives.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              セッション履歴がありません
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center py-2">
                <div>
                  <p className="text-2xl font-bold">{overallSummary.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">セッション</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallSummary.winSessions}</p>
                  <p className="text-xs text-muted-foreground">勝ち</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallSummary.loseSessions}</p>
                  <p className="text-xs text-muted-foreground">負け</p>
                </div>
              </div>
              <p className={`text-center text-sm font-medium ${overallSummary.totalDeltaBB >= 0 ? "text-green-500" : "text-red-500"}`}>
                通算: {formatDeltaBB(overallSummary.totalDeltaBB)}
              </p>

              <div className="space-y-2 mt-2">
                {[...archives].reverse().map((archive) => (
                  <div key={archive.id} className="rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleToggle(archive.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">{formatDate(archive.startedAt)}</p>
                        <p className="text-xs text-muted-foreground">{formatDuration(archive.summary.durationMs)}</p>
                      </div>
                      <span className={`text-sm font-medium ${archive.summary.deltaBB >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatDeltaBB(archive.summary.deltaBB)}
                      </span>
                    </button>

                    {expandedId === archive.id && (
                      <div className="border-t border-border px-4 py-3 space-y-3">
                        <StackGraph
                          session={{ id: archive.id, startedAt: archive.startedAt, snapshots: archive.snapshots }}
                          readOnly
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(archive.id)}
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            aria-label="セッションを削除"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmId !== null} onOpenChange={(o) => { if (!o) setDeleteConfirmId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>セッション履歴を削除</DialogTitle>
            <DialogDescription>
              このセッション履歴を削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
