import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTheme } from "./theme"

// matchMedia のモック
function createMatchMediaMock(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []

  const addEventListener = vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
    listeners.push(cb)
  })
  const removeEventListener = vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
    const index = listeners.indexOf(cb)
    if (index >= 0) listeners.splice(index, 1)
  })

  const mql = {
    matches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: addEventListener as unknown as MediaQueryList["addEventListener"],
    removeEventListener: removeEventListener as unknown as MediaQueryList["removeEventListener"],
    dispatchEvent: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  } satisfies MediaQueryList

  function fireChange(newMatches: boolean) {
    mql.matches = newMatches
    for (const cb of [...listeners]) {
      cb({ matches: newMatches } as MediaQueryListEvent)
    }
  }

  return { mql, fireChange }
}

describe("useTheme", () => {
  let matchMediaMock: ReturnType<typeof createMatchMediaMock>

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("dark")
    matchMediaMock = createMatchMediaMock(false)
    // jsdom には matchMedia が存在しないため、直接代入してからモックする
    window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("初期値", () => {
    it("localStorage に値がない場合、theme は 'system' である", () => {
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe("system")
    })

    it("localStorage に 'dark' が保存されている場合、theme は 'dark' である", () => {
      localStorage.setItem("theme", "dark")
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe("dark")
    })

    it("localStorage に 'light' が保存されている場合、theme は 'light' である", () => {
      localStorage.setItem("theme", "light")
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe("light")
    })

    it("localStorage に不正な値がある場合、theme は 'system' にフォールバックする", () => {
      localStorage.setItem("theme", "invalid")
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe("system")
    })
  })

  describe("resolvedTheme", () => {
    it("theme が 'light' の場合、resolvedTheme は 'light' である", () => {
      localStorage.setItem("theme", "light")
      const { result } = renderHook(() => useTheme())
      expect(result.current.resolvedTheme).toBe("light")
    })

    it("theme が 'dark' の場合、resolvedTheme は 'dark' である", () => {
      localStorage.setItem("theme", "dark")
      const { result } = renderHook(() => useTheme())
      expect(result.current.resolvedTheme).toBe("dark")
    })

    it("theme が 'system' でOSがライトモードの場合、resolvedTheme は 'light' である", () => {
      matchMediaMock = createMatchMediaMock(false)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)
      const { result } = renderHook(() => useTheme())
      expect(result.current.resolvedTheme).toBe("light")
    })

    it("theme が 'system' でOSがダークモードの場合、resolvedTheme は 'dark' である", () => {
      matchMediaMock = createMatchMediaMock(true)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)
      const { result } = renderHook(() => useTheme())
      expect(result.current.resolvedTheme).toBe("dark")
    })
  })

  describe("setTheme", () => {
    it("setTheme で theme を 'dark' に変更できる", () => {
      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("dark"))
      expect(result.current.theme).toBe("dark")
    })

    it("setTheme で localStorage に値が保存される", () => {
      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("dark"))
      expect(localStorage.getItem("theme")).toBe("dark")
    })

    it("setTheme('system') の場合、localStorage から値が削除される", () => {
      localStorage.setItem("theme", "dark")
      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("system"))
      expect(localStorage.getItem("theme")).toBeNull()
    })
  })

  describe("cycleTheme", () => {
    it("light → dark に遷移する", () => {
      localStorage.setItem("theme", "light")
      const { result } = renderHook(() => useTheme())
      act(() => result.current.cycleTheme())
      expect(result.current.theme).toBe("dark")
    })

    it("dark → system に遷移する", () => {
      localStorage.setItem("theme", "dark")
      const { result } = renderHook(() => useTheme())
      act(() => result.current.cycleTheme())
      expect(result.current.theme).toBe("system")
    })

    it("system → light に遷移する", () => {
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe("system")
      act(() => result.current.cycleTheme())
      expect(result.current.theme).toBe("light")
    })
  })

  describe("HTML要素の dark クラス", () => {
    it("resolvedTheme が 'dark' のとき html に dark クラスが付与される", () => {
      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("dark"))
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("resolvedTheme が 'light' のとき html から dark クラスが除去される", () => {
      document.documentElement.classList.add("dark")
      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("light"))
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })

    it("system モードでOSがダークの場合、dark クラスが付与される", () => {
      matchMediaMock = createMatchMediaMock(true)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)
      renderHook(() => useTheme())
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("system モードでOSがライトの場合、dark クラスが除去される", () => {
      document.documentElement.classList.add("dark")
      matchMediaMock = createMatchMediaMock(false)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)
      renderHook(() => useTheme())
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  describe("prefers-color-scheme の変更検知", () => {
    it("system モードでOSテーマが変更されると resolvedTheme が更新される", () => {
      matchMediaMock = createMatchMediaMock(false)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)

      const { result } = renderHook(() => useTheme())
      expect(result.current.resolvedTheme).toBe("light")

      act(() => matchMediaMock.fireChange(true))
      expect(result.current.resolvedTheme).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("system モード以外ではOSテーマ変更の影響を受けない", () => {
      matchMediaMock = createMatchMediaMock(false)
      window.matchMedia = vi.fn().mockReturnValue(matchMediaMock.mql)

      const { result } = renderHook(() => useTheme())
      act(() => result.current.setTheme("light"))
      expect(result.current.resolvedTheme).toBe("light")

      act(() => matchMediaMock.fireChange(true))
      expect(result.current.resolvedTheme).toBe("light")
    })

    it("アンマウント時にイベントリスナーが解除される", () => {
      const { unmount } = renderHook(() => useTheme())
      unmount()
      expect(matchMediaMock.mql.removeEventListener).toHaveBeenCalled()
    })
  })
})
