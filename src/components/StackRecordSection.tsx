import { useRef, useState } from "react"
import { BarChart3, Undo2, RotateCcw, History, Share2, Download, Upload } from "lucide-react"
import { toast } from "sonner"
import { formatChipAmount } from "@/lib/format-numbers"
import { importFromJSON } from "@/lib/data-export"
import type { Unit } from "@/lib/units"
import type { Session, StackSnapshot } from "@/lib/stack-history"
import StackGraph from "./StackGraph"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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
  onArchiveAndReset: () => void
  updateMemo: (snapshotId: string, memo: string | null) => void
  onOpenHistory: () => void
  onShare: () => void
  onExportCSV?: () => void
  onExportJSON?: () => void
  onImport?: (session: Session) => void
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
  onArchiveAndReset,
  updateMemo,
  onOpenHistory,
  onShare,
  onExportCSV,
  onExportJSON,
  onImport,
}: StackRecordSectionProps) {
  const [memoInput, setMemoInput] = useState("")
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [pendingImportSession, setPendingImportSession] = useState<Session | null>(null)
  const [editingSnapshot, setEditingSnapshot] = useState<StackSnapshot | null>(null)
  const [editingMemo, setEditingMemo] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRecord = () => {
    record({ total, bbValue, blindAmount, blindUnit, memo: memoInput })
    setMemoInput("")
  }

  const handleArchiveAndReset = () => {
    onArchiveAndReset()
    setShowResetDialog(false)
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content !== "string") return

      const result = importFromJSON(content)
      if ("error" in result) {
        toast.error(result.error)
      } else {
        setPendingImportSession(result)
        setShowImportDialog(true)
      }
    }
    reader.readAsText(file)

    // ファイル入力をリセットして同じファイルの再選択を可能にする
    e.target.value = ""
  }

  const handleConfirmImport = () => {
    if (pendingImportSession && onImport) {
      onImport(pendingImportSession)
    }
    setPendingImportSession(null)
    setShowImportDialog(false)
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Stack Graph
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHistory}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              aria-label="セッション履歴"
            >
              <History className="h-3.5 w-3.5 mr-1" />
              履歴
            </Button>
            {onImport && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="セッションをインポート"
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Import
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-hidden="true"
                />
              </>
            )}
            {(onExportCSV || onExportJSON) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={session.snapshots.length === 0}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    aria-label="セッションをエクスポート"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onExportCSV && (
                    <DropdownMenuItem onClick={onExportCSV}>
                      CSV でエクスポート
                    </DropdownMenuItem>
                  )}
                  {onExportJSON && (
                    <DropdownMenuItem onClick={onExportJSON}>
                      JSON でエクスポート
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {session.snapshots.length > 0 && (
              <>
                {session.snapshots.length >= 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShare}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    aria-label="セッション結果を共有"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    共有
                  </Button>
                )}
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
              現在の記録（{session.snapshots.length}件）がすべてクリアされます。セッションを履歴に保存しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleResetSession}>
              保存せずリセット
            </Button>
            <Button onClick={handleArchiveAndReset} disabled={session.snapshots.length === 0}>
              保存してリセット
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

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>セッションをインポート</DialogTitle>
            <DialogDescription>
              現在のセッションを上書きしますか？
              {pendingImportSession && ` (${pendingImportSession.snapshots.length}件の記録を含むセッション)`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowImportDialog(false); setPendingImportSession(null) }}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmImport}>
              インポートする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
