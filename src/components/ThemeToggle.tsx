import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "@/lib/theme"
import type { Theme } from "@/lib/theme"

const ICON_MAP = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const satisfies Record<Theme, React.ComponentType<{ className?: string }>>

const ARIA_LABEL_MAP = {
  light: "ダークモードに切り替え",
  dark: "システムテーマに切り替え",
  system: "ライトモードに切り替え",
} as const satisfies Record<Theme, string>

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme()
  const Icon = ICON_MAP[theme]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      aria-label={ARIA_LABEL_MAP[theme]}
    >
      <Icon className="h-4.5 w-4.5" />
    </Button>
  )
}
