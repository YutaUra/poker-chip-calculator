import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import type { TutorialStep } from "@/lib/tutorial"

interface TutorialOverlayProps {
  active: boolean
  currentStep: TutorialStep
  currentStepIndex: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

export default function TutorialOverlay({
  active,
  currentStep,
  currentStepIndex,
  totalSteps,
  isFirstStep,
  isLastStep,
  onNext,
  onPrev,
  onSkip,
}: TutorialOverlayProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const [settled, setSettled] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)

  // useLayoutEffect でブラウザ描画前に settled=false をセットし、
  // 新しいステップの文言が一瞬フル表示されるのを防ぐ。
  useLayoutEffect(() => {
    if (!active) {
      setTargetRect(null)
      setSettled(false)
      return
    }
    if (!currentStep.selector) {
      setTargetRect(null)
      setSettled(true)
      return
    }
    const el = document.querySelector(currentStep.selector)
    if (!el) {
      setTargetRect(null)
      setSettled(true)
      return
    }

    setSettled(false)

    el.scrollIntoView?.({ behavior: "smooth", block: "center" })

    // smooth scroll 完了を待ってからハイライトを表示する。
    // rAF で位置を監視し、安定したら settled を true にしてフェードイン。
    // スクロール幅が小さい場合に即表示されないよう最低待ち時間を設ける。
    const startTime = performance.now()
    const MIN_DELAY = 180
    let prevTop = -Infinity
    let stableCount = 0
    const track = () => {
      const rect = el.getBoundingClientRect()
      const padding = 8
      const newRect = {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }

      const elapsed = performance.now() - startTime
      if (Math.abs(rect.top - prevTop) < 0.5 && elapsed >= MIN_DELAY) {
        stableCount++
        if (stableCount >= 3) {
          setTargetRect(newRect)
          setSettled(true)
          return
        }
      } else {
        stableCount = 0
      }
      prevTop = rect.top
      rafIdRef.current = requestAnimationFrame(track)
    }
    rafIdRef.current = requestAnimationFrame(track)

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [active, currentStep.selector])

  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip()
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        onNext()
      } else if (e.key === "ArrowLeft") {
        onPrev()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [active, onNext, onPrev, onSkip])

  if (!active) return null

  const popoverPosition = getPopoverPosition(targetRect)

  return (
    <div role="dialog" aria-modal="true" aria-label="チュートリアル" className="fixed inset-0 z-[100]">
      {/* settled=false: transition なしで即座に非表示（新テキストのチラ見え防止）
         settled=true:  transition ありでフェードイン */}
      {targetRect ? (
        <div
          data-testid="tutorial-overlay-bg"
          className={`absolute rounded-lg border-2 border-primary/50${settled ? " transition-opacity duration-400 ease-out" : ""}`}
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
            zIndex: 101,
            opacity: settled ? 1 : 0,
          }}
        />
      ) : (
        <div
          data-testid="tutorial-overlay-bg"
          className="absolute inset-0 bg-black/60"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div
        ref={popoverRef}
        className={`absolute z-[102] w-[min(22rem,calc(100vw-2rem))] rounded-xl bg-card border border-border p-5 shadow-xl${settled ? " transition-opacity duration-400 ease-out" : ""}`}
        style={{ ...popoverPosition, opacity: settled ? 1 : 0 }}
      >
        <button
          onClick={onSkip}
          aria-label="チュートリアルを閉じる"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-base font-semibold pr-6 mb-2">{currentStep.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{currentStep.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1} / {totalSteps}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs h-8">
              スキップ
            </Button>
            {!isFirstStep && (
              <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs h-8">
                前へ
              </Button>
            )}
            <Button size="sm" onClick={onNext} className="text-xs h-8">
              {isLastStep ? "完了" : "次へ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPopoverPosition(targetRect: TargetRect | null): React.CSSProperties {
  if (!targetRect) {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }
  }

  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800
  const spaceBelow = viewportHeight - (targetRect.top + targetRect.height)
  const popoverGap = 12

  if (spaceBelow > 200) {
    return {
      top: targetRect.top + targetRect.height + popoverGap,
      left: Math.max(16, Math.min(targetRect.left, (typeof window !== "undefined" ? window.innerWidth : 400) - 368)),
    }
  }
  return {
    bottom: viewportHeight - targetRect.top + popoverGap,
    left: Math.max(16, Math.min(targetRect.left, (typeof window !== "undefined" ? window.innerWidth : 400) - 368)),
  }
}
