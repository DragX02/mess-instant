import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConnexionPage from "@/app/auth/connexion/page"
import InscriptionPage from "@/app/auth/inscription/page"

// Mock authClient
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
      social: vi.fn(),
    },
  },
}))

// Mock useRouter
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ""
  },
}))

describe("Connexion Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render connexion form", () => {
    render(<ConnexionPage />)
    expect(screen.getByText("Connexion")).toBeInTheDocument()
  })

  it("should render email input field", () => {
    render(<ConnexionPage />)
    const emailInput = screen.getByPlaceholderText("vous@entreprise.com")
    expect(emailInput).toBeInTheDocument()
  })

  it("should render password input field", () => {
    render(<ConnexionPage />)
    const passwordInput = document.getElementById("password")
    expect(passwordInput).toBeInTheDocument()
  })

  it("should have submit button", () => {
    render(<ConnexionPage />)
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument()
  })

  it("should have sign up link", () => {
    render(<ConnexionPage />)
    expect(screen.getByRole("link", { name: /inscrivez-vous/i })).toBeInTheDocument()
  })

  it("should have forgotten password link", () => {
    render(<ConnexionPage />)
    expect(screen.getByRole("link", { name: /mot de passe oublié/i })).toBeInTheDocument()
  })

  it("should render Google login button", () => {
    render(<ConnexionPage />)
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("should update email state on input change", async () => {
    const user = userEvent.setup()
    render(<ConnexionPage />)

    const emailInput = screen.getByPlaceholderText("vous@entreprise.com") as HTMLInputElement
    await user.type(emailInput, "test@example.com")

    expect(emailInput.value).toBe("test@example.com")
  })

  it("should update password state on input change", async () => {
    const user = userEvent.setup()
    render(<ConnexionPage />)

    const passwordInput = document.getElementById("password") as HTMLInputElement
    await user.type(passwordInput, "password123")

    expect(passwordInput.value).toBe("password123")
  })
})

describe("Inscription Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render inscription form", () => {
    render(<InscriptionPage />)
    expect(screen.getByText("Créer un compte")).toBeInTheDocument()
  })

  it("should render name input", () => {
    render(<InscriptionPage />)
    const nameInput = screen.getByPlaceholderText("Votre nom")
    expect(nameInput).toBeInTheDocument()
  })

  it("should render email input", () => {
    render(<InscriptionPage />)
    const emailInput = screen.getByPlaceholderText("vous@entreprise.com")
    expect(emailInput).toBeInTheDocument()
  })

  it("should render password inputs", () => {
    render(<InscriptionPage />)
    const passwordInput = document.getElementById("password")
    const confirmInput = document.getElementById("confirm-password")
    expect(passwordInput).toBeInTheDocument()
    expect(confirmInput).toBeInTheDocument()
  })

  it("should have submit button", () => {
    render(<InscriptionPage />)
    expect(screen.getByRole("button", { name: /créer mon compte/i })).toBeInTheDocument()
  })

  it("should have login link", () => {
    render(<InscriptionPage />)
    expect(screen.getByRole("link", { name: /connectez-vous/i })).toBeInTheDocument()
  })

  it("should render Google signup button", () => {
    render(<InscriptionPage />)
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("should render description", () => {
    render(<InscriptionPage />)
    expect(screen.getByText("Rejoignez votre équipe sur Helix en quelques secondes.")).toBeInTheDocument()
  })

  it("should have password fields", () => {
    render(<InscriptionPage />)
    const passwordInput = document.getElementById("password") as HTMLInputElement
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput.type).toBe("password")
  })
})
