import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useState } from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import ScrollableCounter from "./ScrollableCounter"

describe("ScrollableCounter", () => {
  const defaultProps = {
    value: 5,
    min: 0,
    max: 999,
    onChange: vi.fn(),
  }

  describe("数値の表示", () => {
    it("value=5の場合、中央に5が表示される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      const spinbutton = screen.getByRole("spinbutton")
      expect(spinbutton).toHaveTextContent("5")
    })

    it("value=5の場合、上に4、下に6が表示される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      expect(screen.getByText("4")).toBeInTheDocument()
      expect(screen.getByText("6")).toBeInTheDocument()
    })

    it("value=0の場合、上側に数値が表示されない", () => {
      render(<ScrollableCounter {...defaultProps} value={0} />)

      // 0の上は-1だが、min=0なので表示されない
      expect(screen.queryByText("-1")).not.toBeInTheDocument()
    })

    it("value=0の場合、下に1が表示される", () => {
      render(<ScrollableCounter {...defaultProps} value={0} />)

      expect(screen.getByText("1")).toBeInTheDocument()
    })

    it("value=999の場合、上に998が表示される", () => {
      render(<ScrollableCounter {...defaultProps} value={999} />)

      expect(screen.getByText("998")).toBeInTheDocument()
    })

    it("value=999の場合、下側に数値が表示されない", () => {
      render(<ScrollableCounter {...defaultProps} value={999} />)

      // 999の下は1000だが、max=999なので表示されない
      expect(screen.queryByText("1000")).not.toBeInTheDocument()
    })
  })

  describe("アクセシビリティ", () => {
    it("role=spinbuttonが設定される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      expect(screen.getByRole("spinbutton")).toBeInTheDocument()
    })

    it("aria-valuenowに現在の値が設定される", () => {
      render(<ScrollableCounter {...defaultProps} value={5} />)

      const spinbutton = screen.getByRole("spinbutton")
      expect(spinbutton).toHaveAttribute("aria-valuenow", "5")
    })

    it("aria-valuemin=0が設定される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      const spinbutton = screen.getByRole("spinbutton")
      expect(spinbutton).toHaveAttribute("aria-valuemin", "0")
    })

    it("aria-valuemax=999が設定される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      const spinbutton = screen.getByRole("spinbutton")
      expect(spinbutton).toHaveAttribute("aria-valuemax", "999")
    })

    it('aria-label="チップ枚数"が設定される', () => {
      render(<ScrollableCounter {...defaultProps} />)

      const spinbutton = screen.getByRole("spinbutton")
      expect(spinbutton).toHaveAttribute("aria-label", "チップ枚数")
    })
  })

  describe("スケールパルス", () => {
    it("valueが変化すると中央の数字にパルスが発生する", () => {
      const { rerender } = render(
        <ScrollableCounter {...defaultProps} value={5} />,
      )

      const centerValue = screen.getByText("5")
      expect(centerValue).not.toHaveAttribute("data-pulsing")

      // value を変更して再レンダリング
      rerender(<ScrollableCounter {...defaultProps} value={6} />)

      const newCenterValue = screen.getByText("6")
      expect(newCenterValue).toHaveAttribute("data-pulsing", "true")
    })

    it("初回レンダリング時はパルスが発生しない", () => {
      render(<ScrollableCounter {...defaultProps} value={5} />)

      const centerValue = screen.getByText("5")
      expect(centerValue).not.toHaveAttribute("data-pulsing")
    })
  })

  describe("キーボード操作", () => {
    it("上矢印キーを押すと値が1増加する", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.keyDown(spinbutton, { key: "ArrowUp" })

      expect(onChange).toHaveBeenCalledWith(6)
    })

    it("下矢印キーを押すと値が1減少する", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.keyDown(spinbutton, { key: "ArrowDown" })

      expect(onChange).toHaveBeenCalledWith(4)
    })

    it("value=0のとき下矢印キーを押しても値が減少しない", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} value={0} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.keyDown(spinbutton, { key: "ArrowDown" })

      expect(onChange).not.toHaveBeenCalled()
    })

    it("value=999のとき上矢印キーを押しても値が増加しない", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} value={999} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.keyDown(spinbutton, { key: "ArrowUp" })

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("マウスホイール操作", () => {
    it("ホイールを上に回すと値が1増加する", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.wheel(spinbutton, { deltaY: -100 })

      expect(onChange).toHaveBeenCalledWith(6)
    })

    it("ホイールを下に回すと値が1減少する", () => {
      const onChange = vi.fn()
      render(<ScrollableCounter {...defaultProps} onChange={onChange} />)

      const spinbutton = screen.getByRole("spinbutton")
      fireEvent.wheel(spinbutton, { deltaY: 100 })

      expect(onChange).toHaveBeenCalledWith(4)
    })

    it("ホイール操作時にページスクロールが抑制される", () => {
      render(<ScrollableCounter {...defaultProps} />)

      const spinbutton = screen.getByRole("spinbutton")
      const event = new WheelEvent("wheel", {
        deltaY: -100,
        bubbles: true,
        cancelable: true,
      })
      spinbutton.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe("ジョグダイアル操作", () => {
    let rafCallbacks: FrameRequestCallback[]
    let mockTime: number
    let originalRAF: typeof globalThis.requestAnimationFrame
    let originalCAF: typeof globalThis.cancelAnimationFrame
    let originalPerformance: typeof globalThis.performance

    beforeEach(() => {
      rafCallbacks = []
      mockTime = 0

      originalRAF = globalThis.requestAnimationFrame
      originalCAF = globalThis.cancelAnimationFrame
      originalPerformance = globalThis.performance

      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      })
      vi.stubGlobal("cancelAnimationFrame", () => {
        rafCallbacks = []
      })
      vi.stubGlobal("performance", { now: () => mockTime })
    })

    afterEach(() => {
      vi.stubGlobal("requestAnimationFrame", originalRAF)
      vi.stubGlobal("cancelAnimationFrame", originalCAF)
      vi.stubGlobal("performance", originalPerformance)
    })

    function flushRAF() {
      const cbs = [...rafCallbacks]
      rafCallbacks = []
      cbs.forEach((cb) => cb(mockTime))
    }

    function advanceTimeAndFlush(ms: number, flushCount: number = 1) {
      for (let i = 0; i < flushCount; i++) {
        mockTime += ms / flushCount
        flushRAF()
      }
    }

    it("上方向にポインタを移動すると値が増加する", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown で原点 Y=200 を記録
      fireEvent.pointerDown(spinbutton, { clientY: 200 })

      // Act: 上方向に80px移動（デッドゾーンを超える）
      fireEvent.pointerMove(spinbutton, { clientY: 120 })

      // rAF ループを複数回進めて値変化を起こす
      advanceTimeAndFlush(500, 5)

      // Assert: onChange が増加した値（6以上）で呼ばれる
      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
      expect(lastCall[0]).toBeGreaterThan(5)
    })

    it("下方向にポインタを移動すると値が減少する", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown で原点 Y=200 を記録
      fireEvent.pointerDown(spinbutton, { clientY: 200 })

      // Act: 下方向に80px移動（デッドゾーンを超える）
      fireEvent.pointerMove(spinbutton, { clientY: 280 })

      // rAF ループを複数回進めて値変化を起こす
      advanceTimeAndFlush(500, 5)

      // Assert: onChange が減少した値（4以下）で呼ばれる
      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
      expect(lastCall[0]).toBeLessThan(5)
    })

    it("デッドゾーン内ではvalueが変化しない", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown で原点 Y=200 を記録
      fireEvent.pointerDown(spinbutton, { clientY: 200 })

      // Act: 5px だけ移動（デッドゾーン25px以内）
      fireEvent.pointerMove(spinbutton, { clientY: 195 })

      // rAF ループを十分に進める
      advanceTimeAndFlush(1000, 10)

      // Assert: デッドゾーン内なので onChange は呼ばれない
      expect(onChange).not.toHaveBeenCalled()
    })

    it("ポインタを離すと値の変化が停止する", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown → pointermove で値変化を開始
      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 120 })
      advanceTimeAndFlush(300, 3)

      // pointerup 前の呼び出し回数を記録
      const callCountBeforeUp = onChange.mock.calls.length

      // Act: ポインタを離す
      fireEvent.pointerUp(spinbutton)

      // さらに時間を進める
      advanceTimeAndFlush(1000, 10)

      // Assert: pointerup 後は onChange がそれ以上呼ばれない
      expect(onChange.mock.calls.length).toBe(callCountBeforeUp)
    })

    it("コンポーネント外でポインタを離した場合も値の変化が停止する", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown → pointermove で値変化を開始
      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 120 })
      advanceTimeAndFlush(300, 3)

      const callCountBeforeUp = onChange.mock.calls.length
      expect(callCountBeforeUp).toBeGreaterThan(0)

      // Act: コンポーネント「外」で pointerup（window レベル）
      window.dispatchEvent(new Event("pointerup"))

      // さらに時間を進める
      advanceTimeAndFlush(1000, 10)

      // Assert: pointerup 後は onChange がそれ以上呼ばれない
      expect(onChange.mock.calls.length).toBe(callCountBeforeUp)
    })

    it("value=0で減少方向に操作しても0未満にならない", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={0} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown → 下方向に大きく移動
      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 300 })

      // Act: rAF ループを多数回進める
      advanceTimeAndFlush(2000, 20)

      // Assert: onChange が呼ばれたとしても、0未満の値では呼ばれない
      for (const call of onChange.mock.calls) {
        expect(call[0]).toBeGreaterThanOrEqual(0)
      }
    })

    it("value=999で増加方向に操作しても999を超えない", () => {
      const onChange = vi.fn()
      render(
        <ScrollableCounter {...defaultProps} value={999} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      // Arrange: pointerdown → 上方向に大きく移動
      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 100 })

      // Act: rAF ループを多数回進める
      advanceTimeAndFlush(2000, 20)

      // Assert: onChange が呼ばれたとしても、999を超える値では呼ばれない
      for (const call of onChange.mock.calls) {
        expect(call[0]).toBeLessThanOrEqual(999)
      }
    })

    it("値が変化するたびにバイブレーションが発火する", () => {
      const onChange = vi.fn()
      const vibrate = vi.fn()
      vi.stubGlobal("navigator", { ...navigator, vibrate })

      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 280 })

      advanceTimeAndFlush(500, 5)

      // onChange が呼ばれた回数と同じだけ vibrate も呼ばれる
      expect(onChange).toHaveBeenCalled()
      expect(vibrate.mock.calls.length).toBe(onChange.mock.calls.length)
    })

    it("navigator.vibrateが存在しない環境でもエラーにならない", () => {
      const onChange = vi.fn()
      vi.stubGlobal("navigator", { ...navigator, vibrate: undefined })

      render(
        <ScrollableCounter {...defaultProps} value={5} onChange={onChange} />,
      )

      const spinbutton = screen.getByRole("spinbutton")

      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 280 })

      // エラーなく実行できること
      expect(() => advanceTimeAndFlush(500, 5)).not.toThrow()
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe("高頻度更新の安定性", () => {
    let rafCallbacks: FrameRequestCallback[]
    let mockTime: number
    let originalRAF: typeof globalThis.requestAnimationFrame
    let originalCAF: typeof globalThis.cancelAnimationFrame
    let originalPerformance: typeof globalThis.performance

    beforeEach(() => {
      rafCallbacks = []
      mockTime = 0

      originalRAF = globalThis.requestAnimationFrame
      originalCAF = globalThis.cancelAnimationFrame
      originalPerformance = globalThis.performance

      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      })
      vi.stubGlobal("cancelAnimationFrame", () => {
        rafCallbacks = []
      })
      vi.stubGlobal("performance", { now: () => mockTime })
    })

    afterEach(() => {
      vi.stubGlobal("requestAnimationFrame", originalRAF)
      vi.stubGlobal("cancelAnimationFrame", originalCAF)
      vi.stubGlobal("performance", originalPerformance)
    })

    function flushRAF() {
      const cbs = [...rafCallbacks]
      rafCallbacks = []
      cbs.forEach((cb) => cb(mockTime))
    }

    it("状態管理する親コンポーネントで高速スクロールしてもエラーが発生しない", () => {
      function Parent() {
        const [value, setValue] = useState(500)
        return <ScrollableCounter value={value} onChange={setValue} />
      }

      render(<Parent />)

      const spinbutton = screen.getByRole("spinbutton")

      // 高速スクロール: 原点から遠い距離で大量の rAF tick を発火
      fireEvent.pointerDown(spinbutton, { clientY: 200 })
      fireEvent.pointerMove(spinbutton, { clientY: 50 }) // 150px離れた位置

      // 高頻度で rAF を発火（1フレームあたり16ms × 100フレーム）
      for (let i = 0; i < 100; i++) {
        mockTime += 16
        flushRAF()
      }

      // エラーなく到達できればOK
      expect(spinbutton).toHaveAttribute("aria-valuenow")
      const finalValue = Number(spinbutton.getAttribute("aria-valuenow"))
      expect(finalValue).toBeGreaterThanOrEqual(0)
      expect(finalValue).toBeLessThanOrEqual(999)
    })
  })

})
