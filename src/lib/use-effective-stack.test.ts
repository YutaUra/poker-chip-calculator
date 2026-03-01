import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useEffectiveStack } from "./use-effective-stack"

describe("useEffectiveStack", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("デフォルト値が enabled=false, opponentBB=100 である", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.enabled).toBe(false)
    expect(result.current.opponentBB).toBe(100)
  })

  it("toggleEnabled でトグル状態を切り替えられる", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    act(() => result.current.toggleEnabled())
    expect(result.current.enabled).toBe(true)
    act(() => result.current.toggleEnabled())
    expect(result.current.enabled).toBe(false)
  })

  it("setOpponentBB で相手スタックBBを変更できる", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    act(() => result.current.setOpponentBB(200))
    expect(result.current.opponentBB).toBe(200)
  })

  it("enabled 状態が sessionStorage に永続化される", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    act(() => result.current.toggleEnabled())
    expect(JSON.parse(sessionStorage.getItem("effective-stack-enabled")!)).toBe(true)
  })

  it("opponentBB が sessionStorage に永続化される", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    act(() => result.current.setOpponentBB(150))
    expect(JSON.parse(sessionStorage.getItem("opponent-stack-bb")!)).toBe(150)
  })

  it("sessionStorage から enabled を復元する", () => {
    sessionStorage.setItem("effective-stack-enabled", JSON.stringify(true))
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.enabled).toBe(true)
  })

  it("sessionStorage から opponentBB を復元する", () => {
    sessionStorage.setItem("opponent-stack-bb", JSON.stringify(200))
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.opponentBB).toBe(200)
  })

  it("エフェクティブスタックを正しく計算する（自分が小さい）", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.effectiveBB).toBe(50)
  })

  it("エフェクティブスタックを正しく計算する（相手が小さい）", () => {
    sessionStorage.setItem("opponent-stack-bb", JSON.stringify(30))
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.effectiveBB).toBe(30)
  })

  it("エフェクティブスタック表示を整数はそのまま表示する", () => {
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.effectiveDisplay).toBe("50")
  })

  it("エフェクティブスタック表示を小数は1桁で表示する", () => {
    sessionStorage.setItem("opponent-stack-bb", JSON.stringify(33.3))
    const { result } = renderHook(() => useEffectiveStack(50))
    expect(result.current.effectiveDisplay).toBe("33.3")
  })

  it("myBBが変更されるとエフェクティブスタックが再計算される", () => {
    const { result, rerender } = renderHook(
      ({ myBB }) => useEffectiveStack(myBB),
      { initialProps: { myBB: 100 } },
    )
    expect(result.current.effectiveBB).toBe(100)

    rerender({ myBB: 50 })
    expect(result.current.effectiveBB).toBe(50)
  })
})
