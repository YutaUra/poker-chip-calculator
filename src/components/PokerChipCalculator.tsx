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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto space-y-6">

        <header className="flex items-center gap-2.5 pt-2">
          <span className="text-2xl text-primary">♠</span>
          <h1 className="text-xl font-semibold tracking-tight">Poker Chip Calculator</h1>
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
            <div className="flex items-center gap-3">
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
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] px-1">
            Chips
          </h2>

          {chips.map((chip) => {
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
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={chip.count ?? ""}
                    onChange={(e) => updateChipCount(chip.id, Number(e.currentTarget.value) || null)}
                    className="w-20 text-center"
                    placeholder="qty"
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
            onClick={addChip}
            className="w-full border border-dashed border-border rounded-xl h-11 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            add chip
          </Button>
        </section>

        <section className="rounded-2xl bg-card border border-border p-5 text-center space-y-1">
          <p className="text-xl font-bold">Total Stack: {formatChipAmount(total)}</p>
          <p className="text-sm text-muted-foreground">({formatFullNumber(total)} chips)</p>
          <p className="text-base text-muted-foreground">({bbDisplay} Big Blinds)</p>
        </section>
      </div>
    </div>
  )
}
