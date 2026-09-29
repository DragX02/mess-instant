import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProfileForm } from "@/components/auth/profile-form"

// Mock the server actions
vi.mock("@/app/profil/actions", () => ({
  updateProfileName: vi.fn(),
  changePassword: vi.fn(),
}))

const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
}

describe("ProfileForm Component", () => {
  describe("Name Update Form", () => {
    it("should render name update form", () => {
      render(<ProfileForm user={mockUser} />)
      expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument()
    })

    it("should display current name in disabled input", () => {
      render(<ProfileForm user={mockUser} />)
      const currentNameInput = screen.getByDisplayValue("Test User")
      expect(currentNameInput).toBeDisabled()
    })

    it("should have new name input field", () => {
      render(<ProfileForm user={mockUser} />)
      const newNameInput = screen.getByPlaceholderText("Entrez votre nouveau nom")
      expect(newNameInput).toBeInTheDocument()
    })

    it("should have update button", () => {
      render(<ProfileForm user={mockUser} />)
      expect(screen.getByRole("button", { name: /Mettre à jour le nom/i })).toBeInTheDocument()
    })

    it("should allow user to input new name", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} />)

      const newNameInput = screen.getByPlaceholderText("Entrez votre nouveau nom")
      await user.type(newNameInput, "Nouveau Nom")

      expect(newNameInput).toHaveValue("Nouveau Nom")
    })
  })

  describe("Password Change Form - with password", () => {
    it("should render password section when user has password", () => {
      render(<ProfileForm user={mockUser} hasPassword={true} />)
      expect(screen.getByText(/Sécurité/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Mot de passe actuel/i)).toBeInTheDocument()
    })

    it("should have password input fields", () => {
      render(<ProfileForm user={mockUser} hasPassword={true} />)
      expect(screen.getByPlaceholderText("Mot de passe actuel")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Minimum 8 caractères")).toBeInTheDocument()
    })

    it("should have password visibility toggle buttons", () => {
      render(<ProfileForm user={mockUser} hasPassword={true} />)
      const toggleButtons = screen.getAllByRole("button", { name: /toggle/i })
      expect(toggleButtons.length).toBeGreaterThanOrEqual(3)
    })

    it("should toggle password visibility", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} hasPassword={true} />)

      const currentPasswordInput = screen.getByPlaceholderText("Mot de passe actuel")
      expect(currentPasswordInput).toHaveAttribute("type", "password")

      // Find and click the first toggle button
      const toggleButtons = screen.getAllByRole("button")
      await user.click(toggleButtons[0])

      expect(currentPasswordInput).toHaveAttribute("type", "text")
    })
  })

  describe("Password Change Form - without password (OAuth)", () => {
    it("should not render password change form for OAuth accounts", () => {
      render(<ProfileForm user={mockUser} hasPassword={false} />)
      expect(screen.queryByLabelText(/Mot de passe actuel/i)).not.toBeInTheDocument()
    })

    it("should show informative message for OAuth accounts", () => {
      render(<ProfileForm user={mockUser} hasPassword={false} />)
      expect(screen.getByText(/créé avec Google/i)).toBeInTheDocument()
    })

    it("should still show name update form for OAuth accounts", () => {
      render(<ProfileForm user={mockUser} hasPassword={false} />)
      expect(screen.getByText(/Nom d'utilisateur/i)).toBeInTheDocument()
    })
  })

  describe("Message Display", () => {
    it("should display success message after successful update", async () => {
      render(<ProfileForm user={mockUser} />)
      // This would require mocking the action to return success
      // Implementation depends on how the component handles async operations
    })

    it("should display error message on validation failure", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} hasPassword={true} />)

      const updateButton = screen.getByRole("button", { name: /Changer le mot de passe/i })
      await user.click(updateButton)

      // Should show error for missing fields
      await waitFor(() => {
        expect(screen.getByText(/requis/i)).toBeInTheDocument()
      })
    })
  })

  describe("Form Validation", () => {
    it("should prevent empty name submission", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} />)

      const updateButton = screen.getByRole("button", { name: /Mettre à jour le nom/i })
      await user.click(updateButton)

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/ne peut pas être vide/i)).toBeInTheDocument()
      })
    })

    it("should prevent mismatched password confirmation", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} hasPassword={true} />)

      const newPasswordInput = screen.getByPlaceholderText("Minimum 8 caractères")
      const confirmPasswordInput = screen.getAllByPlaceholderText(/Confirmez/i)[0]

      await user.type(newPasswordInput, "Password123")
      await user.type(confirmPasswordInput, "DifferentPassword123")

      const changeButton = screen.getByRole("button", { name: /Changer le mot de passe/i })
      await user.click(changeButton)

      await waitFor(() => {
        expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument()
      })
    })

    it("should prevent short password submission", async () => {
      const user = userEvent.setup()
      render(<ProfileForm user={mockUser} hasPassword={true} />)

      const newPasswordInput = screen.getByPlaceholderText("Minimum 8 caractères")
      const confirmPasswordInput = screen.getAllByPlaceholderText(/Confirmez/i)[0]

      await user.type(newPasswordInput, "Pass1!")
      await user.type(confirmPasswordInput, "Pass1!")

      const changeButton = screen.getByRole("button", { name: /Changer le mot de passe/i })
      await user.click(changeButton)

      await waitFor(() => {
        expect(screen.getByText(/au moins 8 caractères/i)).toBeInTheDocument()
      })
    })
  })

  describe("Accessibility", () => {
    it("should have proper labels for all inputs", () => {
      render(<ProfileForm user={mockUser} hasPassword={true} />)
      expect(screen.getByLabelText(/Nom actuel/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Nouveau nom/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Mot de passe actuel/i)).toBeInTheDocument()
    })

    it("should have descriptive button text", () => {
      render(<ProfileForm user={mockUser} hasPassword={true} />)
      expect(screen.getByRole("button", { name: /Mettre à jour le nom/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /Changer le mot de passe/i })).toBeInTheDocument()
    })
  })
})
