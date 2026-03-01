import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { Unit, calculateUnitValue } from "@/lib/units"
import { Label } from "./ui/label"
import UnitInputSelect from "./UnitInputSelect"
import { Button } from "./ui/button"

export const chipColors = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Yellow", value: "#eab308" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Gray", value: "#6b7280" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#171717" },
]

export function getTextColor(bgColor: string): string {
  const hex = bgColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // sRGB relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

interface ChipEditFormProps {
  amount: number | null
  unit: Unit
  color: string
  onAmountChange: (amount: number | null) => void
  onUnitChange: (unit: Unit) => void
  onColorChange: (color: string) => void
  onSave: () => void
  onCancel: () => void
}

export default function ChipEditForm({
  amount,
  unit,
  color,
  onAmountChange,
  onUnitChange,
  onColorChange,
  onSave,
  onCancel,
}: ChipEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="chip-amount">Amount</Label>
        <UnitInputSelect amount={amount} unit={unit} onChange={(v) => {
          onAmountChange(v.amount)
          onUnitChange(v.unit)
        }} className="mt-1" placeholder="100" />
        <p className="text-sm text-muted-foreground mt-1">
          Display: {formatChipAmount(calculateUnitValue(amount ?? 0, unit))}
          {(amount ?? 0) >= 1000 && ` (${formatFullNumber(calculateUnitValue(amount ?? 0, unit))})`}
        </p>
      </div>
      <div>
        <Label>Color</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {chipColors.map((chipColor) => (
            <button
              key={chipColor.value}
              aria-label={chipColor.name}
              aria-pressed={color === chipColor.value}
              className={`w-12 h-12 rounded-full ring-2 transition-all ${
                color === chipColor.value ? "ring-primary ring-offset-2 ring-offset-popover" : "ring-border hover:ring-muted-foreground"
              }`}
              style={{ backgroundColor: chipColor.value }}
              onClick={() => onColorChange(chipColor.value)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}
