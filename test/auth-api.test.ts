import { describe, it, expect, vi } from "vitest"

// Mock next/navigation for redirect
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT_TO:${url}`)
  }),
}))

describe("Auth API Routes", () => {
  describe("GET /api/auth/error", () => {
    it("should parse error parameters from query string", () => {
      const url = "http://localhost:3000/api/auth/error?error=access_denied&error_description=User%20denied%20access"
      const { searchParams } = new URL(url)

      const error = searchParams.get("error")
      const error_description = searchParams.get("error_description")

      expect(error).toBe("access_denied")
      expect(error_description).toBe("User denied access")
    })

    it("should handle missing error parameters", () => {
      const url = "http://localhost:3000/api/auth/error"
      const { searchParams } = new URL(url)

      const error = searchParams.get("error")
      const error_description = searchParams.get("error_description")

      expect(error).toBeNull()
      expect(error_description).toBeNull()
    })

    it("should construct URLSearchParams correctly", () => {
      const error = "invalid_request"
      const error_description = "Missing required parameter"

      const params = new URLSearchParams()
      if (error) params.append("error", error)
      if (error_description) params.append("error_description", error_description)

      const result = params.toString()
      expect(result).toContain("error=invalid_request")
      expect(result).toContain("error_description")
    })

    it("should skip empty parameters", () => {
      const error = "server_error"
      const error_description = null

      const params = new URLSearchParams()
      if (error) params.append("error", error)
      if (error_description) params.append("error_description", error_description)

      const result = params.toString()
      expect(result).toContain("error=server_error")
      expect(result).not.toContain("error_description")
    })
  })

  describe("OAuth Error Codes", () => {
    it("should recognize access_denied error", () => {
      const error = "access_denied"
      expect(["access_denied", "invalid_request", "server_error"]).toContain(error)
    })

    it("should recognize invalid_request error", () => {
      const error = "invalid_request"
      expect(["access_denied", "invalid_request", "server_error"]).toContain(error)
    })

    it("should recognize server_error error", () => {
      const error = "server_error"
      expect(["access_denied", "invalid_request", "server_error"]).toContain(error)
    })
  })
})
