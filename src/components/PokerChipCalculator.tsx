import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { calculateTotal, calculateBB, sortChipsByValue, ChipRow } from "@/lib/chip-logic"
import { calculateUnitValue, Unit } from "@/lib/units"
import { Minus, Plus } from "lucide-react"
import { useRef } from "react"
import ChipIcon from "./ChipIcon"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import UnitInputSelect from "./UnitInputSelect"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {useSessionStorage} from "usehooks-ts"

export default function PokerChipCalculator() {
  const [currentBlindAmount, setCurrentBlindAmount] = useSessionStorage<number | null>("current-blind-amount",100)
  const [currentBlindUnit, setCurrentBlindUnit] = useSessionStorage<Unit>("current-blind-unit", "1")
  const [chips, setChips] = useSessionStorage<ChipRow[]>("chips", [
    { id: 1, amount: 100, unit: "1", count: 10, color: "#ef4444" },
  ])
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Poker Chip Calculator</h1>

        <div className="mb-8">
          <p className="text-xl mb-4">
            Current amount: {formatChipAmount(total)} ({bbDisplay} BB)
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Label className="text-lg font-medium">
              Big Blind (BB):
            </Label>
            <UnitInputSelect amount={currentBlindAmount} unit={currentBlindUnit} onChange={(v) => {
              setCurrentBlindAmount(v.amount)
              setCurrentBlindUnit(v.unit)
            }} className="w-48" />
            <span className="text-lg">Total: {formatChipAmount(total)}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Chips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chips.map((chip) => {
              const chipTotal = calculateUnitValue(chip.amount, chip.unit) * (chip.count ?? 0)
              return (
                <div key={chip.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <ChipIcon
                    amount={chip.amount}
                    unit={chip.unit}
                    color={chip.color}
                    onSave={({amount, unit, color}) => updateChip(chip.id, amount, unit, color)}
                  />
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={chip.count ?? ""}
                    onChange={(e) => updateChipCount(chip.id, Number(e.currentTarget.value) || null)}
                    className="text-lg"
                    placeholder="qty"
                  />
                  <span className="text-muted-foreground">= {formatChipAmount(chipTotal)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeChip(chip.id)}
                    disabled={chips.length === 1}
                    className="w-8 h-8 p-0"
                    aria-label="Remove chip"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}

            <Button variant="outline" onClick={addChip} className="mt-4 text-lg bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              add chip
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold">Total Stack: {formatChipAmount(total)}</p>
            <p className="text-lg text-muted-foreground">({formatFullNumber(total)} chips)</p>
            <p className="text-xl text-muted-foreground">({bbDisplay} Big Blinds)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
