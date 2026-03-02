import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Session, StackSnapshot } from "./stack-history"

describe("exportToCSV", () => {
  const snapshots: StackSnapshot[] = [
    {
      id: "snap-1",
      recordNumber: 1,
      timestamp: new Date("2026-03-01T10:30:00.000Z").getTime(),
      totalChips: 20000,
      bbValue: 100,
      blindAmount: 200,
      blindUnit: "1",
      memo: null,
    },
    {
      id: "snap-2",
      recordNumber: 2,
      timestamp: new Date("2026-03-01T11:00:00.000Z").getTime(),
      totalChips: 35000,
      bbValue: 175,
      blindAmount: 200,
      blindUnit: "1",
      memo: "ダブルアップ",
    },
  ]

  it("ヘッダー行を含むCSV文字列を生成する", async () => {
    const { exportToCSV } = await import("./data-export")
    const csv = exportToCSV(snapshots)
    const lines = csv.split("\r\n")

    // BOM を除いた最初の行がヘッダー
    const header = lines[0].replace("\uFEFF", "")
    expect(header).toBe("Record,Timestamp,BB Value,Total Chips,Blind Amount,Blind Unit,Memo")
  })

  it("UTF-8 BOM付きで出力する", async () => {
    const { exportToCSV } = await import("./data-export")
    const csv = exportToCSV(snapshots)

    expect(csv.startsWith("\uFEFF")).toBe(true)
  })

  it("スナップショットデータを正しくCSV行に変換する", async () => {
    const { exportToCSV } = await import("./data-export")
    const csv = exportToCSV(snapshots)
    const lines = csv.split("\r\n")

    // データ行1（BOM除去不要、2行目以降）
    expect(lines[1]).toBe("1,2026-03-01T10:30:00.000Z,100,20000,200,1,")
    // データ行2
    expect(lines[2]).toBe("2,2026-03-01T11:00:00.000Z,175,35000,200,1,ダブルアップ")
  })

  it("カンマを含むメモをダブルクォートで囲む", async () => {
    const { exportToCSV } = await import("./data-export")
    const snapshotsWithComma: StackSnapshot[] = [
      {
        id: "snap-3",
        recordNumber: 1,
        timestamp: new Date("2026-03-01T10:30:00.000Z").getTime(),
        totalChips: 20000,
        bbValue: 100,
        blindAmount: 200,
        blindUnit: "1",
        memo: "AA,KK で勝利",
      },
    ]
    const csv = exportToCSV(snapshotsWithComma)
    const lines = csv.split("\r\n")

    expect(lines[1]).toBe('1,2026-03-01T10:30:00.000Z,100,20000,200,1,"AA,KK で勝利"')
  })

  it("空のスナップショット配列ではヘッダー行のみ出力する", async () => {
    const { exportToCSV } = await import("./data-export")
    const csv = exportToCSV([])
    const lines = csv.split("\r\n").filter((l) => l.length > 0)

    expect(lines).toHaveLength(1)
  })
})

describe("exportToJSON", () => {
  const session: Session = {
    id: "session-1",
    startedAt: new Date("2026-03-01T09:00:00.000Z").getTime(),
    snapshots: [
      {
        id: "snap-1",
        recordNumber: 1,
        timestamp: new Date("2026-03-01T10:30:00.000Z").getTime(),
        totalChips: 20000,
        bbValue: 100,
        blindAmount: 200,
        blindUnit: "1",
        memo: null,
      },
    ],
  }

  it("version フィールドが 1 である", async () => {
    const { exportToJSON } = await import("./data-export")
    const json = exportToJSON(session)
    const parsed = JSON.parse(json)

    expect(parsed.version).toBe(1)
  })

  it("exportedAt が ISO 8601 形式の文字列である", async () => {
    const { exportToJSON } = await import("./data-export")
    const json = exportToJSON(session)
    const parsed = JSON.parse(json)

    expect(parsed.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    // ISO 8601 として有効な日時
    expect(new Date(parsed.exportedAt).toISOString()).toBe(parsed.exportedAt)
  })

  it("session データが正確に含まれる", async () => {
    const { exportToJSON } = await import("./data-export")
    const json = exportToJSON(session)
    const parsed = JSON.parse(json)

    expect(parsed.session).toEqual(session)
  })

  it("整形された JSON を出力する（インデント2）", async () => {
    const { exportToJSON } = await import("./data-export")
    const json = exportToJSON(session)

    // 複数行に分かれている（インデントされている）
    expect(json.split("\n").length).toBeGreaterThan(1)
  })
})

describe("generateExportFilename", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-01T10:30:00.000Z"))
  })

  it("CSV形式のファイル名を日付付きで生成する", async () => {
    const { generateExportFilename } = await import("./data-export")
    const filename = generateExportFilename("csv")

    expect(filename).toBe("poker-session-2026-03-01.csv")
  })

  it("JSON形式のファイル名を日付付きで生成する", async () => {
    const { generateExportFilename } = await import("./data-export")
    const filename = generateExportFilename("json")

    expect(filename).toBe("poker-session-2026-03-01.json")
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})

describe("downloadFile", () => {
  it("Blob と URL.createObjectURL を使ってダウンロードを実行する", async () => {
    const { downloadFile } = await import("./data-export")

    const createObjectURL = vi.fn().mockReturnValue("blob:test-url")
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })

    const clickSpy = vi.fn()
    vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      click: clickSpy,
      style: {},
    } as unknown as HTMLAnchorElement)

    downloadFile("test content", "test.csv", "text/csv")

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(clickSpy).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-url")
  })
})

describe("validateImportData", () => {
  const validExportData = {
    version: 1,
    exportedAt: "2026-03-01T10:30:00.000Z",
    session: {
      id: "session-1",
      startedAt: 1740822000000,
      snapshots: [
        {
          id: "snap-1",
          recordNumber: 1,
          timestamp: 1740825000000,
          totalChips: 20000,
          bbValue: 100,
          blindAmount: 200,
          blindUnit: "1",
          memo: null,
        },
      ],
    },
  }

  it("正常なエクスポートデータを有効と判定する", async () => {
    const { validateImportData } = await import("./data-export")

    expect(validateImportData(validExportData)).toBe(true)
  })

  it("version が 1 でない場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")

    expect(validateImportData({ ...validExportData, version: 2 })).toBe(false)
  })

  it("session.id が欠損している場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")
    const data = {
      ...validExportData,
      session: { startedAt: 1740822000000, snapshots: [] },
    }

    expect(validateImportData(data)).toBe(false)
  })

  it("session.startedAt が欠損している場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")
    const data = {
      ...validExportData,
      session: { id: "session-1", snapshots: [] },
    }

    expect(validateImportData(data)).toBe(false)
  })

  it("session.snapshots が欠損している場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")
    const data = {
      ...validExportData,
      session: { id: "session-1", startedAt: 1740822000000 },
    }

    expect(validateImportData(data)).toBe(false)
  })

  it("snapshot の必須フィールドが欠損している場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")
    const data = {
      ...validExportData,
      session: {
        id: "session-1",
        startedAt: 1740822000000,
        snapshots: [{ id: "snap-1", recordNumber: 1 }],
      },
    }

    expect(validateImportData(data)).toBe(false)
  })

  it("不正な blindUnit の場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")
    const data = {
      ...validExportData,
      session: {
        ...validExportData.session,
        snapshots: [
          {
            ...validExportData.session.snapshots[0],
            blindUnit: "X",
          },
        ],
      },
    }

    expect(validateImportData(data)).toBe(false)
  })

  it("null を渡した場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")

    expect(validateImportData(null)).toBe(false)
  })

  it("文字列を渡した場合は無効と判定する", async () => {
    const { validateImportData } = await import("./data-export")

    expect(validateImportData("not an object")).toBe(false)
  })
})

describe("importFromJSON", () => {
  const validSession: Session = {
    id: "session-1",
    startedAt: 1740822000000,
    snapshots: [
      {
        id: "snap-1",
        recordNumber: 1,
        timestamp: 1740825000000,
        totalChips: 20000,
        bbValue: 100,
        blindAmount: 200,
        blindUnit: "1",
        memo: null,
      },
    ],
  }

  const validExportJSON = JSON.stringify({
    version: 1,
    exportedAt: "2026-03-01T10:30:00.000Z",
    session: validSession,
  })

  it("正常な JSON 文字列からセッションをインポートする", async () => {
    const { importFromJSON } = await import("./data-export")
    const result = importFromJSON(validExportJSON)

    expect("error" in result).toBe(false)
    expect(result).toEqual(validSession)
  })

  it("不正な JSON 文字列の場合はエラーを返す", async () => {
    const { importFromJSON } = await import("./data-export")
    const result = importFromJSON("{ invalid json }")

    expect("error" in result).toBe(true)
  })

  it("バリデーション失敗時はエラーを返す", async () => {
    const { importFromJSON } = await import("./data-export")
    const result = importFromJSON(JSON.stringify({ version: 99 }))

    expect("error" in result).toBe(true)
  })

  it("不正な blindUnit の場合はエラーを返す", async () => {
    const { importFromJSON } = await import("./data-export")
    const invalidData = {
      version: 1,
      exportedAt: "2026-03-01T10:30:00.000Z",
      session: {
        ...validSession,
        snapshots: [{ ...validSession.snapshots[0], blindUnit: "INVALID" }],
      },
    }
    const result = importFromJSON(JSON.stringify(invalidData))

    expect("error" in result).toBe(true)
  })
})

import { afterEach } from "vitest"
