import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { calculateTotal, calculateBB, sortChipsByValue, ChipRow } from "@/lib/chip-logic"
import { calculateUnitValue, Unit } from "@/lib/units"
import {
  createSnapshot,
  addSnapshot,
  removeLastSnapshot,
  updateSnapshotMemo,
  createSession,
} from "@/lib/stack-history"
import type { Session, StackSnapshot } from "@/lib/stack-history"
import { Minus, Plus, BarChart3, Undo2, RotateCcw } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import ChipIcon from "./ChipIcon"
import ScrollableCounter from "./ScrollableCounter"
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
import { Input } from "./ui/input"
import UnitInputSelect from "./UnitInputSelect"
import { Label } from "./ui/label"
import { useSessionStorage, useLocalStorage } from "usehooks-ts"

export default function PokerChipCalculator() {
  const [currentBlindAmount, setCurrentBlindAmount] = useSessionStorage<number | null>("current-blind-amount",100)
  const [currentBlindUnit, setCurrentBlindUnit] = useSessionStorage<Unit>("current-blind-unit", "1")
  const [chips, setChips] = useSessionStorage<ChipRow[]>("chips", [
    { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
  ])
  const [session, setSession] = useLocalStorage<Session>("stack-session", createSession())
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [memoInput, setMemoInput] = useState("")
  const [editingSnapshot, setEditingSnapshot] = useState<StackSnapshot | null>(null)
  const [editingMemo, setEditingMemo] = useState("")
  const nextIdRef = useRef(Math.max(0, ...chips.map(c => c.id)) + 1)

  const updateChip = (id: number, amount: number, unit: Unit, color: string) => {
    setChips((prevChips) => sortChipsByValue(prevChips.map((chip) => (chip.id === id ? { ...chip, amount, unit, color } : chip))))
  }

  const updateChipCount = (id: number, value: number | null) => {
    setChips((prevChips) => prevChips.map((chip) => (chip.id === id ? { ...chip, count: value } : chip)))
  }

  const addChip = () => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setChips(prev => [...prev, { id, amount: 1, unit: "1" as Unit, count: 0, color: "#6b7280" }])
  }

  const removeChip = (id: number) => {
    setChips(prev => prev.length > 1 ? prev.filter((chip) => chip.id !== id) : prev)
  }

  const total = calculateTotal(chips)
  const bbValue = calculateBB(total, currentBlindAmount, currentBlindUnit)
  const bbDisplay = bbValue % 1 === 0 ? bbValue.toString() : bbValue.toFixed(1)

  const handleRecord = () => {
    const recordNumber = session.snapshots.length + 1
    const memo = memoInput.trim() || null
    const snapshot = createSnapshot({
      totalChips: total,
      bbValue,
      blindAmount: currentBlindAmount ?? 0,
      blindUnit: currentBlindUnit,
      recordNumber,
      memo,
    })
    setSession((prev) => addSnapshot(prev, snapshot))
    setMemoInput("")
    toast.success(`記録しました (#${recordNumber})`)
  }

  const handleRemoveLast = () => {
    if (session.snapshots.length === 0) return
    setSession((prev) => removeLastSnapshot(prev))
  }

  const handleResetSession = () => {
    setSession(createSession())
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
    setSession((prev) => updateSnapshotMemo(prev, editingSnapshot.id, memo))
    setEditingSnapshot(null)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto space-y-6">

        <header className="flex items-center gap-2.5 pt-2">
          <span className="text-2xl text-primary">♠</span>
          <h1 className="text-xl font-semibold tracking-tight">Poker Chip Calculator</h1>
        </header>

        <section className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-600/60 via-emerald-500/40 to-emerald-600/60" />
          <div className="px-6 py-8 sm:py-10 text-center">
            <p className="text-7xl sm:text-8xl font-extrabold text-primary tracking-tighter leading-none tabular-nums">
              {bbDisplay}
            </p>
            <p className="text-sm text-muted-foreground mt-3 font-medium uppercase tracking-[0.2em]">
              Big Blinds
            </p>
          </div>
          <div className="border-t border-border px-6 py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Current amount: {formatChipAmount(total)} ({bbDisplay} BB)
            </p>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">
                Big Blind (BB):
              </Label>
              <UnitInputSelect amount={currentBlindAmount} unit={currentBlindUnit} onChange={(v) => {
                setCurrentBlindAmount(v.amount)
                setCurrentBlindUnit(v.unit)
              }} className="w-44" />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] px-1">
            Chips
          </h2>

          {chips.map((chip) => {
            const chipTotal = calculateUnitValue(chip.amount, chip.unit) * (chip.count ?? 0)
            return (
              <div key={chip.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                <ChipIcon
                  amount={chip.amount}
                  unit={chip.unit}
                  color={chip.color}
                  onSave={({amount, unit, color}) => updateChip(chip.id, amount, unit, color)}
                />
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ScrollableCounter
                    value={chip.count ?? 0}
                    min={0}
                    max={999}
                    onChange={(v) => updateChipCount(chip.id, v)}
                  />
                  <span className="text-sm text-muted-foreground flex-1 text-right">= {formatChipAmount(chipTotal)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChip(chip.id)}
                  disabled={chips.length === 1}
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                  aria-label="Remove chip"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          })}

          <Button
            variant="ghost"
            onClick={addChip}
            className="w-full border border-dashed border-border rounded-xl h-11 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            add chip
          </Button>
        </section>

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
                    onClick={handleRemoveLast}
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
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              記録
            </Button>
          </div>

          <StackGraph session={session} onSnapshotClick={handleSnapshotClick} />
        </section>

        <section className="rounded-2xl bg-card border border-border p-5 text-center space-y-1">
          <p className="text-xl font-bold">Total Stack: {formatChipAmount(total)}</p>
          <p className="text-sm text-muted-foreground">({formatFullNumber(total)} chips)</p>
          <p className="text-base text-muted-foreground">({bbDisplay} Big Blinds)</p>
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
      </div>
    </div>
  )
}
