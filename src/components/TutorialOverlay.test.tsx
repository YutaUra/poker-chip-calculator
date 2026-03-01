import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import TutorialOverlay from "./TutorialOverlay"
import { TUTORIAL_STEPS } from "@/lib/tutorial"

describe("TutorialOverlay", () => {
  const defaultProps = {
    active: true,
    currentStep: TUTORIAL_STEPS[0]!,
    currentStepIndex: 0,
    totalSteps: TUTORIAL_STEPS.length,
    isFirstStep: true,
    isLastStep: false,
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onSkip: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("active が false のとき何も表示しない", () => {
    const { container } = render(<TutorialOverlay {...defaultProps} active={false} />)
    expect(container.innerHTML).toBe("")
  })

  it("active が true のときオーバーレイが表示される", () => {
    render(<TutorialOverlay {...defaultProps} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("ステップのタイトルと説明が表示される", () => {
    render(<TutorialOverlay {...defaultProps} />)
    expect(screen.getByText(TUTORIAL_STEPS[0]!.title)).toBeInTheDocument()
    expect(screen.getByText(TUTORIAL_STEPS[0]!.description)).toBeInTheDocument()
  })

  it("「次へ」ボタンをクリックすると onNext が呼ばれる", () => {
    render(<TutorialOverlay {...defaultProps} />)
    fireEvent.click(screen.getByText("次へ"))
    expect(defaultProps.onNext).toHaveBeenCalledOnce()
  })

  it("最初のステップでは「前へ」ボタンが表示されない", () => {
    render(<TutorialOverlay {...defaultProps} isFirstStep={true} />)
    expect(screen.queryByText("前へ")).not.toBeInTheDocument()
  })

  it("2番目以降のステップでは「前へ」ボタンが表示される", () => {
    render(
      <TutorialOverlay
        {...defaultProps}
        currentStep={TUTORIAL_STEPS[1]!}
        currentStepIndex={1}
        isFirstStep={false}
      />,
    )
    fireEvent.click(screen.getByText("前へ"))
    expect(defaultProps.onPrev).toHaveBeenCalledOnce()
  })

  it("最終ステップでは「次へ」ではなく「完了」ボタンが表示される", () => {
    render(
      <TutorialOverlay
        {...defaultProps}
        currentStep={TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1]!}
        currentStepIndex={TUTORIAL_STEPS.length - 1}
        isLastStep={true}
        isFirstStep={false}
      />,
    )
    expect(screen.queryByText("次へ")).not.toBeInTheDocument()
    expect(screen.getByText("完了")).toBeInTheDocument()
  })

  it("「スキップ」ボタンをクリックすると onSkip が呼ばれる", () => {
    render(<TutorialOverlay {...defaultProps} />)
    fireEvent.click(screen.getByText("スキップ"))
    expect(defaultProps.onSkip).toHaveBeenCalledOnce()
  })

  it("×ボタンをクリックすると onSkip が呼ばれる", () => {
    render(<TutorialOverlay {...defaultProps} />)
    fireEvent.click(screen.getByLabelText("チュートリアルを閉じる"))
    expect(defaultProps.onSkip).toHaveBeenCalledOnce()
  })

  it("ステップインジケーターが表示される", () => {
    render(<TutorialOverlay {...defaultProps} currentStepIndex={2} />)
    expect(screen.getByText(`3 / ${TUTORIAL_STEPS.length}`)).toBeInTheDocument()
  })

  it("ウェルカムステップ（selector なし）では中央にメッセージが表示される", () => {
    render(<TutorialOverlay {...defaultProps} />)
    expect(screen.getByText(TUTORIAL_STEPS[0]!.title)).toBeInTheDocument()
  })

  describe("キーボード操作", () => {
    it("Enter キーで onNext が呼ばれる", () => {
      render(<TutorialOverlay {...defaultProps} />)
      fireEvent.keyDown(document, { key: "Enter" })
      expect(defaultProps.onNext).toHaveBeenCalledOnce()
    })

    it("右矢印キーで onNext が呼ばれる", () => {
      render(<TutorialOverlay {...defaultProps} />)
      fireEvent.keyDown(document, { key: "ArrowRight" })
      expect(defaultProps.onNext).toHaveBeenCalledOnce()
    })

    it("左矢印キーで onPrev が呼ばれる", () => {
      render(
        <TutorialOverlay
          {...defaultProps}
          currentStep={TUTORIAL_STEPS[1]!}
          currentStepIndex={1}
          isFirstStep={false}
        />,
      )
      fireEvent.keyDown(document, { key: "ArrowLeft" })
      expect(defaultProps.onPrev).toHaveBeenCalledOnce()
    })

    it("Escape キーで onSkip が呼ばれる", () => {
      render(<TutorialOverlay {...defaultProps} />)
      fireEvent.keyDown(document, { key: "Escape" })
      expect(defaultProps.onSkip).toHaveBeenCalledOnce()
    })
  })

  describe("ページスクロール抑制", () => {
    it("active が true のとき body に overflow:hidden が設定される", () => {
      render(<TutorialOverlay {...defaultProps} active={true} />)
      expect(document.body.style.overflow).toBe("hidden")
    })

    it("active が false になると overflow:hidden が解除される", () => {
      const { rerender } = render(<TutorialOverlay {...defaultProps} active={true} />)
      expect(document.body.style.overflow).toBe("hidden")

      rerender(<TutorialOverlay {...defaultProps} active={false} />)
      expect(document.body.style.overflow).toBe("")
    })

    it("アンマウント時に overflow:hidden が解除される", () => {
      const { unmount } = render(<TutorialOverlay {...defaultProps} active={true} />)
      expect(document.body.style.overflow).toBe("hidden")

      unmount()
      expect(document.body.style.overflow).toBe("")
    })
  })

  it("オーバーレイ背景をクリックしてもチュートリアルは閉じない", () => {
    render(<TutorialOverlay {...defaultProps} />)
    const overlay = screen.getByTestId("tutorial-overlay-bg")
    fireEvent.click(overlay)
    expect(defaultProps.onSkip).not.toHaveBeenCalled()
    expect(defaultProps.onNext).not.toHaveBeenCalled()
  })
})
