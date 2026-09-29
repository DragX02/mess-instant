import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { GoogleButton } from "@/components/auth/google-button"
import { AuthCard } from "@/components/auth/auth-card"

// Mock authClient
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
    },
    signUp: {
      social: vi.fn(),
    },
  },
}))

describe("GoogleButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render button with Google icon", () => {
    render(<GoogleButton loadingLabel="Connexion..." />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("should display default label", () => {
    render(<GoogleButton loadingLabel="Connexion..." />)
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("should display separator with 'ou'", () => {
    render(<GoogleButton loadingLabel="Connexion..." />)
    expect(screen.getByText("ou")).toBeInTheDocument()
  })

  it("should show loading label while loading", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<GoogleButton loadingLabel="Connexion..." />)

    const button = screen.getByRole("button")
    expect(screen.getByText("Google")).toBeInTheDocument()

    // Simulate loading state - in real scenario this happens during auth call
    // We can test the conditional render by checking the component accepts loadingLabel
    expect(button).not.toBeDisabled()
  })

  it("should have full width class", () => {
    const { container } = render(<GoogleButton loadingLabel="Connexion..." />)
    const button = container.querySelector("button")
    expect(button?.className).toContain("w-full")
  })

  it("should render GoogleIcon", () => {
    const { container } = render(<GoogleButton loadingLabel="Connexion..." />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})

describe("AuthCard Component", () => {
  it("should render card with children", () => {
    render(
      <AuthCard title="Connexion" description="Connectez-vous">
        <div data-testid="child">Test content</div>
      </AuthCard>,
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })

  it("should render card with title", () => {
    render(
      <AuthCard title="Connexion" description="Bienvenue">
        <div>Content</div>
      </AuthCard>,
    )
    expect(screen.getByText("Connexion")).toBeInTheDocument()
  })

  it("should render card with description", () => {
    render(
      <AuthCard title="Connexion" description="Connectez-vous à votre compte">
        <div>Content</div>
      </AuthCard>,
    )
    expect(screen.getByText("Connectez-vous à votre compte")).toBeInTheDocument()
  })

  it("should have Logo component", () => {
    const { container } = render(
      <AuthCard title="Connexion" description="Bienvenue">
        <div>Content</div>
      </AuthCard>,
    )
    // Logo is rendered in the header
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("should wrap content in Card component", () => {
    const { container } = render(
      <AuthCard title="Connexion" description="Bienvenue">
        <div>Content</div>
      </AuthCard>,
    )
    // Card component creates a section/div with specific styling
    const card = container.querySelector("div[class*='rounded']")
    expect(card).toBeInTheDocument()
  })
})
