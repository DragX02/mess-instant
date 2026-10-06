import { describe, it, expect, vi } from "vitest"
import { abonner, publier } from "@/lib/temps-reel"

vi.mock("@/lib/prisma", () => ({ prisma: {} }))

describe("temps réel", () => {
  it("envoie l'événement aux utilisateurs visés", () => {
    const alice = vi.fn()
    const bob = vi.fn()
    const finAlice = abonner({ userId: "alice", envoyer: alice })
    const finBob = abonner({ userId: "bob", envoyer: bob })

    publier(["alice"], { type: "messages", conversationId: "c1" })

    expect(alice).toHaveBeenCalledWith({ type: "messages", conversationId: "c1" })
    expect(bob).not.toHaveBeenCalled()

    finAlice()
    finBob()
  })

  it("n'envoie rien aux visiteurs non connectés sauf pour tous", () => {
    const visiteur = vi.fn()
    const fin = abonner({ userId: null, envoyer: visiteur })

    publier(["alice"], { type: "donnees" })
    expect(visiteur).not.toHaveBeenCalled()

    publier("tous", { type: "donnees" })
    expect(visiteur).toHaveBeenCalledWith({ type: "donnees" })

    fin()
  })

  it("n'envoie plus rien après le désabonnement", () => {
    const alice = vi.fn()
    const fin = abonner({ userId: "alice", envoyer: alice })

    fin()
    publier(["alice"], { type: "donnees" })

    expect(alice).not.toHaveBeenCalled()
  })
})
