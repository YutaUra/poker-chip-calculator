import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAnte } from "./use-ante"

describe("useAnte", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("デフォルト値が anteAmount=0, anteUnit='1', players=9 である", () => {
    const { result } = renderHook(() => useAnte())
    expect(result.current.anteAmount).toBe(0)
    expect(result.current.anteUnit).toBe("1")
    expect(result.current.players).toBe(9)
  })

  it("setAnteAmount でアンティ額を変更できる", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setAnteAmount(25))
    expect(result.current.anteAmount).toBe(25)
  })

  it("setAnteAmount に null を設定できる", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setAnteAmount(null))
    expect(result.current.anteAmount).toBeNull()
  })

  it("setAnteUnit でアンティ単位を変更できる", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setAnteUnit("K"))
    expect(result.current.anteUnit).toBe("K")
  })

  it("setPlayers でプレイヤー人数を変更できる", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setPlayers(6))
    expect(result.current.players).toBe(6)
  })

  it("sessionStorage にアンティ額が永続化される", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setAnteAmount(50))
    expect(JSON.parse(sessionStorage.getItem("current-ante-amount")!)).toBe(50)
  })

  it("sessionStorage にアンティ単位が永続化される", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setAnteUnit("K"))
    expect(JSON.parse(sessionStorage.getItem("current-ante-unit")!)).toBe("K")
  })

  it("sessionStorage にプレイヤー人数が永続化される", () => {
    const { result } = renderHook(() => useAnte())
    act(() => result.current.setPlayers(6))
    expect(JSON.parse(sessionStorage.getItem("current-players")!)).toBe(6)
  })

  it("sessionStorage から値を復元する", () => {
    sessionStorage.setItem("current-ante-amount", JSON.stringify(75))
    sessionStorage.setItem("current-ante-unit", JSON.stringify("K"))
    sessionStorage.setItem("current-players", JSON.stringify(4))
    const { result } = renderHook(() => useAnte())
    expect(result.current.anteAmount).toBe(75)
    expect(result.current.anteUnit).toBe("K")
    expect(result.current.players).toBe(4)
  })
})
