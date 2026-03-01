import "@testing-library/jest-dom/vitest"

// jsdom には window.matchMedia が存在しないため、テスト環境用のスタブを定義する。
// 各テストで vi.fn().mockReturnValue() で上書き可能。
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
