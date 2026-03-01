import clsx from "clsx"
import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { getColorName } from "@/lib/color-names"
import { Unit, calculateUnitValue } from "@/lib/units"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import ChipEditForm, { getTextColor } from "./ChipEditForm"

interface ChipIconProps {
  amount: number
  unit: Unit
  color: string
  onSave: (value: {amount: number, unit: Unit, color: string}) => void
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
  const colorName = getColorName(color)
  const ariaLabel = `チップ: ${displayAmount}, ${colorName}`

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button
          className={clsx(
            "relative w-14 h-14 rounded-full shadow-lg shadow-black/50 ring-2 ring-white/10 hover:ring-white/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            fontSize,
          )}
          aria-label={ariaLabel}
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
        <ChipEditForm
          amount={tempAmount}
          unit={tempUnit}
          color={tempColor}
          onAmountChange={setTempAmount}
          onUnitChange={setTempUnit}
          onColorChange={setTempColor}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
