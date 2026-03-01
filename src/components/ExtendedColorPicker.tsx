import { useMemo, useState } from "react"
import clsx from "clsx"
import { generateColorGrid, isValidHex } from "@/lib/color-utils"
import { getTextColor } from "./ChipEditForm"

interface ExtendedColorPickerProps {
  color: string
  onColorChange: (color: string) => void
}

export default function ExtendedColorPicker({ color, onColorChange }: ExtendedColorPickerProps) {
  const grid = useMemo(() => generateColorGrid(), [])
  const [hexInput, setHexInput] = useState(color.replace("#", ""))

  const handleHexChange = (value: string) => {
    setHexInput(value)
    if (isValidHex(value)) {
      const normalized = value.startsWith("#") ? value : `#${value}`
      onColorChange(normalized)
    }
  }

  return (
    <div className="space-y-3">
      {/* カラーグリッド
         16列を親幅いっぱいに均等配置。aspect-ratio で正方形を維持。
         max-h-48 でモバイルでも高さがはみ出さないよう縦スクロール。 */}
      <div className="max-h-48 overflow-y-auto rounded">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
        >
        {grid.flat().map((cellColor) => (
          <button
            key={cellColor}
            aria-pressed={color === cellColor}
            className={clsx(
              "aspect-square rounded-sm transition-all",
              color === cellColor
                ? "ring-2 ring-primary ring-offset-1 ring-offset-popover"
                : "hover:ring-1 hover:ring-muted-foreground",
            )}
            style={{ backgroundColor: cellColor }}
            onClick={() => {
              setHexInput(cellColor.replace("#", ""))
              onColorChange(cellColor)
            }}
          />
        ))}
        </div>
      </div>

      {/* hex入力 + プレビュー */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground font-mono">#</span>
          <input
            type="text"
            role="textbox"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            maxLength={6}
            className="w-20 text-sm font-mono border rounded px-2 py-1 bg-background text-foreground"
          />
        </div>

        <div
          data-testid="color-preview"
          className="flex-1 rounded px-3 py-1.5 text-sm font-mono text-center"
          style={{
            backgroundColor: color,
            color: getTextColor(color),
          }}
        >
          {color}
        </div>
      </div>
    </div>
  )
}
