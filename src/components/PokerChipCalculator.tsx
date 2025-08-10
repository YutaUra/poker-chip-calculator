import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import ChipIcon from "./ChipIcon"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import UnitInputSelect, { calculateUnitValue, Unit } from "./UnitInputSelect"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {useSessionStorage} from "usehooks-ts"

interface ChipRow {
  id: number
  amount: number
  unit: Unit
  count: number | null
  color: string
}

export default function PokerChipCalculator() {
  const [currentBlindAmount, setCurrentBlindAmount] = useSessionStorage<number | null>("current-blind-amount",100)
  const [currentBlindUnit, setCurrentBlindUnit] = useSessionStorage<Unit>("current-blind-unit", "1")
  const [chips, setChips] = useSessionStorage<ChipRow[]>("chips", [
    { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
  ])
  const [nextId, setNextId] = useState(2)

  const calculateTotal = () => {
    return chips.reduce((total, chip) => total + calculateUnitValue(chip.amount, chip.unit) * (chip.count ?? 0), 0)
  }

  const calculateBB = () => {
    if (currentBlindAmount === 0) return 0
    return calculateTotal() / calculateUnitValue((currentBlindAmount ?? 0), currentBlindUnit)
  }

  const updateChipAmount = (id: number, amount: number, unit: Unit) => {
    setChips((prevChips) => prevChips.map((chip) => (chip.id === id ? { ...chip, amount, unit } : chip)).sort((a, b) => calculateUnitValue(a.amount, a.unit)-calculateUnitValue(b.amount, b.unit)))
  }

  const updateChipCount = (id: number, value: number | null) => {
    setChips((prevChips) => prevChips.map((chip) => (chip.id === id ? { ...chip, count: value } : chip)))
  }

  const updateChipColor = (id: number, color: string) => {
    setChips((prevChips) => prevChips.map((chip) => (chip.id === id ? { ...chip, color } : chip)))
  }

  const addChip = () => {
    setChips([...chips, { id: nextId, amount: 1, unit: "1", count: 0, color: "#6b7280" }])
    setNextId(nextId + 1)
  }

  const removeChip = (id: number) => {
    if (chips.length > 1) {
      setChips(chips.filter((chip) => chip.id !== id))
    }
  }

  const total = calculateTotal()
  const bbValue = calculateBB()

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Poker Chip Calculator</h1>

        <div className="mb-8">
          <p className="text-xl mb-4">
            Current amount: {formatChipAmount(total)} ({bbValue.toFixed(2)} BB)
          </p>

          <div className="flex items-center gap-4 mb-6">
            <Label htmlFor="current-blind" className="text-lg font-medium">
              Current Blind:
            </Label>
            <UnitInputSelect amount={currentBlindAmount} unit={currentBlindUnit} onChange={(v) => {
              if (typeof v === "function") {
                const newValue = v({ amount: currentBlindAmount, unit: currentBlindUnit })
                setCurrentBlindAmount(newValue.amount )
                setCurrentBlindUnit(newValue.unit)
              } else {
                setCurrentBlindAmount(v.amount )
                setCurrentBlindUnit(v.unit)
              }
            }} className="w-48" />
            <span className="text-lg">Total: {formatChipAmount(total)}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Chips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chips.map((chip) => (
              <div key={chip.id} className="grid grid-cols-4 gap-4 items-center">
                <ChipIcon
                  amount={chip.amount}
                  unit={chip.unit}
                  color={chip.color}
                  onAmountChange={({amount, unit}) => updateChipAmount(chip.id,  amount, unit)}
                  onColorChange={(color) => updateChipColor(chip.id, color)}
                />
                <Label className="text-lg">count:</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={chip.count ?? ""}
                  onChange={(e) => updateChipCount(chip.id, Number(e.currentTarget.value) || null)}
                  className="text-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeChip(chip.id)}
                  disabled={chips.length === 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addChip} className="mt-4 text-lg bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              add chip
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold">Total Stack: {formatChipAmount(total)} chips</p>
            <p className="text-lg text-gray-500">({formatFullNumber(total)} chips)</p>
            <p className="text-xl text-gray-600">({bbValue.toFixed(2)} Big Blinds)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
