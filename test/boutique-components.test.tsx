import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { Portefeuille } from "@/lib/types"
import { BoutiqueDialog } from "@/components/chat/boutique-dialog"
import { SettingsDialog } from "@/components/chat/settings-dialog"
import { UserMenu } from "@/components/chat/user-menu"

function portefeuille(infos: Partial<Portefeuille> = {}): Portefeuille {
  return {
    coins: 600,
    grade: 1,
    gradeExpiresAt: null,
    ownedThemes: ["classique"],
    serversCreated: 1,
    maxServers: 1,
    ...infos,
  }
}

function reponseFetch(status: number, data: unknown) {
  return { ok: status < 400, status, json: async () => data }
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe("BoutiqueDialog", () => {
  it("affiche les pièces, le grade et les serveurs", () => {
    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={() => {}} />)

    expect(screen.getByText("600 pièces")).toBeInTheDocument()
    expect(screen.getByText(/Grade actuel : Bronze/)).toBeInTheDocument()
    expect(screen.getByText(/Serveurs créés : 1 \/ 1/)).toBeInTheDocument()
  })

  it("achète le grade Argent", async () => {
    const fetch = vi.fn(async () => reponseFetch(200, { ok: true }))
    vi.stubGlobal("fetch", fetch)
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={onChange} />)
    await user.click(screen.getByRole("button", { name: "Acheter le grade Argent" }))

    const [url, options] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe("/api/boutique")
    expect(JSON.parse(String(options.body))).toEqual({ type: "grade", niveau: 2 })
    expect(onChange).toHaveBeenCalled()
  })

  it("affiche les 3 packs avec la réduction", () => {
    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={() => {}} />)

    expect(screen.getByText("499 pièces")).toBeInTheDocument()
    expect(screen.getByText("1499 pièces")).toBeInTheDocument()
    expect(screen.getByText("3000 pièces")).toBeInTheDocument()
    expect(screen.getByText("-15 %")).toBeInTheDocument()
    expect(screen.getByText("25,50 €")).toBeInTheDocument()
  })

  it("achète un pack de pièces", async () => {
    const fetch = vi.fn(async () => reponseFetch(200, { ok: true }))
    vi.stubGlobal("fetch", fetch)
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={onChange} />)
    await user.click(screen.getByRole("button", { name: "Acheter le pack Équipe" }))

    const [, options] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(String(options.body))).toEqual({ type: "pack", id: "equipe" })
    expect(onChange).toHaveBeenCalled()
  })

  it("désactive un achat trop cher", () => {
    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={() => {}} />)

    expect(screen.getByRole("button", { name: "Acheter le grade Or" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Acheter le grade Argent" })).toBeEnabled()
  })

  it("propose de prolonger le grade actuel", () => {
    render(
      <BoutiqueDialog
        portefeuille={portefeuille({ grade: 2, gradeExpiresAt: "2026-11-05T12:00:00.000Z" })}
        onClose={() => {}}
        onChange={() => {}}
      />,
    )

    expect(screen.getByRole("button", { name: "Prolonger le grade Argent" })).toBeInTheDocument()
    expect(screen.getByText(/jusqu'au 05\/11\/2026/)).toBeInTheDocument()
  })

  it("affiche l'erreur renvoyée par le serveur", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => reponseFetch(400, { error: "Pas assez de pièces." })),
    )
    const user = userEvent.setup()

    render(<BoutiqueDialog portefeuille={portefeuille()} onClose={() => {}} onChange={() => {}} />)
    await user.click(screen.getByRole("button", { name: "Acheter le thème Univers" }))

    expect(await screen.findByText("Pas assez de pièces.")).toBeInTheDocument()
  })

  it("indique les thèmes déjà possédés", () => {
    render(
      <BoutiqueDialog
        portefeuille={portefeuille({ ownedThemes: ["classique", "univers"] })}
        onClose={() => {}}
        onChange={() => {}}
      />,
    )

    expect(screen.getAllByText("Possédé")).toHaveLength(2)
    expect(screen.queryByRole("button", { name: "Acheter le thème Univers" })).toBeNull()
  })
})

describe("SettingsDialog avec les thèmes achetés", () => {
  it("bloque un thème qui n'est pas acheté", () => {
    render(
      <SettingsDialog
        current="classique"
        owned={["classique"]}
        onApply={() => {}}
        onClose={() => {}}
      />,
    )

    expect(screen.getByRole("button", { name: /Univers/ })).toBeDisabled()
    expect(screen.getByText(/À acheter dans la boutique/)).toBeInTheDocument()
  })

  it("permet de choisir un thème acheté", async () => {
    const onApply = vi.fn()
    const user = userEvent.setup()

    render(
      <SettingsDialog
        current="classique"
        owned={["classique", "univers"]}
        onApply={onApply}
        onClose={() => {}}
      />,
    )
    await user.click(screen.getByRole("button", { name: /Univers/ }))
    await user.click(screen.getByRole("button", { name: "Installer et appliquer" }))

    expect(onApply).toHaveBeenCalledWith("univers")
  })
})

describe("UserMenu avec la boutique", () => {
  it("affiche les pièces et ouvre la boutique", async () => {
    const onOpenShop = vi.fn()
    const user = userEvent.setup()

    render(
      <UserMenu
        user={{ id: "u1", name: "Alice", isAdmin: false }}
        portefeuille={portefeuille({ grade: 3 })}
        onOpenShop={onOpenShop}
        onOpenSettings={() => {}}
        onSignOut={() => {}}
      />,
    )

    expect(screen.getByText(/600/)).toBeInTheDocument()
    expect(screen.getByText(/Or/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Menu utilisateur" }))
    await user.click(screen.getByRole("button", { name: "Boutique" }))

    expect(onOpenShop).toHaveBeenCalled()
  })
})
