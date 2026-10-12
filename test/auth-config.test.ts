import { describe, it, expect, vi } from "vitest"

// On inspecte la config passée à betterAuth() sans démarrer de base ni de serveur.
const betterAuth = vi.hoisted(() => vi.fn((options: unknown) => ({ options })))

vi.mock("better-auth", () => ({ betterAuth }))
vi.mock("better-auth/adapters/prisma", () => ({ prismaAdapter: vi.fn() }))
vi.mock("better-auth/next-js", () => ({ nextCookies: vi.fn(() => ({})) }))
vi.mock("@/lib/prisma", () => ({ prisma: {} }))
vi.mock("@/lib/email", () => ({
  sendResetPasswordEmail: vi.fn(),
  sendVerificationEmail: vi.fn(),
}))

describe("Configuration better-auth", async () => {
  process.env.BETTER_AUTH_URL = "http://localhost:3000"
  await import("@/lib/auth")

  const options = betterAuth.mock.calls[0][0] as {
    trustedOrigins: string[]
    advanced: { useSecureCookies: boolean }
    rateLimit: { customRules: Record<string, { window: number; max: number }> }
    emailAndPassword: { revokeSessionsOnPasswordReset: boolean; requireEmailVerification: boolean }
  }

  it("limite les origines de confiance (anti open redirect)", () => {
    expect(options.trustedOrigins).toContain("http://localhost:3000")
    expect(options.trustedOrigins.every((origine) => /^https?:\/\//.test(origine))).toBe(true)
    expect(options.trustedOrigins).not.toContain("*")
  })

  it("limite le débit des routes sensibles", () => {
    for (const route of ["/sign-in/email", "/sign-up/email", "/request-password-reset"]) {
      expect(options.rateLimit.customRules[route]).toBeDefined()
      expect(options.rateLimit.customRules[route].max).toBeLessThanOrEqual(5)
    }
  })

  it("révoque les sessions après un reset de mot de passe", () => {
    expect(options.emailAndPassword.revokeSessionsOnPasswordReset).toBe(true)
  })

  it("exige la vérification de l'email", () => {
    expect(options.emailAndPassword.requireEmailVerification).toBe(true)
  })
})
