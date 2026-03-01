import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTutorial } from "./use-tutorial"
import { TUTORIAL_VERSION, TUTORIAL_STEPS } from "./tutorial"

describe("useTutorial", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("自動表示判定", () => {
    it("初回アクセス時（tutorial-version が存在しない）は active が true になる", () => {
      const { result } = renderHook(() => useTutorial())
      expect(result.current.active).toBe(true)
    })

    it("tutorial-version が TUTORIAL_VERSION より小さい場合は active が true になる", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION - 1))
      const { result } = renderHook(() => useTutorial())
      expect(result.current.active).toBe(true)
    })

    it("tutorial-version が TUTORIAL_VERSION と等しい場合は active が false になる", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION))
      const { result } = renderHook(() => useTutorial())
      expect(result.current.active).toBe(false)
    })
  })

  describe("ステップ進行", () => {
    it("初期ステップは 0 番目（ウェルカム）", () => {
      const { result } = renderHook(() => useTutorial())
      expect(result.current.currentStepIndex).toBe(0)
      expect(result.current.currentStep.id).toBe("welcome")
    })

    it("next で次のステップに進む", () => {
      const { result } = renderHook(() => useTutorial())
      act(() => result.current.next())
      expect(result.current.currentStepIndex).toBe(1)
    })

    it("prev で前のステップに戻る", () => {
      const { result } = renderHook(() => useTutorial())
      act(() => result.current.next())
      act(() => result.current.prev())
      expect(result.current.currentStepIndex).toBe(0)
    })

    it("最初のステップで prev を呼んでも 0 のまま", () => {
      const { result } = renderHook(() => useTutorial())
      act(() => result.current.prev())
      expect(result.current.currentStepIndex).toBe(0)
    })

    it("最終ステップで next を呼ぶとチュートリアルが完了する", () => {
      const { result } = renderHook(() => useTutorial())
      for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
        act(() => result.current.next())
      }
      expect(result.current.active).toBe(false)
    })

    it("isFirstStep は最初のステップでのみ true", () => {
      const { result } = renderHook(() => useTutorial())
      expect(result.current.isFirstStep).toBe(true)
      act(() => result.current.next())
      expect(result.current.isFirstStep).toBe(false)
    })

    it("isLastStep は最後のステップでのみ true", () => {
      const { result } = renderHook(() => useTutorial())
      expect(result.current.isLastStep).toBe(false)
      for (let i = 0; i < TUTORIAL_STEPS.length - 1; i++) {
        act(() => result.current.next())
      }
      expect(result.current.isLastStep).toBe(true)
    })
  })

  describe("スキップ・完了", () => {
    it("skip でチュートリアルが閉じて localStorage にバージョンが保存される", () => {
      const { result } = renderHook(() => useTutorial())
      act(() => result.current.skip())
      expect(result.current.active).toBe(false)
      expect(JSON.parse(localStorage.getItem("tutorial-version")!)).toBe(TUTORIAL_VERSION)
    })

    it("最終ステップで next するとチュートリアルが完了し localStorage にバージョンが保存される", () => {
      const { result } = renderHook(() => useTutorial())
      for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
        act(() => result.current.next())
      }
      expect(result.current.active).toBe(false)
      expect(JSON.parse(localStorage.getItem("tutorial-version")!)).toBe(TUTORIAL_VERSION)
    })
  })

  describe("ヘルプボタンからの再表示", () => {
    it("start で完了済みでもチュートリアルを再表示できる", () => {
      localStorage.setItem("tutorial-version", JSON.stringify(TUTORIAL_VERSION))
      const { result } = renderHook(() => useTutorial())
      expect(result.current.active).toBe(false)
      act(() => result.current.start())
      expect(result.current.active).toBe(true)
      expect(result.current.currentStepIndex).toBe(0)
    })
  })

  describe("totalSteps", () => {
    it("ステップ数が TUTORIAL_STEPS の長さと一致する", () => {
      const { result } = renderHook(() => useTutorial())
      expect(result.current.totalSteps).toBe(TUTORIAL_STEPS.length)
    })
  })
})
