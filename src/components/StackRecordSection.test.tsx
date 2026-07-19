import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import StackRecordSection from "./StackRecordSection"
import type { Session } from "@/lib/stack-history"
import { createSession } from "@/lib/stack-history"

// Recharts mock
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

function makeSessionWithSnapshots(count: number): Session {
  const session = createSession()
  return {
    ...session,
    snapshots: Array.from({ length: count }, (_, i) => ({
      id: `snap-${i}`,
      recordNumber: i + 1,
      timestamp: Date.now() + i * 60000,
      totalChips: 50000 + i * 10000,
      bbValue: 100 + i * 10,
      blindAmount: 500,
      blindUnit: "1" as const,
      memo: null,
    })),
  }
}

describe("StackRecordSection ヘッダーアクション", () => {
  const defaultProps = {
    total: 50000,
    bbValue: 100,
    blindAmount: 500 as number | null,
    blindUnit: "1" as const,
    record: vi.fn(),
    removeLast: vi.fn(),
    reset: vi.fn(),
    onArchiveAndReset: vi.fn(),
    updateMemo: vi.fn(),
    onOpenHistory: vi.fn(),
    onShare: vi.fn(),
    onExportCSV: vi.fn(),
    onExportJSON: vi.fn(),
    onImport: vi.fn(),
  }

  it("全アクションが揃ってもボタンはアイコンのみでテキストラベルを表示しない", () => {
    // SP 幅（約375px）でテキスト付きボタン6個が1行に収まらず
    // はみ出していたため、ヘッダーのアクションはアイコンのみとする
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    for (const label of ["履歴", "Import", "Export", "共有", "取消", "リセット"]) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })

  it("アイコン化してもアクセシブルネームで各アクションにアクセスできる", () => {
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    expect(screen.getByLabelText("セッション履歴")).toBeInTheDocument()
    expect(screen.getByLabelText("セッションをインポート")).toBeInTheDocument()
    expect(screen.getByLabelText("セッションをエクスポート")).toBeInTheDocument()
    expect(screen.getByLabelText("セッション結果を共有")).toBeInTheDocument()
    expect(screen.getByLabelText("直前の記録を削除")).toBeInTheDocument()
    expect(screen.getByLabelText("新しいセッションを開始")).toBeInTheDocument()
  })
})

describe("StackRecordSection リセットダイアログ", () => {
  const defaultProps = {
    total: 50000,
    bbValue: 100,
    blindAmount: 500 as number | null,
    blindUnit: "1" as const,
    record: vi.fn(),
    removeLast: vi.fn(),
    reset: vi.fn(),
    onArchiveAndReset: vi.fn(),
    updateMemo: vi.fn(),
    onOpenHistory: vi.fn(),
  }

  it("スナップショットがある場合にリセットボタンが表示される", () => {
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    expect(screen.getByLabelText("新しいセッションを開始")).toBeInTheDocument()
  })

  it("リセットボタンクリックでダイアログが開く", () => {
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    fireEvent.click(screen.getByLabelText("新しいセッションを開始"))

    expect(screen.getByText("新しいセッションを開始")).toBeInTheDocument()
  })

  it("ダイアログに「保存してリセット」ボタンがある", () => {
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    fireEvent.click(screen.getByLabelText("新しいセッションを開始"))

    expect(screen.getByRole("button", { name: "保存してリセット" })).toBeInTheDocument()
  })

  it("ダイアログに「保存せずリセット」ボタンがある", () => {
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} />)

    fireEvent.click(screen.getByLabelText("新しいセッションを開始"))

    expect(screen.getByRole("button", { name: "保存せずリセット" })).toBeInTheDocument()
  })

  it("「保存してリセット」クリックでonArchiveAndResetが呼ばれる", () => {
    const onArchiveAndReset = vi.fn()
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} onArchiveAndReset={onArchiveAndReset} />)

    fireEvent.click(screen.getByLabelText("新しいセッションを開始"))
    fireEvent.click(screen.getByRole("button", { name: "保存してリセット" }))

    expect(onArchiveAndReset).toHaveBeenCalledTimes(1)
  })

  it("「保存せずリセット」クリックでresetが呼ばれる", () => {
    const reset = vi.fn()
    const session = makeSessionWithSnapshots(2)
    render(<StackRecordSection {...defaultProps} session={session} reset={reset} />)

    fireEvent.click(screen.getByLabelText("新しいセッションを開始"))
    fireEvent.click(screen.getByRole("button", { name: "保存せずリセット" }))

    expect(reset).toHaveBeenCalledTimes(1)
  })

  it("スナップショットが0件の場合リセットボタンは表示されない", () => {
    const session = makeSessionWithSnapshots(0)
    render(<StackRecordSection {...defaultProps} session={session} />)

    expect(screen.queryByLabelText("新しいセッションを開始")).not.toBeInTheDocument()
  })
})

describe("StackRecordSection 履歴ボタン", () => {
  const defaultProps = {
    total: 50000,
    bbValue: 100,
    blindAmount: 500 as number | null,
    blindUnit: "1" as const,
    record: vi.fn(),
    removeLast: vi.fn(),
    reset: vi.fn(),
    onArchiveAndReset: vi.fn(),
    updateMemo: vi.fn(),
    onOpenHistory: vi.fn(),
  }

  it("履歴ボタンが表示される", () => {
    const session = makeSessionWithSnapshots(0)
    render(<StackRecordSection {...defaultProps} session={session} />)

    expect(screen.getByLabelText("セッション履歴")).toBeInTheDocument()
  })

  it("履歴ボタンクリックでonOpenHistoryが呼ばれる", () => {
    const onOpenHistory = vi.fn()
    const session = makeSessionWithSnapshots(0)
    render(<StackRecordSection {...defaultProps} session={session} onOpenHistory={onOpenHistory} />)

    fireEvent.click(screen.getByLabelText("セッション履歴"))

    expect(onOpenHistory).toHaveBeenCalledTimes(1)
  })
})
