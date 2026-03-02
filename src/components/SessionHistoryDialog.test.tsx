import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SessionHistoryDialog from "./SessionHistoryDialog"
import type { ArchivedSession } from "@/lib/session-archive"
import type { OverallSummary } from "@/lib/session-archive"

// Recharts mock
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 400, height: 150 }}>{children}</div>
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

function makeArchivedSession(
  id: string,
  deltaBB: number,
  startedAt?: number,
): ArchivedSession {
  const start = startedAt ?? 1700000000000
  return {
    id,
    startedAt: start,
    endedAt: start + 3600000,
    snapshots: [
      {
        id: `${id}-snap-1`,
        recordNumber: 1,
        timestamp: start,
        totalChips: 50000,
        bbValue: 100,
        blindAmount: 500,
        blindUnit: "1",
        memo: null,
      },
      {
        id: `${id}-snap-2`,
        recordNumber: 2,
        timestamp: start + 3600000,
        totalChips: 50000 + deltaBB * 500,
        bbValue: 100 + deltaBB,
        blindAmount: 500,
        blindUnit: "1",
        memo: null,
      },
    ],
    summary: {
      snapshotCount: 2,
      durationMs: 3600000,
      startBB: 100,
      endBB: 100 + deltaBB,
      deltaBB,
      peakBB: Math.max(100, 100 + deltaBB),
      lastBlindAmount: 500,
      lastBlindUnit: "1",
    },
  }
}

const defaultOverallSummary: OverallSummary = {
  totalSessions: 0,
  totalPlayTimeMs: 0,
  totalDeltaBB: 0,
  winSessions: 0,
  loseSessions: 0,
}

describe("SessionHistoryDialog", () => {
  describe("空ステート", () => {
    it("履歴がない場合は空ステートメッセージが表示される", () => {
      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={[]}
          overallSummary={defaultOverallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      expect(screen.getByText("セッション履歴がありません")).toBeInTheDocument()
    })
  })

  describe("通算サマリー", () => {
    it("総セッション数が表示される", () => {
      const archives = [
        makeArchivedSession("s-1", 10),
        makeArchivedSession("s-2", -5),
      ]
      const overallSummary: OverallSummary = {
        totalSessions: 2,
        totalPlayTimeMs: 7200000,
        totalDeltaBB: 5,
        winSessions: 1,
        loseSessions: 1,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      expect(screen.getByText("2")).toBeInTheDocument()
    })
  })

  describe("セッションカード", () => {
    it("各セッションのdeltaBBが表示される", () => {
      const archives = [makeArchivedSession("s-1", 30)]
      const overallSummary: OverallSummary = {
        totalSessions: 1,
        totalPlayTimeMs: 3600000,
        totalDeltaBB: 30,
        winSessions: 1,
        loseSessions: 0,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      expect(screen.getByText("+30.0 BB")).toBeInTheDocument()
    })

    it("負のdeltaBBが表示される", () => {
      const archives = [makeArchivedSession("s-1", -20)]
      const overallSummary: OverallSummary = {
        totalSessions: 1,
        totalPlayTimeMs: 3600000,
        totalDeltaBB: -20,
        winSessions: 0,
        loseSessions: 1,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      expect(screen.getByText("-20.0 BB")).toBeInTheDocument()
    })
  })

  describe("セッション詳細展開", () => {
    it("セッションカードクリックで詳細が展開される", () => {
      const archives = [makeArchivedSession("s-1", 10)]
      const overallSummary: OverallSummary = {
        totalSessions: 1,
        totalPlayTimeMs: 3600000,
        totalDeltaBB: 10,
        winSessions: 1,
        loseSessions: 0,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      fireEvent.click(screen.getByText("+10.0 BB"))

      expect(screen.getByText("スタック推移")).toBeInTheDocument()
    })
  })

  describe("削除", () => {
    it("削除ボタンクリックで確認ダイアログが表示される", () => {
      const archives = [makeArchivedSession("s-1", 10)]
      const overallSummary: OverallSummary = {
        totalSessions: 1,
        totalPlayTimeMs: 3600000,
        totalDeltaBB: 10,
        winSessions: 1,
        loseSessions: 0,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      // まず詳細を展開
      fireEvent.click(screen.getByText("+10.0 BB"))

      // 削除ボタンをクリック
      fireEvent.click(screen.getByLabelText("セッションを削除"))

      expect(screen.getByText("このセッション履歴を削除しますか？")).toBeInTheDocument()
    })

    it("削除確認でonRemoveArchiveが呼ばれる", () => {
      const onRemoveArchive = vi.fn()
      const archives = [makeArchivedSession("s-1", 10)]
      const overallSummary: OverallSummary = {
        totalSessions: 1,
        totalPlayTimeMs: 3600000,
        totalDeltaBB: 10,
        winSessions: 1,
        loseSessions: 0,
      }

      render(
        <SessionHistoryDialog
          open={true}
          onOpenChange={() => {}}
          archives={archives}
          overallSummary={overallSummary}
          onRemoveArchive={onRemoveArchive}
        />,
      )

      // 展開
      fireEvent.click(screen.getByText("+10.0 BB"))

      // 削除
      fireEvent.click(screen.getByLabelText("セッションを削除"))

      // 確認
      fireEvent.click(screen.getByRole("button", { name: "削除する" }))

      expect(onRemoveArchive).toHaveBeenCalledWith("s-1")
    })
  })

  describe("ダイアログ制御", () => {
    it("openがfalseの場合はダイアログが表示されない", () => {
      render(
        <SessionHistoryDialog
          open={false}
          onOpenChange={() => {}}
          archives={[]}
          overallSummary={defaultOverallSummary}
          onRemoveArchive={() => {}}
        />,
      )

      expect(screen.queryByText("セッション履歴")).not.toBeInTheDocument()
    })
  })
})
