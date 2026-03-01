import { HelpCircle } from "lucide-react"
import { Button } from "./ui/button"

interface AppHeaderProps {
  onStartTutorial: () => void
}

export default function AppHeader({ onStartTutorial }: AppHeaderProps) {
  return (
    <header className="flex items-center gap-2.5 pt-2">
      <span className="text-2xl text-primary">♠</span>
      <h1 className="text-xl font-semibold tracking-tight">Poker Chip Calculator</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={onStartTutorial}
        className="ml-auto h-8 w-8 text-muted-foreground hover:text-foreground"
        aria-label="チュートリアルを表示"
      >
        <HelpCircle className="h-4.5 w-4.5" />
      </Button>
    </header>
  )
}
