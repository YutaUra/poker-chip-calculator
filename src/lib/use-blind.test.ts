import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useBlind } from "./use-blind"

describe("useBlind", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("デフォルト値が amount=100, unit='1' である", () => {
    const { result } = renderHook(() => useBlind())
    expect(result.current.amount).toBe(100)
    expect(result.current.unit).toBe("1")
  })

  it("setAmount でブラインド額を変更できる", () => {
    const { result } = renderHook(() => useBlind())
    act(() => result.current.setAmount(200))
    expect(result.current.amount).toBe(200)
  })

  it("setAmount に null を設定できる", () => {
    const { result } = renderHook(() => useBlind())
    act(() => result.current.setAmount(null))
    expect(result.current.amount).toBeNull()
  })

  it("setUnit でブラインド単位を変更できる", () => {
    const { result } = renderHook(() => useBlind())
    act(() => result.current.setUnit("K"))
    expect(result.current.unit).toBe("K")
  })

  it("set で額と単位を同時に変更できる", () => {
    const { result } = renderHook(() => useBlind())
    act(() => result.current.set(500, "M"))
    expect(result.current.amount).toBe(500)
    expect(result.current.unit).toBe("M")
  })

  it("sessionStorage に値が永続化される", () => {
    const { result } = renderHook(() => useBlind())
    act(() => result.current.setAmount(300))
    expect(JSON.parse(sessionStorage.getItem("current-blind-amount")!)).toBe(300)
  })

  it("sessionStorage から値を復元する", () => {
    sessionStorage.setItem("current-blind-amount", JSON.stringify(250))
    sessionStorage.setItem("current-blind-unit", JSON.stringify("K"))
    const { result } = renderHook(() => useBlind())
    expect(result.current.amount).toBe(250)
    expect(result.current.unit).toBe("K")
  })
})
