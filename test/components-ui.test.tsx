import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { GoogleIcon } from "@/components/google-icon"

describe("GoogleIcon Component", () => {
  it("should render SVG icon", () => {
    render(<GoogleIcon />)
    const svg = document.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("should have Google colors in paths", () => {
    render(<GoogleIcon />)
    const paths = document.querySelectorAll("svg path")
    expect(paths.length).toBeGreaterThan(0)

    const colors = Array.from(paths).map((p) => p.getAttribute("fill"))
    expect(colors).toContain("#4285F4") // Google Blue
    expect(colors).toContain("#34A853") // Google Green
  })

  it("should accept className prop", () => {
    const { container } = render(<GoogleIcon className="h-4 w-4" />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("class")).toContain("h-4 w-4")
  })

  it("should have viewBox for proper scaling", () => {
    const { container } = render(<GoogleIcon />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24")
  })
})
