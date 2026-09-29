import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import AuthErrorPage from "@/app/auth/error/page"

// Mock translateError
vi.mock("@/lib/error-messages", () => ({
  translateError: (msg: string | null | undefined) => {
    const translations: Record<string, string> = {
      access_denied: "Accès refusé",
      invalid_request: "Requête invalide",
      server_error: "Erreur serveur",
    }
    return translations[msg as string] || msg || "Une erreur est survenue"
  },
}))

// Create mock search params
let mockParams = new URLSearchParams()

// Mock useSearchParams
vi.mock("next/navigation", () => ({
  useSearchParams() {
    return mockParams
  },
  useRouter() {
    return {
      push: vi.fn(),
    }
  },
}))

describe("Auth Error Page", () => {
  it("should render default error message when no params", () => {
    mockParams = new URLSearchParams()
    render(<AuthErrorPage />)
    expect(screen.getByText("Erreur d'authentification")).toBeInTheDocument()
  })

  it("should render access_denied error title", () => {
    mockParams = new URLSearchParams("error=access_denied")
    render(<AuthErrorPage />)
    expect(screen.getByText("Authentification annulée")).toBeInTheDocument()
  })

  it("should render invalid_request error title", () => {
    mockParams = new URLSearchParams("error=invalid_request")
    const { container } = render(<AuthErrorPage />)
    const title = container.querySelector("[data-slot='card-title']")
    expect(title?.textContent).toBe("Requête invalide")
  })

  it("should render server_error error title", () => {
    mockParams = new URLSearchParams("error=server_error")
    const { container } = render(<AuthErrorPage />)
    const title = container.querySelector("[data-slot='card-title']")
    expect(title?.textContent).toBe("Erreur serveur")
  })

  it("should have links for navigation", () => {
    mockParams = new URLSearchParams()
    render(<AuthErrorPage />)
    const links = screen.getAllByRole("link")
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it("should have support contact link", () => {
    mockParams = new URLSearchParams()
    render(<AuthErrorPage />)
    const supportLink = screen.getByRole("link", { name: /contacter le support/i })
    expect(supportLink).toBeInTheDocument()
    expect(supportLink).toHaveAttribute("href", "mailto:hello@helix.app")
  })

  it("should render error page description", () => {
    mockParams = new URLSearchParams()
    render(<AuthErrorPage />)
    expect(screen.getByText("Une erreur s'est produite lors de la connexion.")).toBeInTheDocument()
  })

  it("should have error message container", () => {
    mockParams = new URLSearchParams()
    render(<AuthErrorPage />)
    const alert = screen.getByRole("alert")
    expect(alert).toBeInTheDocument()
  })

  it("should display translated error message", () => {
    mockParams = new URLSearchParams("error=access_denied")
    render(<AuthErrorPage />)
    expect(screen.getByText("Accès refusé")).toBeInTheDocument()
  })
})
