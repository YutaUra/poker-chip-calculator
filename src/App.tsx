import { Toaster } from "sonner"
import PokerChipCalculator from "./components/PokerChipCalculator"

export const App = () => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        メインコンテンツへスキップ
      </a>
      <PokerChipCalculator />
      <Toaster theme="dark" position="top-center" />
    </>
  )
}