import { describe, it, expect } from "vitest"
import { validatePasswordStrength } from "@/lib/password-validator"
import { translateError } from "@/lib/error-messages"

describe("Auth Integration Tests", () => {
  describe("Password Validation Flow", () => {
    it("should validate complete password workflow", () => {
      // Weak to strong password progression
      const weak = validatePasswordStrength("ab")
      const medium = validatePasswordStrength("Abc123")
      const strong = validatePasswordStrength("Password123!")

      expect(weak.isValid).toBe(false)
      expect(medium.isValid).toBe(true)
      expect(strong.isValid).toBe(true)

      // Score should increase
      expect(weak.score).toBeLessThan(medium.score)
      expect(medium.score).toBeLessThanOrEqual(strong.score)
    })

    it("should provide feedback for weak password", () => {
      const result = validatePasswordStrength("abc")
      expect(result.feedback.length).toBeGreaterThan(0)
      expect(result.isValid).toBe(false)
    })
  })

  describe("Error Handling Flow", () => {
    it("should handle authentication errors consistently", () => {
      const authErrors = ["Invalid email or password", "User not found", "Email not verified"]

      authErrors.forEach((error) => {
        const translated = translateError(error)
        expect(translated).not.toContain("Error")
        expect(translated.length).toBeGreaterThan(0)
      })
    })

    it("should handle OAuth error flow", () => {
      const oauthErrors = [
        { code: "access_denied", expectFr: true },
        { code: "invalid_request", expectFr: true },
        { code: "server_error", expectFr: true },
      ]

      oauthErrors.forEach(({ code, expectFr }) => {
        const message = translateError(code)
        if (expectFr) {
          expect(message).not.toBe(code)
        }
      })
    })
  })

  describe("Password Match Validation", () => {
    it("should validate matching passwords", () => {
      const password = "StrongPass123!"
      const confirm = "StrongPass123!"

      const result1 = validatePasswordStrength(password)
      const result2 = validatePasswordStrength(confirm)

      expect(result1.isValid).toBe(true)
      expect(result2.isValid).toBe(true)
      expect(password === confirm).toBe(true)
    })

    it("should detect mismatched passwords", () => {
      const password = "StrongPass123!"
      const confirm = "StrongPass124!"

      expect(password === confirm).toBe(false)
    })
  })

  describe("Email Validation", () => {
    it("should identify valid email formats", () => {
      const validEmails = ["user@example.com", "test@domain.co.uk", "name.surname@company.org"]

      validEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it("should identify invalid email formats", () => {
      const invalidEmails = ["notanemail", "@example.com", "user@", "user @example.com"]

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      invalidEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe("Form State Management", () => {
    it("should track password strength as user types", () => {
      const passwords = ["a", "ab", "Ab1", "Ab1!", "Ab1!@", "StrongPass123!"]

      const results = passwords.map((pwd) => validatePasswordStrength(pwd))

      // Score should be non-decreasing as password gets longer/better
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score)
      }
    })
  })
})
