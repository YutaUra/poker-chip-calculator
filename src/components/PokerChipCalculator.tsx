import { useMemo, useState } from "react"
import { formatChipAmount, formatFullNumber } from "@/lib/format-numbers"
import { exportToCSV, exportToJSON, downloadFile, generateExportFilename } from "@/lib/data-export"
import { calculateMRatio, getMZone } from "@/lib/m-ratio"
import type { MZone } from "@/lib/m-ratio"
import { useAnte } from "@/lib/use-ante"
import { useBlind } from "@/lib/use-blind"
import { useCalculatedValues } from "@/lib/use-calculated-values"
import { useChips } from "@/lib/use-chips"
import { usePresets } from "@/lib/use-presets"
import { useSessionArchive } from "@/lib/use-session-archive"
import { useStackSession } from "@/lib/use-stack-session"
import { useTutorial } from "@/lib/use-tutorial"
import { calculateUnitValue } from "@/lib/units"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import AppHeader from "./AppHeader"
import ChipListSection from "./ChipListSection"
import PresetDialog from "./PresetDialog"
import SessionHistoryDialog from "./SessionHistoryDialog"
import StackRecordSection from "./StackRecordSection"
import TutorialOverlay from "./TutorialOverlay"
import UnitInputSelect from "./UnitInputSelect"

const ZONE_COLOR_CLASS: Record<MZone, string> = {
  green: "text-green-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  red: "text-red-500",
}

export default function PokerChipCalculator() {
  const blind = useBlind()
  const ante = useAnte()
  const chipActions = useChips()
  const { total, bbValue, bbDisplay } = useCalculatedValues(chipActions.chips, blind.amount, blind.unit)
  const stackSession = useStackSession()
  const tutorial = useTutorial()
  const sessionArchive = useSessionArchive()
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  const anteEffective = ante.anteAmount !== null ? calculateUnitValue(ante.anteAmount, ante.anteUnit) : 0
  const bbEffective = blind.amount !== null ? calculateUnitValue(blind.amount, blind.unit) : 0

  const mRatio = useMemo(() => {
    if (anteEffective === 0) return null
    return calculateMRatio({
      totalStack: total,
      bbAmount: bbEffective,
      anteAmount: anteEffective,
      players: ante.players,
    })
  }, [total, bbEffective, anteEffective, ante.players])

  const mZone = mRatio !== null ? getMZone(mRatio) : null
  const mDisplay = mRatio !== null
    ? (mRatio % 1 === 0 ? mRatio.toString() : mRatio.toFixed(1))
    : null
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

  const handleArchiveAndReset = () => {
    stackSession.archiveAndReset((archived) => {
      sessionArchive.addArchive(archived)
    })
  }

  const handleExportCSV = () => {
    const csv = exportToCSV(stackSession.session.snapshots)
    const filename = generateExportFilename("csv")
    downloadFile(csv, filename, "text/csv;charset=utf-8")
  }

  const handleExportJSON = () => {
    const json = exportToJSON(stackSession.session)
    const filename = generateExportFilename("json")
    downloadFile(json, filename, "application/json")
  }

  return (
    <div id="main-content" className="min-h-screen p-4 sm:p-8">
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
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">
                Ante:
              </Label>
              <UnitInputSelect amount={ante.anteAmount} unit={ante.anteUnit} onChange={(v) => {
                ante.setAnteAmount(v.amount)
                ante.setAnteUnit(v.unit)
              }} className="w-44" placeholder="0" />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="players-input" className="text-sm text-muted-foreground whitespace-nowrap">
                Players:
              </Label>
              <Input
                id="players-input"
                type="number"
                inputMode="numeric"
                value={ante.players}
                onChange={(e) => {
                  const v = Number(e.currentTarget.value)
                  if (v >= 2 && v <= 10) ante.setPlayers(v)
                }}
                min={2}
                max={10}
                className="w-20"
              />
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
          onArchiveAndReset={handleArchiveAndReset}
          updateMemo={stackSession.updateMemo}
          onOpenHistory={() => setHistoryDialogOpen(true)}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onImport={stackSession.importSession}
        />

        <section className="rounded-2xl bg-card border border-border p-5 text-center space-y-1">
          <p className="text-xl font-bold">Total Stack: {formatChipAmount(total)}</p>
          <p className="text-sm text-muted-foreground">({formatFullNumber(total)} chips)</p>
          <p className="text-base text-muted-foreground">({bbDisplay} Big Blinds)</p>
          {mDisplay !== null && mZone !== null && (
            <p className="text-base">
              M-Ratio: <span className={ZONE_COLOR_CLASS[mZone]}>{mDisplay}</span>
            </p>
          )}
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

        <SessionHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          archives={sessionArchive.archives}
          overallSummary={sessionArchive.overallSummary}
          onRemoveArchive={sessionArchive.removeArchive}
        />

      </div>
    </div>
  )
}
