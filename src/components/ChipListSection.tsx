import { useState } from "react"
import { Minus, Plus, ListChecks } from "lucide-react"
import { calculateUnitValue } from "@/lib/units"
import type { Unit } from "@/lib/units"
import { formatChipAmount } from "@/lib/format-numbers"
import type { ChipRow } from "@/lib/chip-logic"
import ChipIcon from "./ChipIcon"
import ScrollableCounter from "./ScrollableCounter"
import ChipEditForm from "./ChipEditForm"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface ChipListSectionProps {
  chips: ChipRow[]
  updateChip: (id: number, amount: number, unit: Unit, color: string) => void
  updateChipCount: (id: number, value: number | null) => void
  addChip: (amount: number, unit: Unit, color: string) => void
  removeChip: (id: number) => void
  onOpenPresets: () => void
}

export default function ChipListSection({
  chips,
  updateChip,
  updateChipCount,
  addChip,
  removeChip,
  onOpenPresets,
}: ChipListSectionProps) {
  const [showAddChipDialog, setShowAddChipDialog] = useState(false)
  const [addChipAmount, setAddChipAmount] = useState<number | null>(100)
  const [addChipUnit, setAddChipUnit] = useState<Unit>("1")
  const [addChipColor, setAddChipColor] = useState("#ef4444")

  const openAddChipDialog = () => {
    setAddChipAmount(100)
    setAddChipUnit("1")
    setAddChipColor("#ef4444")
    setShowAddChipDialog(true)
  }

  const handleAddChipSave = () => {
    addChip(addChipAmount ?? 0, addChipUnit, addChipColor)
    setShowAddChipDialog(false)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
          Chips
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenPresets}
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
            onCancel={() => setShowAddChipDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
