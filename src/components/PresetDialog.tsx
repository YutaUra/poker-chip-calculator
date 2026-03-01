import { formatChipAmount } from "@/lib/format-numbers"
import type { ChipPreset } from "@/lib/presets"
import { SYSTEM_PRESETS } from "@/lib/presets"
import { calculateUnitValue } from "@/lib/units"
import { getTextColor } from "./ChipEditForm"
import { Save, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"

interface PresetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userPresets: ChipPreset[]
  onSelect: (preset: ChipPreset) => void
  onSave: (name: string) => void
  onDelete: (id: string) => void
}

function ChipPreview({ preset }: { preset: ChipPreset }) {
  const total = preset.chips.reduce(
    (sum, chip) => sum + calculateUnitValue(chip.amount, chip.unit) * chip.count,
    0,
  )
  const bbValue = calculateUnitValue(preset.blindAmount, preset.blindUnit)
  const bb = bbValue > 0 ? total / bbValue : 0

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex -space-x-1.5 shrink-0">
        {preset.chips.map((chip, i) => {
          const display = formatChipAmount(calculateUnitValue(chip.amount, chip.unit))
          return (
            <div
              key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ring-1 ring-background"
              style={{ backgroundColor: chip.color, color: getTextColor(chip.color) }}
              title={`${display} x${chip.count}`}
            >
              {display}
            </div>
          )
        })}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums truncate">
        {formatChipAmount(total)} ({bb}BB)
      </span>
    </div>
  )
}

function PresetRow({
  preset,
  onSelect,
  onDelete,
}: {
  preset: ChipPreset
  onSelect: () => void
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg hover:bg-accent transition-colors">
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-3 p-3 min-w-0 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium truncate">{preset.name}</p>
          <ChipPreview preset={preset} />
        </div>
      </button>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8 mr-1 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label={`Delete ${preset.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

export default function PresetDialog({
  open,
  onOpenChange,
  userPresets,
  onSelect,
  onSave,
  onDelete,
}: PresetDialogProps) {
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [saveName, setSaveName] = useState("")

  const handleSave = () => {
    onSave(saveName)
    setSaveName("")
    setShowSaveInput(false)
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setShowSaveInput(false)
      setSaveName("")
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Presets</DialogTitle>
          <DialogDescription>Select a chip preset or save current configuration</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em] mb-2">
              System
            </h3>
            <div className="space-y-0.5">
              {SYSTEM_PRESETS.map((preset) => (
                <PresetRow
                  key={preset.id}
                  preset={preset}
                  onSelect={() => {
                    onSelect(preset)
                    handleOpenChange(false)
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em] mb-2">
              My Presets
            </h3>
            {userPresets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 px-3">No saved presets</p>
            ) : (
              <div className="space-y-0.5">
                {userPresets.map((preset) => (
                  <PresetRow
                    key={preset.id}
                    preset={preset}
                    onSelect={() => {
                      onSelect(preset)
                      handleOpenChange(false)
                    }}
                    onDelete={() => onDelete(preset.id)}
                  />
                ))}
              </div>
            )}

            {showSaveInput ? (
              <div className="flex gap-2 mt-2">
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Preset name (optional)"
                  className="flex-1 h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave()
                    if (e.key === "Escape") {
                      setShowSaveInput(false)
                      setSaveName("")
                    }
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleSave} className="h-9">
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveInput(true)}
                className="mt-2 w-full"
              >
                <Save className="h-3.5 w-3.5 mr-2" />
                Save Current
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
