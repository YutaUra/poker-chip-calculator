import { useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { TUTORIAL_VERSION, TUTORIAL_STEPS } from "./tutorial"

export function useTutorial() {
  const [savedVersion, setSavedVersion] = useLocalStorage<number | null>("tutorial-version", null)
  const shouldAutoShow = savedVersion === null || savedVersion < TUTORIAL_VERSION
  const [active, setActive] = useState(shouldAutoShow)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const complete = () => {
    setActive(false)
    setSavedVersion(TUTORIAL_VERSION)
  }

  const next = () => {
    if (currentStepIndex >= TUTORIAL_STEPS.length - 1) {
      complete()
    } else {
      setCurrentStepIndex((i) => i + 1)
    }
  }

  const prev = () => {
    setCurrentStepIndex((i) => Math.max(0, i - 1))
  }

  const skip = () => {
    complete()
  }

  const start = () => {
    setCurrentStepIndex(0)
    setActive(true)
  }

  return {
    active,
    currentStepIndex,
    currentStep: TUTORIAL_STEPS[currentStepIndex]!,
    totalSteps: TUTORIAL_STEPS.length,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === TUTORIAL_STEPS.length - 1,
    next,
    prev,
    skip,
    start,
  }
}
