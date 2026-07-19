import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { createRef } from "react"
import ShareDialog from "./ShareDialog"
import { createSession } from "@/lib/stack-history"
import type { Session } from "@/lib/stack-history"

vi.mock("@/lib/capture-graph", () => ({
  captureGraphImage: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function makeSessionWithSnapshots(count: number): Session {
  const session = createSession()
  return {
    ...session,
    snapshots: Array.from({ length: count }, (_, i) => ({
      id: `snap-${i}`,
      recordNumber: i + 1,
      timestamp: 1700000000000 + i * 60000,
      totalChips: 50000 + i * 10000,
      bbValue: 100 + i * 10,
      blindAmount: 500,
      blindUnit: "1" as const,
      memo: null,
    })),
  }
}

function makeGraphRef() {
  const ref = createRef<HTMLDivElement>()
  // @ts-expect-error -- RefObject.current は読み取り専用型だがテストでは直接設定する
  ref.current = document.createElement("div")
  return ref
}

describe("ShareDialog グラフキャプチャ", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("キャプチャ成功時は画像付きシェアボタンとプレビューを表示する", async () => {
    const { captureGraphImage } = await import("@/lib/capture-graph")
    vi.mocked(captureGraphImage).mockResolvedValue(new Blob(["img"], { type: "image/png" }))
    global.URL.createObjectURL = vi.fn(() => "blob:preview")
    global.URL.revokeObjectURL = vi.fn()

    render(
      <ShareDialog
        open
        onOpenChange={vi.fn()}
        session={makeSessionWithSnapshots(2)}
        graphRef={makeGraphRef()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText("画像付きでシェア")).toBeInTheDocument()
    })
    expect(screen.getByAltText("スタックグラフ")).toBeInTheDocument()
  })

  it("キャプチャ失敗時はテキストのみシェアになることをユーザーに通知する", async () => {
    const { captureGraphImage } = await import("@/lib/capture-graph")
    vi.mocked(captureGraphImage).mockRejectedValue(new Error("oklch unsupported"))

    render(
      <ShareDialog
        open
        onOpenChange={vi.fn()}
        session={makeSessionWithSnapshots(2)}
        graphRef={makeGraphRef()}
      />,
    )

    const { toast } = await import("sonner")
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "グラフ画像の作成に失敗したため、テキストのみでシェアします",
      )
    })
    expect(screen.getByText("シェア")).toBeInTheDocument()
    expect(screen.queryByText("画像付きでシェア")).not.toBeInTheDocument()
  })
})
