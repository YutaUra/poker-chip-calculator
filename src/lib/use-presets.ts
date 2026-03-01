import { useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { toast } from "sonner"
import type { ChipRow } from "@/lib/chip-logic"
import type { ChipPreset } from "@/lib/presets"
import {
  loadPreset,
  saveCurrentAsPreset,
  deleteUserPreset,
} from "@/lib/presets"
import type { Unit } from "@/lib/units"

export interface UsePresetsOptions {
  chips: ChipRow[]
  blindAmount: number | null
  blindUnit: Unit
  onApplyPreset: (params: {
    rows: ChipRow[]
    blindAmount: number
    blindUnit: Unit
  }) => void
}

export interface UsePresetsReturn {
  userPresets: ChipPreset[]
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  selectPreset: (preset: ChipPreset) => void
  savePreset: (name: string) => void
  deletePreset: (id: string) => void
}

export function usePresets(options: UsePresetsOptions): UsePresetsReturn {
  const { chips, blindAmount, blindUnit, onApplyPreset } = options
  const [userPresets, setUserPresets] = useLocalStorage<ChipPreset[]>("chip-presets", [])
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectPreset = (preset: ChipPreset) => {
    const rows = loadPreset(preset)
    onApplyPreset({
      rows,
      blindAmount: preset.blindAmount,
      blindUnit: preset.blindUnit,
    })
    setDialogOpen(false)
  }

  const savePreset = (name: string) => {
    const preset = saveCurrentAsPreset(chips, blindAmount, blindUnit, name, userPresets)
    setUserPresets(prev => [...prev, preset])
    toast.success(`Preset "${preset.name}" を保存しました`)
  }

  const deletePreset = (id: string) => {
    setUserPresets(prev => deleteUserPreset(prev, id))
  }

  return {
    userPresets,
    dialogOpen,
    setDialogOpen,
    selectPreset,
    savePreset,
    deletePreset,
  }
}
