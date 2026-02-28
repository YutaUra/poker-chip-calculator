import { Toaster } from "sonner"
import PokerChipCalculator from "./components/PokerChipCalculator"

export const App = () => {
  return (
    <>
      <PokerChipCalculator />
      <Toaster theme="dark" position="top-center" />
    </>
  )
}