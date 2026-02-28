import { Unit, calculateUnitValue } from "@/lib/units"
export type { Unit }
export { calculateUnitValue }
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const units = [
  { label: "1", value: 1 },
  { label: "K", value: 1000 },
  { label: "M", value: 1000000 },
  { label: "B", value: 1000000000 },
  { label: "T", value: 1000000000000 },
] as const

interface UnitInputSelectProps {
  amount: number | null
  unit: Unit
  onChange: (value: {amount: number | null, unit: Unit}) => void
  className?: string
  placeholder?: string
}


export default function UnitInputSelect({ amount, unit, onChange, className, placeholder }: UnitInputSelectProps) {
  const handleBaseChange = (newBase: string) => {
    onChange({amount: newBase === "" ? null : Number(newBase), unit})
  }

  const handleUnitChange = (newUnit: Unit) => {
    onChange({amount, unit: newUnit})
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type="number"
        inputMode="numeric"
        value={amount ?? ""}
        onChange={(e) => handleBaseChange(e.currentTarget.value)}
        placeholder={placeholder || "100"}
        className="flex-1"
        min="0"
        step="0.1"
      />
      <Select value={unit.toString()} onValueChange={handleUnitChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units.map((unitOption) => (
            <SelectItem key={unitOption.value} value={unitOption.label.toString()}>
              {unitOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
