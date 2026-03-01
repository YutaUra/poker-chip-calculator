import { useState } from "react"
import { BarChart3, Undo2, RotateCcw } from "lucide-react"
import { formatChipAmount } from "@/lib/format-numbers"
import type { Unit } from "@/lib/units"
import type { Session, StackSnapshot } from "@/lib/stack-history"
import StackGraph from "./StackGraph"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface StackRecordSectionProps {
  session: Session
  total: number
  bbValue: number
  blindAmount: number | null
  blindUnit: Unit
  record: (params: {
    total: number
    bbValue: number
    blindAmount: number | null
    blindUnit: Unit
    memo: string
  }) => void
  removeLast: () => void
  reset: () => void
  updateMemo: (snapshotId: string, memo: string | null) => void
}

export default function StackRecordSection({
  session,
  total,
  bbValue,
  blindAmount,
  blindUnit,
  record,
  removeLast,
  reset,
  updateMemo,
}: StackRecordSectionProps) {
  const [memoInput, setMemoInput] = useState("")
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [editingSnapshot, setEditingSnapshot] = useState<StackSnapshot | null>(null)
  const [editingMemo, setEditingMemo] = useState("")

  const handleRecord = () => {
    record({ total, bbValue, blindAmount, blindUnit, memo: memoInput })
    setMemoInput("")
  }

  const handleResetSession = () => {
    reset()
    setShowResetDialog(false)
  }

  const handleSnapshotClick = (snapshotId: string) => {
    const snap = session.snapshots.find((s) => s.id === snapshotId)
    if (!snap) return
    setEditingSnapshot(snap)
    setEditingMemo(snap.memo ?? "")
  }

  const handleSaveMemo = () => {
    if (!editingSnapshot) return
    const memo = editingMemo.trim() || null
    updateMemo(editingSnapshot.id, memo)
    setEditingSnapshot(null)
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Stack Graph
          </h2>
          <div className="flex items-center gap-1">
            {session.snapshots.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeLast}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="直前の記録を削除"
                >
                  <Undo2 className="h-3.5 w-3.5 mr-1" />
                  取消
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResetDialog(true)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="新しいセッションを開始"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  リセット
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={memoInput}
            onChange={(e) => setMemoInput(e.target.value)}
            placeholder="メモ（任意）"
            className="flex-1 h-11 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRecord()
            }}
            aria-label="記録メモ"
          />
          <Button
            onClick={handleRecord}
            className="h-11 px-5 text-sm font-medium shrink-0"
            data-tutorial="record-button"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            記録
          </Button>
        </div>

        <StackGraph session={session} onSnapshotClick={handleSnapshotClick} />
      </section>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいセッションを開始</DialogTitle>
            <DialogDescription>
              現在の記録（{session.snapshots.length}件）がすべてクリアされます。この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleResetSession}>
              リセットする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingSnapshot !== null} onOpenChange={(open) => { if (!open) setEditingSnapshot(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>#{editingSnapshot?.recordNumber} のメモを編集</DialogTitle>
            <DialogDescription>
              {editingSnapshot && `${editingSnapshot.bbValue.toFixed(1)} BB / ${formatChipAmount(editingSnapshot.totalChips)} chips`}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editingMemo}
            onChange={(e) => setEditingMemo(e.target.value)}
            placeholder="メモを入力..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveMemo()
            }}
            aria-label="メモ編集"
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingSnapshot(null)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveMemo}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
