import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter"
import { EMPTY_PASSWORD_STRENGTH } from "@/lib/password-validator"

describe("PasswordInput Component", () => {
  it("should render input with password type by default", () => {
    render(<PasswordInput id="password" />)
    const input = document.getElementById("password") as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.type).toBe("password")
  })

  it("should toggle password visibility with icon", async () => {
    const user = userEvent.setup()
    render(<PasswordInput id="password" value="" onChange={() => {}} />)

    const input = document.getElementById("password") as HTMLInputElement
    const toggleButton = screen.getByRole("button")

    // Initial state: password
    expect(input.type).toBe("password")

    // Click to show
    await user.click(toggleButton)
    expect(input.type).toBe("text")

    // Click to hide
    await user.click(toggleButton)
    expect(input.type).toBe("password")
  })

  it("should accept value prop", () => {
    render(<PasswordInput id="password" value="test123" onChange={() => {}} />)
    const input = document.getElementById("password") as HTMLInputElement
    expect(input.value).toBe("test123")
  })

  it("should call onChange handler", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PasswordInput id="password" value="" onChange={onChange} />)

    const input = document.getElementById("password") as HTMLInputElement
    await user.type(input, "password123")

    expect(onChange).toHaveBeenCalled()
  })
})

describe("PasswordStrengthMeter Component", () => {
  it("should render meter with correct level color", () => {
    const { rerender } = render(<PasswordStrengthMeter strength={EMPTY_PASSWORD_STRENGTH} />)

    // Weak password
    rerender(<PasswordStrengthMeter strength={{ score: 0, level: "weak", feedback: [], isValid: false }} />)
    const meter = document.querySelector(".h-full.transition-all") as HTMLElement
    expect(meter).toHaveClass("bg-destructive")

    // Strong password
    rerender(
      <PasswordStrengthMeter
        strength={{ score: 5, level: "strong", feedback: [], isValid: true }}
      />
    )
    expect(meter).toHaveClass("bg-green-500")
  })

  it("should display feedback items", () => {
    render(
      <PasswordStrengthMeter
        strength={{
          score: 1,
          level: "weak",
          feedback: ["Minimum 8 caractères", "Au moins une majuscule"],
          isValid: false,
        }}
      />
    )

    expect(screen.getByText("Minimum 8 caractères")).toBeInTheDocument()
    expect(screen.getByText("Au moins une majuscule")).toBeInTheDocument()
  })

  it("should show success message when valid", () => {
    render(
      <PasswordStrengthMeter
        strength={{
          score: 5,
          level: "strong",
          feedback: [],
          isValid: true,
        }}
      />
    )

    expect(screen.getByText("✓ Mot de passe fort")).toBeInTheDocument()
  })

  it("should display level label", () => {
    const { rerender } = render(<PasswordStrengthMeter strength={EMPTY_PASSWORD_STRENGTH} />)

    expect(screen.getByText("Faible")).toBeInTheDocument()

    rerender(
      <PasswordStrengthMeter strength={{ score: 3, level: "good", feedback: [], isValid: true }} />
    )
    expect(screen.getByText("Bon")).toBeInTheDocument()
  })
})
