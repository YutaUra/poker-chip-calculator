import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { calculateTotal, calculateBB, sortChipsByValue, ChipRow } from "@/lib/chip-logic"
import { calculateUnitValue, Unit } from "@/lib/units"
import {
  loadPreset,
  saveCurrentAsPreset,
  deleteUserPreset,
} from "@/lib/presets"
import type { ChipPreset } from "@/lib/presets"
import {
  createSnapshot,
  addSnapshot,
  removeLastSnapshot,
  updateSnapshotMemo,
  createSession,
} from "@/lib/stack-history"
import type { Session, StackSnapshot } from "@/lib/stack-history"
import { Minus, Plus, BarChart3, Undo2, RotateCcw, ListChecks, HelpCircle } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import ChipEditForm from "./ChipEditForm"
import ChipIcon from "./ChipIcon"
import PresetDialog from "./PresetDialog"
import TutorialOverlay from "./TutorialOverlay"
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
import { useTutorial } from "@/lib/use-tutorial"

export default function PokerChipCalculator() {
  const [currentBlindAmount, setCurrentBlindAmount] = useSessionStorage<number | null>("current-blind-amount",100)
  const [currentBlindUnit, setCurrentBlindUnit] = useSessionStorage<Unit>("current-blind-unit", "1")
  const [chips, setChips] = useSessionStorage<ChipRow[]>("chips", [
    { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
  ])
  const [session, setSession] = useLocalStorage<Session>("stack-session", createSession())
  const [userPresets, setUserPresets] = useLocalStorage<ChipPreset[]>("chip-presets", [])
  const [showPresetDialog, setShowPresetDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [memoInput, setMemoInput] = useState("")
  const [editingSnapshot, setEditingSnapshot] = useState<StackSnapshot | null>(null)
  const [editingMemo, setEditingMemo] = useState("")
  const [showAddChipDialog, setShowAddChipDialog] = useState(false)
  const [addChipAmount, setAddChipAmount] = useState<number | null>(100)
  const [addChipUnit, setAddChipUnit] = useState<Unit>("1")
  const [addChipColor, setAddChipColor] = useState("#ef4444")
  const tutorial = useTutorial()
  const nextIdRef = useRef(Math.max(0, ...chips.map(c => c.id)) + 1)

  const updateChip = (id: number, amount: number, unit: Unit, color: string) => {
    setChips((prevChips) => sortChipsByValue(prevChips.map((chip) => (chip.id === id ? { ...chip, amount, unit, color } : chip))))
  }

  const updateChipCount = (id: number, value: number | null) => {
    setChips((prevChips) => prevChips.map((chip) => (chip.id === id ? { ...chip, count: value } : chip)))
  }

  const openAddChipDialog = () => {
    setAddChipAmount(100)
    setAddChipUnit("1")
    setAddChipColor("#ef4444")
    setShowAddChipDialog(true)
  }

  const handleAddChipSave = () => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setChips(prev => sortChipsByValue([...prev, { id, amount: addChipAmount ?? 0, unit: addChipUnit, count: 0, color: addChipColor }]))
    setShowAddChipDialog(false)
  }

  const handleAddChipCancel = () => {
    setShowAddChipDialog(false)
  }

  const removeChip = (id: number) => {
    setChips(prev => prev.length > 1 ? prev.filter((chip) => chip.id !== id) : prev)
  }

  const handleSelectPreset = (preset: ChipPreset) => {
    const rows = loadPreset(preset)
    setChips(rows)
    setCurrentBlindAmount(preset.blindAmount)
    setCurrentBlindUnit(preset.blindUnit)
    nextIdRef.current = rows.length + 1
  }

  const handleSavePreset = (name: string) => {
    const preset = saveCurrentAsPreset(chips, currentBlindAmount, currentBlindUnit, name, userPresets)
    setUserPresets(prev => [...prev, preset])
    toast.success(`Preset "${preset.name}" を保存しました`)
  }

  const handleDeletePreset = (id: string) => {
    setUserPresets(prev => deleteUserPreset(prev, id))
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
          <Button
            variant="ghost"
            size="icon"
            onClick={tutorial.start}
            className="ml-auto h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="チュートリアルを表示"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </Button>
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
            <div className="flex items-center gap-3" data-tutorial="blind-input">
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
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
              Chips
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPresetDialog(true)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ListChecks className="h-3.5 w-3.5 mr-1" />
              Presets
            </Button>
          </div>

          {chips.map((chip, index) => {
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
                    {...(index === 0 ? { "data-tutorial": "chip-counter" } : {})}
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
            onClick={openAddChipDialog}
            className="w-full border border-dashed border-border rounded-xl h-11 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            data-tutorial="add-chip"
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
              data-tutorial="record-button"
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

        <TutorialOverlay
          active={tutorial.active}
          currentStep={tutorial.currentStep}
          currentStepIndex={tutorial.currentStepIndex}
          totalSteps={tutorial.totalSteps}
          isFirstStep={tutorial.isFirstStep}
          isLastStep={tutorial.isLastStep}
          onNext={tutorial.next}
          onPrev={tutorial.prev}
          onSkip={tutorial.skip}
        />

        <PresetDialog
          open={showPresetDialog}
          onOpenChange={setShowPresetDialog}
          userPresets={userPresets}
          onSelect={handleSelectPreset}
          onSave={handleSavePreset}
          onDelete={handleDeletePreset}
        />

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

        <Dialog open={showAddChipDialog} onOpenChange={setShowAddChipDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Chip</DialogTitle>
              <DialogDescription>Set chip amount and color</DialogDescription>
            </DialogHeader>
            <ChipEditForm
              amount={addChipAmount}
              unit={addChipUnit}
              color={addChipColor}
              onAmountChange={setAddChipAmount}
              onUnitChange={setAddChipUnit}
              onColorChange={setAddChipColor}
              onSave={handleAddChipSave}
              onCancel={handleAddChipCancel}
            />
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
