import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { codeErreurAuth } from "@/lib/auth-errors"

const mocks = vi.hoisted(() => ({
  params: new URLSearchParams(),
  redirect: vi.fn((url: string) => {
    throw new Error("NEXT_REDIRECT:" + url)
  }),
}))

vi.mock("next/navigation", () => ({
  useSearchParams: () => mocks.params,
  useRouter: () => ({ push: vi.fn() }),
  redirect: mocks.redirect,
}))

import AuthErrorPage from "@/app/auth/error/page"
import { GET } from "@/app/api/auth/error/route"

async function appelerRoute(query: string) {
  try {
    await GET(new Request("http://localhost:3000/api/auth/error" + query))
  } catch (erreur) {
    return (erreur as Error).message.replace("NEXT_REDIRECT:", "")
  }
  return null
}

describe("codeErreurAuth (liste blanche)", () => {
  it("accepte les codes connus", () => {
    expect(codeErreurAuth("access_denied")).toBe("access_denied")
    expect(codeErreurAuth("account_not_found")).toBe("account_not_found")
  })

  it("rejette tout le reste", () => {
    expect(codeErreurAuth(null)).toBeNull()
    expect(codeErreurAuth("")).toBeNull()
    expect(codeErreurAuth("ACCESS_DENIED")).toBeNull()
    expect(codeErreurAuth("Votre compte est suspendu, appelez le 0800 000 000")).toBeNull()
    expect(codeErreurAuth("<script>alert(1)</script>")).toBeNull()
    expect(codeErreurAuth("access_denied&error_description=x")).toBeNull()
  })
})

describe("GET /api/auth/error", () => {
  beforeEach(() => {
    mocks.redirect.mockClear()
  })

  it("redirige avec un code connu", async () => {
    expect(await appelerRoute("?error=access_denied")).toBe("/auth/error?error=access_denied")
  })

  it("supprime error_description", async () => {
    const cible = await appelerRoute("?error=server_error&error_description=Appelez%20le%200800")
    expect(cible).toBe("/auth/error?error=server_error")
    expect(cible).not.toContain("error_description")
  })

  it("ne retransmet pas un code inconnu ou un texte libre", async () => {
    expect(await appelerRoute("?error=Compte%20pirat%C3%A9")).toBe("/auth/error")
    expect(await appelerRoute("?error=%3Cscript%3E")).toBe("/auth/error")
    expect(await appelerRoute("")).toBe("/auth/error")
  })

  it("ne redirige jamais hors du site", async () => {
    const cible = await appelerRoute("?error=https://evil.example&next=https://evil.example")
    expect(cible).toBe("/auth/error")
    expect(cible?.startsWith("/")).toBe(true)
  })
})

describe("Page /auth/error", () => {
  it("n'affiche pas un error_description piégé", () => {
    mocks.params = new URLSearchParams({
      error: "access_denied",
      error_description: "Votre compte est suspendu, appelez le 0800 000 000",
    })
    render(<AuthErrorPage />)
    expect(screen.queryByText(/0800/)).not.toBeInTheDocument()
    expect(screen.queryByText(/suspendu/)).not.toBeInTheDocument()
  })

  it("n'affiche pas un texte libre passé dans error", () => {
    mocks.params = new URLSearchParams({ error: "Virez 500 euros sur le compte FR76" })
    render(<AuthErrorPage />)
    expect(screen.queryByText(/500 euros/)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Une erreur s'est produite lors de l'authentification.",
    )
  })

  it("affiche un message traduit pour un code connu", () => {
    mocks.params = new URLSearchParams({ error: "access_denied" })
    render(<AuthErrorPage />)
    expect(screen.getByRole("alert")).toHaveTextContent(/refusé d'autoriser Helix/)
  })
})
