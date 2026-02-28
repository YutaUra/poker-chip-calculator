import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import StackGraph from "./StackGraph"
import type { Session } from "@/lib/stack-history"
import { createSession } from "@/lib/stack-history"

// Recharts は jsdom で SVG を完全にレンダリングできないため、
// ResponsiveContainer をモックして固定サイズにする
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 400, height: 200 }}>{children}</div>
    ),
  }
})

beforeEach(() => {
  let callCount = 0
  vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
    callCount++
    return `test-uuid-${callCount}`
  })
})

function makeSession(snapshots: Array<{
  totalChips: number
  bbValue: number
  recordNumber: number
}>): Session {
  return {
    ...createSession(),
    snapshots: snapshots.map((s, i) => ({
      id: `snap-${i}`,
      recordNumber: s.recordNumber,
      timestamp: Date.now() + i * 60000,
      totalChips: s.totalChips,
      bbValue: s.bbValue,
      blindAmount: 500,
      blindUnit: "1" as const,
      memo: null,
    })),
  }
}

describe("StackGraph", () => {
  describe("記録0件の場合", () => {
    it("プレースホルダーテキストが表示される", () => {
      const session = createSession()
      render(<StackGraph session={session} />)

      expect(
        screen.getByText("記録ボタンを押してスタックを記録しましょう"),
      ).toBeInTheDocument()
    })

    it("グラフは表示されない", () => {
      const session = createSession()
      render(<StackGraph session={session} />)

      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })
  })

  describe("記録が存在する場合", () => {
    it("スタック推移のラベルが表示される", () => {
      const session = makeSession([
        { totalChips: 50000, bbValue: 100, recordNumber: 1 },
        { totalChips: 60000, bbValue: 120, recordNumber: 2 },
      ])
      render(<StackGraph session={session} />)

      expect(screen.getByText("スタック推移")).toBeInTheDocument()
    })

    it("プレースホルダーが表示されない", () => {
      const session = makeSession([
        { totalChips: 50000, bbValue: 100, recordNumber: 1 },
      ])
      render(<StackGraph session={session} />)

      expect(
        screen.queryByText("記録ボタンを押してスタックを記録しましょう"),
      ).not.toBeInTheDocument()
    })
  })
})
