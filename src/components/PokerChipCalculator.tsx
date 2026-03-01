import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { useBlind } from "@/lib/use-blind"
import { useCalculatedValues } from "@/lib/use-calculated-values"
import { useChips } from "@/lib/use-chips"
import { usePresets } from "@/lib/use-presets"
import { useStackSession } from "@/lib/use-stack-session"
import { useTutorial } from "@/lib/use-tutorial"
import { Label } from "./ui/label"
import AppHeader from "./AppHeader"
import ChipListSection from "./ChipListSection"
import PresetDialog from "./PresetDialog"
import StackRecordSection from "./StackRecordSection"
import TutorialOverlay from "./TutorialOverlay"
import UnitInputSelect from "./UnitInputSelect"

export default function PokerChipCalculator() {
  const blind = useBlind()
  const chipActions = useChips()
  const { total, bbValue, bbDisplay } = useCalculatedValues(chipActions.chips, blind.amount, blind.unit)
  const stackSession = useStackSession()
  const tutorial = useTutorial()
  const presets = usePresets({
    chips: chipActions.chips,
    blindAmount: blind.amount,
    blindUnit: blind.unit,
    onApplyPreset: ({ rows, blindAmount, blindUnit }) => {
      chipActions.setChips(rows)
      chipActions.setNextId(rows.length + 1)
      blind.set(blindAmount, blindUnit)
    },
  })

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto space-y-6">

        <AppHeader onStartTutorial={tutorial.start} />

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
            <div className="flex items-center gap-3" data-tutorial="blind-input">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">
                Big Blind (BB):
              </Label>
              <UnitInputSelect amount={blind.amount} unit={blind.unit} onChange={(v) => {
                blind.setAmount(v.amount)
                blind.setUnit(v.unit)
              }} className="w-44" />
            </div>
          </div>
        </section>

        <ChipListSection
          chips={chipActions.chips}
          updateChip={chipActions.updateChip}
          updateChipCount={chipActions.updateChipCount}
          addChip={chipActions.addChip}
          removeChip={chipActions.removeChip}
          onOpenPresets={() => presets.setDialogOpen(true)}
        />

        <StackRecordSection
          session={stackSession.session}
          total={total}
          bbValue={bbValue}
          blindAmount={blind.amount}
          blindUnit={blind.unit}
          record={stackSession.record}
          removeLast={stackSession.removeLast}
          reset={stackSession.reset}
          updateMemo={stackSession.updateMemo}
        />

        <section className="rounded-2xl bg-card border border-border p-5 text-center space-y-1">
          <p className="text-xl font-bold">Total Stack: {formatChipAmount(total)}</p>
          <p className="text-sm text-muted-foreground">({formatFullNumber(total)} chips)</p>
          <p className="text-base text-muted-foreground">({bbDisplay} Big Blinds)</p>
        </section>

        <TutorialOverlay
          active={tutorial.active}
          currentStep={tutorial.currentStep}
          currentStepIndex={tutorial.currentStepIndex}
          totalSteps={tutorial.totalSteps}
          isFirstStep={tutorial.isFirstStep}
          isLastStep={tutorial.isLastStep}
          onNext={tutorial.next}
          onPrev={tutorial.prev}
          onSkip={tutorial.skip}
        />

        <PresetDialog
          open={presets.dialogOpen}
          onOpenChange={presets.setDialogOpen}
          userPresets={presets.userPresets}
          onSelect={presets.selectPreset}
          onSave={presets.savePreset}
          onDelete={presets.deletePreset}
        />
      </div>
    </div>
  )
}
