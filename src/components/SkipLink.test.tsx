import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { App } from "@/App"

describe("スキップリンク", () => {
  it("スキップリンクが存在する", () => {
    render(<App />)
    expect(screen.getByText("メインコンテンツへスキップ")).toBeInTheDocument()
  })

  it("スキップリンクの href が #main-content を指している", () => {
    render(<App />)
    const link = screen.getByText("メインコンテンツへスキップ")
    expect(link).toHaveAttribute("href", "#main-content")
  })

  it("メインコンテンツ領域に id=main-content が付与されている", () => {
    render(<App />)
    expect(document.getElementById("main-content")).toBeInTheDocument()
  })
})
