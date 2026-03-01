import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ExtendedColorPicker from "./ExtendedColorPicker"

const defaultProps = {
  color: "#ef4444",
  onColorChange: vi.fn(),
}

describe("ExtendedColorPicker", () => {
  describe("カラーグリッドの描画", () => {
    it("256個のカラーセルが表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} />)
      const cells = screen.getAllByRole("button")
      expect(cells).toHaveLength(256)
    })

    it("グリッドセルにbackgroundColorが設定される", () => {
      render(<ExtendedColorPicker {...defaultProps} />)
      const cells = screen.getAllByRole("button")
      // 各セルに何かしらのbackgroundColorが設定されている
      for (const cell of cells) {
        expect(cell.style.backgroundColor).toBeTruthy()
      }
    })
  })

  describe("色選択", () => {
    it("グリッドセルをクリックすると onColorChange が呼ばれる", () => {
      const onColorChange = vi.fn()
      render(<ExtendedColorPicker {...defaultProps} onColorChange={onColorChange} />)
      const cells = screen.getAllByRole("button")
      fireEvent.click(cells[0]!)
      expect(onColorChange).toHaveBeenCalledTimes(1)
      expect(onColorChange).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/))
    })

    it("現在選択中の色のセルにリング表示がある", () => {
      // グリッドセルをクリックして選択し、aria-pressed を確認
      const onColorChange = vi.fn()
      render(<ExtendedColorPicker {...defaultProps} onColorChange={onColorChange} />)
      const cells = screen.getAllByRole("button")
      fireEvent.click(cells[0]!)
      const selectedColor = onColorChange.mock.calls[0]![0] as string

      // 選択した色で再レンダリング
      const { container } = render(
        <ExtendedColorPicker color={selectedColor} onColorChange={onColorChange} />,
      )
      const pressed = container.querySelector('[aria-pressed="true"]')
      expect(pressed).toBeTruthy()
    })
  })

  describe("hex入力フィールド", () => {
    it("#プレフィックス付きの入力フィールドが表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} />)
      expect(screen.getByText("#")).toBeInTheDocument()
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("現在の色のhex値が表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} color="#ef4444" />)
      const input = screen.getByRole("textbox") as HTMLInputElement
      expect(input.value).toBe("ef4444")
    })

    it("有効なhex値を入力すると onColorChange が呼ばれる", () => {
      const onColorChange = vi.fn()
      render(<ExtendedColorPicker {...defaultProps} onColorChange={onColorChange} />)
      const input = screen.getByRole("textbox")
      fireEvent.change(input, { target: { value: "3b82f6" } })
      expect(onColorChange).toHaveBeenCalledWith("#3b82f6")
    })

    it("無効なhex値を入力しても onColorChange は呼ばれない", () => {
      const onColorChange = vi.fn()
      render(<ExtendedColorPicker {...defaultProps} onColorChange={onColorChange} />)
      const input = screen.getByRole("textbox")
      fireEvent.change(input, { target: { value: "zzz" } })
      expect(onColorChange).not.toHaveBeenCalled()
    })
  })

  describe("プレビュー表示", () => {
    it("選択色のプレビュー領域が表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} color="#ef4444" />)
      const preview = screen.getByTestId("color-preview")
      expect(preview).toBeInTheDocument()
      expect(preview).toHaveStyle({ backgroundColor: "#ef4444" })
    })

    it("プレビューにhexカラーコードが表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} color="#ef4444" />)
      const preview = screen.getByTestId("color-preview")
      expect(preview).toHaveTextContent("#ef4444")
    })

    it("暗い背景色のプレビューは白テキストで表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} color="#171717" />)
      const preview = screen.getByTestId("color-preview")
      expect(preview).toHaveStyle({ color: "#ffffff" })
    })

    it("明るい背景色のプレビューは黒テキストで表示される", () => {
      render(<ExtendedColorPicker {...defaultProps} color="#ffffff" />)
      const preview = screen.getByTestId("color-preview")
      expect(preview).toHaveStyle({ color: "#000000" })
    })
  })
})
