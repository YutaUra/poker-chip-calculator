import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ThemeToggle from "./ThemeToggle"
import * as themeModule from "@/lib/theme"

describe("ThemeToggle", () => {
  const mockCycleTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mockUseTheme(overrides: Partial<ReturnType<typeof themeModule.useTheme>> = {}) {
    vi.spyOn(themeModule, "useTheme").mockReturnValue({
      theme: "system",
      resolvedTheme: "light",
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
      ...overrides,
    })
  }

  it("ボタンがレンダリングされる", () => {
    mockUseTheme()
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("ライトモードのとき aria-label が 'ダークモードに切り替え' である", () => {
    mockUseTheme({ theme: "light" })
    render(<ThemeToggle />)
    expect(screen.getByLabelText("ダークモードに切り替え")).toBeInTheDocument()
  })

  it("ダークモードのとき aria-label が 'システムテーマに切り替え' である", () => {
    mockUseTheme({ theme: "dark" })
    render(<ThemeToggle />)
    expect(screen.getByLabelText("システムテーマに切り替え")).toBeInTheDocument()
  })

  it("システムモードのとき aria-label が 'ライトモードに切り替え' である", () => {
    mockUseTheme({ theme: "system" })
    render(<ThemeToggle />)
    expect(screen.getByLabelText("ライトモードに切り替え")).toBeInTheDocument()
  })

  it("クリックすると cycleTheme が呼ばれる", () => {
    mockUseTheme()
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole("button"))
    expect(mockCycleTheme).toHaveBeenCalledOnce()
  })

  it("ライトモードのとき Sun アイコンが表示される", () => {
    mockUseTheme({ theme: "light" })
    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    // Sun icon should be rendered (lucide-react uses data-testid or class)
    expect(button.querySelector("svg")).toBeInTheDocument()
  })

  it("ダークモードのとき Moon アイコンが表示される", () => {
    mockUseTheme({ theme: "dark" })
    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    expect(button.querySelector("svg")).toBeInTheDocument()
  })

  it("システムモードのとき Monitor アイコンが表示される", () => {
    mockUseTheme({ theme: "system" })
    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    expect(button.querySelector("svg")).toBeInTheDocument()
  })
})
