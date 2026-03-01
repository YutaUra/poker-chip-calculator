import { useCallback, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "theme"
const DARK_CLASS = "dark"
const MEDIA_QUERY = "(prefers-color-scheme: dark)"
const CYCLE_ORDER: readonly Theme[] = ["light", "dark", "system"] as const

function isValidTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isValidTheme(stored) ? stored : "system"
}

function applyThemeToDOM(resolved: "light" | "dark"): void {
  if (resolved === "dark") {
    document.documentElement.classList.add(DARK_CLASS)
  } else {
    document.documentElement.classList.remove(DARK_CLASS)
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia(MEDIA_QUERY).matches,
  )

  const resolved: "light" | "dark" =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme

  // DOM に dark クラスを反映
  useEffect(() => {
    applyThemeToDOM(resolved)
  }, [resolved])

  // prefers-color-scheme の変更を検知
  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY)
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches)
    }
    mql.addEventListener("change", handler)
    return () => {
      mql.removeEventListener("change", handler)
    }
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    if (newTheme === "system") {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, newTheme)
    }
  }, [])

  const cycleTheme = useCallback(() => {
    const currentIndex = CYCLE_ORDER.indexOf(theme)
    const nextIndex = (currentIndex + 1) % CYCLE_ORDER.length
    setTheme(CYCLE_ORDER[nextIndex]!)
  }, [theme, setTheme])

  return {
    theme,
    resolvedTheme: resolved,
    setTheme,
    cycleTheme,
  }
}
