import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useFocusTrap } from "./use-focus-trap"

function createContainer(): HTMLDivElement {
  const container = document.createElement("div")
  const btn1 = document.createElement("button")
  btn1.textContent = "First"
  const btn2 = document.createElement("button")
  btn2.textContent = "Second"
  const btn3 = document.createElement("button")
  btn3.textContent = "Third"
  container.append(btn1, btn2, btn3)
  document.body.appendChild(container)
  return container
}

function createEmptyContainer(): HTMLDivElement {
  const container = document.createElement("div")
  const span = document.createElement("span")
  span.textContent = "no focusable"
  container.appendChild(span)
  document.body.appendChild(container)
  return container
}

describe("useFocusTrap", () => {
  beforeEach(() => {
    document.body.textContent = ""
  })

  it("active が true のとき最初のフォーカス可能要素にフォーカスが移る", () => {
    const container = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(ref, true))

    expect(document.activeElement).toBe(container.querySelector("button"))
  })

  it("active が false のときフォーカスは移動しない", () => {
    const container = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(ref, false))

    expect(document.activeElement).toBe(document.body)
  })

  it("最後の要素で Tab を押すと最初の要素にフォーカスが戻る", () => {
    const container = createContainer()
    const ref = { current: container }
    const buttons = container.querySelectorAll("button")
    const lastButton = buttons[buttons.length - 1]!

    renderHook(() => useFocusTrap(ref, true))

    lastButton.focus()
    expect(document.activeElement).toBe(lastButton)

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    expect(document.activeElement).toBe(buttons[0])
  })

  it("最初の要素で Shift+Tab を押すと最後の要素にフォーカスが移る", () => {
    const container = createContainer()
    const ref = { current: container }
    const buttons = container.querySelectorAll("button")
    const firstButton = buttons[0]!
    const lastButton = buttons[buttons.length - 1]!

    renderHook(() => useFocusTrap(ref, true))

    firstButton.focus()
    expect(document.activeElement).toBe(firstButton)

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    expect(document.activeElement).toBe(lastButton)
  })

  it("Tab キーの preventDefault が呼ばれる（巡回時）", () => {
    const container = createContainer()
    const ref = { current: container }
    const buttons = container.querySelectorAll("button")
    const lastButton = buttons[buttons.length - 1]!

    renderHook(() => useFocusTrap(ref, true))

    lastButton.focus()

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(event, "preventDefault")
    document.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it("フォーカス可能要素がない場合はエラーにならない", () => {
    const container = createEmptyContainer()
    const ref = { current: container }

    expect(() => {
      renderHook(() => useFocusTrap(ref, true))
    }).not.toThrow()
  })

  it("active が false に変わるとキーボードリスナーが解除される", () => {
    const container = createContainer()
    const ref = { current: container }
    const buttons = container.querySelectorAll("button")
    const lastButton = buttons[buttons.length - 1]!

    const { rerender } = renderHook(
      ({ active }) => useFocusTrap(ref, active),
      { initialProps: { active: true } },
    )

    rerender({ active: false })

    lastButton.focus()
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    // リスナーが解除されているため、フォーカスは移動しない
    expect(document.activeElement).toBe(lastButton)
  })
})
