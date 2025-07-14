import { Dispatch, SetStateAction } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const units = [
  { label: "1", value: 1 },
  { label: "K", value: 1000 },
  { label: "M", value: 1000000 },
  { label: "B", value: 1000000000 },
  { label: "T", value: 1000000000000 },
] as const
export type Unit = (typeof units)[number]["label"]
export const calculateUnitValue = (amount: number, unit: Unit): number => {
  const unitValue = units.find(u => u.label === unit)?.value || 1
  return amount * unitValue
}

interface UnitInputSelectProps {
  amount: number | null
  unit: Unit
  onChange: Dispatch<SetStateAction<{amount: number | null, unit: Unit}>>
  className?: string
  placeholder?: string
}


export default function UnitInputSelect({ amount, unit, onChange, className, placeholder }: UnitInputSelectProps) {
  const handleBaseChange = (newBase: string) => {
    onChange(prev => ({...prev, amount: newBase === "" ? null : Number(newBase)}))
  }

  const handleUnitChange = (newUnit: Unit) => {
    onChange(prev => ({...prev, unit: newUnit}))
  }

  console.log('amount', amount)

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type="number"
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
