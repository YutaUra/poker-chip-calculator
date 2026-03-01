import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ChipIcon from "./ChipIcon"

const defaultProps = {
  amount: 100,
  unit: "1" as const,
  color: "#ef4444",
  onSave: vi.fn(),
}

describe("ChipIcon", () => {
  describe("チップアイコンの表示", () => {
    it("チップの金額がコンパクト表記で表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      expect(screen.getByText("100")).toBeInTheDocument()
    })

    it("K単位のチップが正しく表示される", () => {
      render(<ChipIcon {...defaultProps} amount={5} unit="K" />)
      expect(screen.getByText("5K")).toBeInTheDocument()
    })

    it("M単位のチップが正しく表示される", () => {
      render(<ChipIcon {...defaultProps} amount={1} unit="M" />)
      expect(screen.getByText("1M")).toBeInTheDocument()
    })

    it("チップアイコンにツールチップ（title属性）が設定される", () => {
      render(<ChipIcon {...defaultProps} />)
      const button = screen.getByTitle("100 chips")
      expect(button).toBeInTheDocument()
    })

    it("K単位チップのツールチップにカンマ区切り値が表示される", () => {
      render(<ChipIcon {...defaultProps} amount={5} unit="K" />)
      expect(screen.getByTitle("5,000 chips")).toBeInTheDocument()
    })

    it("チップアイコンに指定された色が適用される", () => {
      render(<ChipIcon {...defaultProps} color="#3b82f6" />)
      const button = screen.getByTitle("100 chips")
      expect(button).toHaveStyle({ backgroundColor: "#3b82f6" })
    })
  })

  describe("aria-label", () => {
    it("赤チップに「チップ: 100, 赤」のaria-labelが設定される", () => {
      render(<ChipIcon {...defaultProps} />)
      expect(screen.getByLabelText("チップ: 100, 赤")).toBeInTheDocument()
    })

    it("青チップに色名「青」が含まれるaria-labelが設定される", () => {
      render(<ChipIcon {...defaultProps} color="#3b82f6" />)
      expect(screen.getByLabelText("チップ: 100, 青")).toBeInTheDocument()
    })

    it("K単位チップのaria-labelに短縮額面が含まれる", () => {
      render(<ChipIcon {...defaultProps} amount={5} unit="K" />)
      expect(screen.getByLabelText("チップ: 5K, 赤")).toBeInTheDocument()
    })

    it("未知のカスタム色のaria-labelに「カスタム」が含まれる", () => {
      render(<ChipIcon {...defaultProps} color="#abcdef" />)
      expect(screen.getByLabelText("チップ: 100, カスタム")).toBeInTheDocument()
    })
  })

  describe("テキストコントラスト", () => {
    it("暗い背景色のチップは白文字で表示される", () => {
      render(<ChipIcon {...defaultProps} color="#ef4444" />)
      const button = screen.getByTitle("100 chips")
      expect(button).toHaveStyle({ color: "#ffffff" })
    })

    it("明るい背景色（Yellow）のチップは黒文字で表示される", () => {
      render(<ChipIcon {...defaultProps} color="#eab308" />)
      const button = screen.getByTitle("100 chips")
      expect(button).toHaveStyle({ color: "#000000" })
    })

    it("White チップは黒文字で表示される", () => {
      render(<ChipIcon {...defaultProps} color="#ffffff" />)
      const button = screen.getByTitle("100 chips")
      expect(button).toHaveStyle({ color: "#000000" })
    })
  })

  describe("fontSize ロジック", () => {
    it("2文字以下の場合は text-base が適用される", () => {
      render(<ChipIcon {...defaultProps} amount={50} unit="1" />)
      const button = screen.getByTitle("50 chips")
      expect(button.className).toContain("text-base")
    })

    it("3-4文字の場合は text-sm が適用される", () => {
      render(<ChipIcon {...defaultProps} amount={100} unit="1" />)
      const button = screen.getByTitle("100 chips")
      expect(button.className).toContain("text-sm")
    })

    it("5文字以上の場合は text-xs が適用される", () => {
      // formatChipAmount(12300) = "12.3K" (5文字)
      render(<ChipIcon {...defaultProps} amount={12300} unit="1" />)
      const button = screen.getByTitle("12,300 chips")
      expect(button.className).toContain("text-xs")
    })
  })

  describe("編集ダイアログ", () => {
    it("チップアイコンをクリックするとダイアログが開く", () => {
      render(<ChipIcon {...defaultProps} />)

      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText("Edit Chip")).toBeInTheDocument()
    })

    it("ダイアログに DialogDescription が存在する", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText(/chip.*amount.*color/i)).toBeInTheDocument()
    })

    it("ダイアログ内に Amount ラベルが表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText("Amount")).toBeInTheDocument()
    })

    it("ダイアログ内に Color ラベルが表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText("Color")).toBeInTheDocument()
    })

    it("ダイアログ内に9色のカラーボタンが表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      const colorNames = ["Red", "Blue", "Green", "Purple", "Yellow", "Pink", "Orange", "White", "Black"]
      for (const name of colorNames) {
        expect(screen.getByLabelText(name)).toBeInTheDocument()
      }
    })

    it("カラーボタンに aria-pressed が設定される", () => {
      render(<ChipIcon {...defaultProps} color="#ef4444" />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByLabelText("Red")).toHaveAttribute("aria-pressed", "true")
      expect(screen.getByLabelText("Blue")).toHaveAttribute("aria-pressed", "false")
    })

    it("Save ボタンと Cancel ボタンが表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText("Save")).toBeInTheDocument()
      expect(screen.getByText("Cancel")).toBeInTheDocument()
    })

    it("Save をクリックすると onSave が呼ばれる", () => {
      const onSave = vi.fn()
      render(<ChipIcon {...defaultProps} onSave={onSave} />)

      fireEvent.click(screen.getByTitle("100 chips"))
      fireEvent.click(screen.getByText("Save"))

      expect(onSave).toHaveBeenCalledWith({ amount: 100, unit: "1", color: "#ef4444" })
    })

    it("Cancel をクリックするとダイアログが閉じる", () => {
      render(<ChipIcon {...defaultProps} />)

      fireEvent.click(screen.getByTitle("100 chips"))
      expect(screen.getByText("Edit Chip")).toBeInTheDocument()

      fireEvent.click(screen.getByText("Cancel"))
      expect(screen.queryByText("Edit Chip")).not.toBeInTheDocument()
    })

    it("Cancel をクリックしても onSave は呼ばれない", () => {
      const onSave = vi.fn()
      render(<ChipIcon {...defaultProps} onSave={onSave} />)

      fireEvent.click(screen.getByTitle("100 chips"))
      fireEvent.click(screen.getByText("Cancel"))

      expect(onSave).not.toHaveBeenCalled()
    })

    it("色を変更して Save すると新しい色で onSave が呼ばれる", () => {
      const onSave = vi.fn()
      render(<ChipIcon {...defaultProps} onSave={onSave} />)

      fireEvent.click(screen.getByTitle("100 chips"))
      fireEvent.click(screen.getByLabelText("Blue"))
      fireEvent.click(screen.getByText("Save"))

      expect(onSave).toHaveBeenCalledWith({ amount: 100, unit: "1", color: "#3b82f6" })
    })

    it("Display プレビューが表示される", () => {
      render(<ChipIcon {...defaultProps} />)
      fireEvent.click(screen.getByTitle("100 chips"))

      expect(screen.getByText(/Display: 100/)).toBeInTheDocument()
    })
  })
})
