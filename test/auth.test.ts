import { describe, it, expect } from "vitest"
import { validatePasswordStrength } from "@/lib/password-validator"
import { translateError } from "@/lib/error-messages"

describe("Password Validator", () => {
  describe("validatePasswordStrength", () => {
    it("should reject empty password", () => {
      const result = validatePasswordStrength("")
      expect(result.isValid).toBe(false)
      expect(result.score).toBe(0)
      expect(result.level).toBe("weak")
    })

    it("should reject password with less than 8 characters", () => {
      const result = validatePasswordStrength("abc!")
      expect(result.isValid).toBe(false)
    })

    it("should accept strong password with all criteria", () => {
      const result = validatePasswordStrength("StrongPass123!")
      expect(result.isValid).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(3)
    })

    it("should require minimum 8 characters", () => {
      const result = validatePasswordStrength("Short!")
      expect(result.feedback.some((f) => f.includes("8"))).toBe(true)
    })

    it("should require uppercase letter", () => {
      const result = validatePasswordStrength("lowercase123!")
      expect(result.feedback.some((f) => f.includes("majuscule"))).toBe(true)
    })

    it("should require lowercase letter", () => {
      const result = validatePasswordStrength("UPPERCASE123!")
      expect(result.feedback.some((f) => f.includes("minuscule"))).toBe(true)
    })

    it("should require number", () => {
      const result = validatePasswordStrength("NoNumbers!")
      expect(result.feedback.some((f) => f.includes("chiffre"))).toBe(true)
    })

    it("should require special character", () => {
      const result = validatePasswordStrength("NoSpecial123")
      expect(result.feedback.some((f) => f.includes("spécial"))).toBe(true)
    })

    it("should score based on met criteria", () => {
      const weak = validatePasswordStrength("abcdefgh")
      const fair = validatePasswordStrength("Abcdefgh123")
      const strong = validatePasswordStrength("Abcdefgh123!")

      expect(weak.score).toBeLessThan(fair.score)
      expect(fair.score).toBeLessThan(strong.score)
    })
  })
})

describe("Error Messages", () => {
  describe("translateError", () => {
    it("should translate known errors to French", () => {
      expect(translateError("Invalid email or password")).toBe("Email ou mot de passe incorrect")
    })

    it("should translate OAuth errors", () => {
      expect(translateError("access_denied")).toContain("refusé")
      expect(translateError("invalid_request")).toContain("invalide")
    })

    it("should handle null or undefined", () => {
      expect(translateError(null)).toBe("Une erreur est survenue")
      expect(translateError(undefined)).toBe("Une erreur est survenue")
    })

    it("should return original message if not found and is short", () => {
      const msg = "Custom short error"
      expect(translateError(msg)).toBe(msg)
    })

    it("should return generic message for long unknown errors", () => {
      const longMsg = "A".repeat(101)
      expect(translateError(longMsg)).toBe("Une erreur est survenue")
    })

    it("should translate user creation errors", () => {
      expect(translateError("User already exists")).toContain("existe déjà")
      expect(translateError("User not found")).toContain("n'existe pas")
    })

    it("should translate email verification errors", () => {
      expect(translateError("Email not verified")).toContain("vérifier")
    })

    it("should translate password reset errors", () => {
      expect(translateError("Invalid token")).toContain("invalide")
      expect(translateError("Token expired")).toContain("expiré")
    })
  })
})
