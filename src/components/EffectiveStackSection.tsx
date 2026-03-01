import { ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface EffectiveStackSectionProps {
  enabled: boolean
  opponentBB: number
  effectiveDisplay: string
  onToggle: () => void
  onOpponentBBChange: (bb: number) => void
}

export default function EffectiveStackSection({
  enabled,
  opponentBB,
  effectiveDisplay,
  onToggle,
  onOpponentBBChange,
}: EffectiveStackSectionProps) {
  return (
    <section className="rounded-2xl bg-card border border-border p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={enabled}
      >
        <span className="text-base font-semibold">Effective Stack</span>
        {enabled ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
      </button>
      {enabled && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <Label htmlFor="opponent-stack-bb" className="text-sm text-muted-foreground whitespace-nowrap">
              Opponent Stack (BB):
            </Label>
            <Input
              id="opponent-stack-bb"
              type="number"
              min={0}
              step="any"
              value={opponentBB}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value)
                if (!Number.isNaN(v)) {
                  onOpponentBBChange(v)
                }
              }}
              className="w-28"
            />
          </div>
          <p className="text-base font-medium">
            Effective Stack: {effectiveDisplay} BB
          </p>
        </div>
      )}
    </section>
  )
}
