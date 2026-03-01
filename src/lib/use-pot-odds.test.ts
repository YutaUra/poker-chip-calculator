import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePotOdds } from "./use-pot-odds"

describe("usePotOdds", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("デフォルト値が enabled=false, potSize=0, callAmount=0 である", () => {
    const { result } = renderHook(() => usePotOdds())
    expect(result.current.enabled).toBe(false)
    expect(result.current.potSize).toBe(0)
    expect(result.current.callAmount).toBe(0)
  })

  it("toggleEnabled でトグル状態を切り替えられる", () => {
    const { result } = renderHook(() => usePotOdds())
    act(() => result.current.toggleEnabled())
    expect(result.current.enabled).toBe(true)
    act(() => result.current.toggleEnabled())
    expect(result.current.enabled).toBe(false)
  })

  it("setPotSize でポットサイズを変更できる", () => {
    const { result } = renderHook(() => usePotOdds())
    act(() => result.current.setPotSize(10))
    expect(result.current.potSize).toBe(10)
  })

  it("setCallAmount でコール額を変更できる", () => {
    const { result } = renderHook(() => usePotOdds())
    act(() => result.current.setCallAmount(5))
    expect(result.current.callAmount).toBe(5)
  })

  it("入力値に応じてポットオッズが計算される", () => {
    const { result } = renderHook(() => usePotOdds())
    act(() => {
      result.current.setPotSize(6)
      result.current.setCallAmount(2)
    })
    // 2 / (6 + 2) * 100 = 25
    expect(result.current.result.potOdds).toBe(25)
    expect(result.current.result.requiredEquity).toBe(25)
  })

  it("コール額0の場合、ポットオッズは0になる", () => {
    const { result } = renderHook(() => usePotOdds())
    act(() => {
      result.current.setPotSize(10)
    })
    expect(result.current.result.potOdds).toBe(0)
  })

  describe("sessionStorage 永続化", () => {
    it("enabled が sessionStorage に永続化される", () => {
      const { result } = renderHook(() => usePotOdds())
      act(() => result.current.toggleEnabled())
      expect(JSON.parse(sessionStorage.getItem("pot-odds-enabled")!)).toBe(true)
    })

    it("potSize が sessionStorage に永続化される", () => {
      const { result } = renderHook(() => usePotOdds())
      act(() => result.current.setPotSize(15))
      expect(JSON.parse(sessionStorage.getItem("pot-size-bb")!)).toBe(15)
    })

    it("callAmount が sessionStorage に永続化される", () => {
      const { result } = renderHook(() => usePotOdds())
      act(() => result.current.setCallAmount(3))
      expect(JSON.parse(sessionStorage.getItem("call-amount-bb")!)).toBe(3)
    })

    it("sessionStorage から値を復元する", () => {
      sessionStorage.setItem("pot-odds-enabled", JSON.stringify(true))
      sessionStorage.setItem("pot-size-bb", JSON.stringify(12))
      sessionStorage.setItem("call-amount-bb", JSON.stringify(4))
      const { result } = renderHook(() => usePotOdds())
      expect(result.current.enabled).toBe(true)
      expect(result.current.potSize).toBe(12)
      expect(result.current.callAmount).toBe(4)
    })
  })

  describe("表示フォーマット", () => {
    it("整数のポットオッズは小数なしで表示する", () => {
      const { result } = renderHook(() => usePotOdds())
      act(() => {
        result.current.setPotSize(6)
        result.current.setCallAmount(2)
      })
      // 25%
      expect(result.current.formattedPotOdds).toBe("25%")
      expect(result.current.formattedEquity).toBe("25%")
    })

    it("端数ありのポットオッズは小数1桁で表示する", () => {
      const { result } = renderHook(() => usePotOdds())
      act(() => {
        result.current.setPotSize(10)
        result.current.setCallAmount(5)
      })
      // 33.333... → "33.3%"
      expect(result.current.formattedPotOdds).toBe("33.3%")
      expect(result.current.formattedEquity).toBe("33.3%")
    })
  })
})
