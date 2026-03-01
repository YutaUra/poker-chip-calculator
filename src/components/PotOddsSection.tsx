import { ChevronDown, ChevronUp } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

interface PotOddsSectionProps {
  enabled: boolean
  potSize: number
  callAmount: number
  formattedPotOdds: string
  formattedEquity: string
  onToggle: () => void
  onPotSizeChange: (value: number) => void
  onCallAmountChange: (value: number) => void
}

export default function PotOddsSection({
  enabled,
  potSize,
  callAmount,
  formattedPotOdds,
  formattedEquity,
  onToggle,
  onPotSizeChange,
  onCallAmountChange,
}: PotOddsSectionProps) {
  return (
    <section className="rounded-2xl bg-card border border-border p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left font-semibold text-base"
        aria-expanded={enabled}
      >
        {enabled ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
        Pot Odds
      </button>

      {enabled && (
        <div className="mt-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="pot-size-input" className="text-sm text-muted-foreground whitespace-nowrap">
                Pot Size (BB):
              </Label>
              <Input
                id="pot-size-input"
                type="number"
                min={0}
                step="any"
                value={potSize || ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? 0 : Number(e.target.value)
                  onPotSizeChange(v)
                }}
                className="w-28"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="call-amount-input" className="text-sm text-muted-foreground whitespace-nowrap">
                Call Amount (BB):
              </Label>
              <Input
                id="call-amount-input"
                type="number"
                min={0}
                step="any"
                value={callAmount || ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? 0 : Number(e.target.value)
                  onCallAmountChange(v)
                }}
                className="w-28"
              />
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p>Pot Odds: {formattedPotOdds}</p>
            <p>Required Equity: {formattedEquity}</p>
          </div>
        </div>
      )}
    </section>
  )
}
