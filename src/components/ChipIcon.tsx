import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { Unit, calculateUnitValue } from "@/lib/units"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import UnitInputSelect from "./UnitInputSelect"
import { Button } from "./ui/button"

interface ChipIconProps {
  amount: number
  unit: Unit
  color: string
  onSave: (value: {amount: number, unit: Unit, color: string}) => void
}

const chipColors = [
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

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // sRGB relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

export default function ChipIcon({ amount, unit, color, onSave }: ChipIconProps) {
  const [tempAmount, setTempAmount] = useState<number | null>(amount)
  const [tempUnit, setTempUnit] = useState(unit)
  const [tempColor, setTempColor] = useState(color)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = (open: boolean) => {
    if (open) {
      setTempAmount(amount)
      setTempUnit(unit)
      setTempColor(color)
    }
    setIsOpen(open)
  }

  const handleSave = () => {
    onSave({ amount: tempAmount ?? 0, unit: tempUnit, color: tempColor })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempAmount(amount)
    setTempUnit(unit)
    setTempColor(color)
    setIsOpen(false)
  }

  const displayAmount = formatChipAmount(calculateUnitValue(amount, unit))
  const fontSize = displayAmount.length > 4 ? "text-xs" : displayAmount.length > 2 ? "text-sm" : "text-base"
  const textColor = getTextColor(color)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button
          className={`relative w-16 h-16 rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center font-bold ${fontSize}`}
          style={{ backgroundColor: color, color: textColor }}
          title={`${formatFullNumber(calculateUnitValue(amount, unit))} chips`}
        >
          {displayAmount}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Chip</DialogTitle>
          <DialogDescription>Edit chip amount and color</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="chip-amount">Amount</Label>
            <UnitInputSelect amount={tempAmount} unit={tempUnit} onChange={(v) => {
              setTempAmount(v.amount)
              setTempUnit(v.unit)
            }} className="mt-1" placeholder="100" />
            <p className="text-sm text-gray-500 mt-1">
              Display: {formatChipAmount(calculateUnitValue(tempAmount ?? 0, tempUnit))}
              {(tempAmount ?? 0) >= 1000 && ` (${formatFullNumber(calculateUnitValue(tempAmount ?? 0, tempUnit))})`}
            </p>
          </div>
          <div>
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {chipColors.map((chipColor) => (
                <button
                  key={chipColor.value}
                  aria-label={chipColor.name}
                  aria-pressed={tempColor === chipColor.value}
                  className={`w-12 h-12 rounded-full border-2 ${
                    tempColor === chipColor.value ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: chipColor.value }}
                  onClick={() => setTempColor(chipColor.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
