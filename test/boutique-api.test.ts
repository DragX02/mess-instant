import { describe, it, expect, vi, beforeEach } from "vitest"

const prisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
  server: { count: vi.fn(), create: vi.fn() },
}))

const chat = vi.hoisted(() => ({ getCurrentUser: vi.fn() }))

vi.mock("@/lib/prisma", () => ({ prisma }))

vi.mock("@/lib/chat", () => ({
  getCurrentUser: chat.getCurrentUser,
  DEFAULT_SERVER_ID: "helix",
  joinDefaultServer: vi.fn(),
  newInviteCode: () => "CODE1234",
}))

import { GET, POST } from "@/app/api/boutique/route"
import { POST as creerServeur } from "@/app/api/serveurs/route"
import { donnerPieces } from "@/lib/monnaie"

const DANS_10_JOURS = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)

function utilisateur(infos: Record<string, unknown> = {}) {
  return {
    id: "u1",
    email: "a@a.fr",
    name: "Alice",
    isAdmin: false,
    coins: 1000,
    grade: 1,
    gradeExpiresAt: null,
    coinsEarnedToday: 0,
    coinsDay: null,
    ownedThemes: ["classique"],
    ...infos,
  }
}

function requete(body: unknown) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  prisma.user.updateMany.mockResolvedValue({ count: 1 })
  prisma.server.count.mockResolvedValue(0)
  prisma.server.create.mockResolvedValue({ id: "s1" })
})

describe("GET /api/boutique", () => {
  it("refuse un visiteur non connecté", async () => {
    chat.getCurrentUser.mockResolvedValue(null)
    const reponse = await GET()
    expect(reponse.status).toBe(401)
  })

  it("renvoie les pièces, le grade et les serveurs créés", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ grade: 2, gradeExpiresAt: DANS_10_JOURS }))
    prisma.server.count.mockResolvedValue(2)

    const data = await (await GET()).json()

    expect(data.coins).toBe(1000)
    expect(data.grade).toBe(2)
    expect(data.serversCreated).toBe(2)
    expect(data.maxServers).toBe(3)
    expect(data.ownedThemes).toEqual(["classique"])
  })

  it("affiche le grade 1 quand le grade est expiré", async () => {
    chat.getCurrentUser.mockResolvedValue(
      utilisateur({ grade: 3, gradeExpiresAt: new Date("2020-01-01") }),
    )

    const data = await (await GET()).json()

    expect(data.grade).toBe(1)
    expect(data.gradeExpiresAt).toBe(null)
    expect(data.maxServers).toBe(1)
  })
})

describe("POST /api/boutique", () => {
  it("achète un grade et retire les pièces", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur())

    const reponse = await POST(requete({ type: "grade", niveau: 2 }))

    expect(reponse.status).toBe(200)
    const appel = prisma.user.updateMany.mock.calls[0][0]
    expect(appel.where).toEqual({ id: "u1", coins: { gte: 500 } })
    expect(appel.data.coins).toEqual({ decrement: 500 })
    expect(appel.data.grade).toBe(2)
    expect(appel.data.gradeExpiresAt).toBeInstanceOf(Date)
  })

  it("refuse quand il n'y a pas assez de pièces", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ coins: 10 }))
    prisma.user.updateMany.mockResolvedValue({ count: 0 })

    const reponse = await POST(requete({ type: "grade", niveau: 3 }))

    expect(reponse.status).toBe(400)
    expect((await reponse.json()).error).toContain("pièces")
  })

  it("refuse un grade inférieur au grade actuel", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ grade: 3, gradeExpiresAt: DANS_10_JOURS }))

    const reponse = await POST(requete({ type: "grade", niveau: 2 }))

    expect(reponse.status).toBe(400)
    expect(prisma.user.updateMany).not.toHaveBeenCalled()
  })

  it("achète un thème et l'ajoute aux thèmes possédés", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur())

    const reponse = await POST(requete({ type: "theme", id: "univers" }))

    expect(reponse.status).toBe(200)
    const appel = prisma.user.updateMany.mock.calls[0][0]
    expect(appel.data.ownedThemes).toEqual({ push: "univers" })
    expect(appel.data.coins).toEqual({ decrement: 300 })
  })

  it("refuse un thème déjà possédé", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ ownedThemes: ["classique", "univers"] }))

    const reponse = await POST(requete({ type: "theme", id: "univers" }))

    expect(reponse.status).toBe(400)
    expect(prisma.user.updateMany).not.toHaveBeenCalled()
  })

  it("refuse un thème inconnu", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur())

    const reponse = await POST(requete({ type: "theme", id: "licorne" }))

    expect(reponse.status).toBe(400)
  })
})

describe("POST /api/serveurs avec les grades", () => {
  it("le grade 1 peut créer son premier serveur", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur())

    const reponse = await creerServeur(requete({ name: "Mon serveur" }))

    expect(reponse.status).toBe(200)
  })

  it("le grade 1 ne peut pas créer un deuxième serveur", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur())
    prisma.server.count.mockResolvedValue(1)

    const reponse = await creerServeur(requete({ name: "Encore un" }))

    expect(reponse.status).toBe(403)
    expect((await reponse.json()).error).toContain("boutique")
    expect(prisma.server.create).not.toHaveBeenCalled()
  })

  it("le grade 2 peut aller jusqu'à 3 serveurs", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ grade: 2, gradeExpiresAt: DANS_10_JOURS }))
    prisma.server.count.mockResolvedValue(2)
    expect((await creerServeur(requete({ name: "Trois" }))).status).toBe(200)

    prisma.server.count.mockResolvedValue(3)
    expect((await creerServeur(requete({ name: "Quatre" }))).status).toBe(403)
  })

  it("le grade 3 peut aller jusqu'à 5 serveurs", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ grade: 3, gradeExpiresAt: DANS_10_JOURS }))
    prisma.server.count.mockResolvedValue(4)
    expect((await creerServeur(requete({ name: "Cinq" }))).status).toBe(200)

    prisma.server.count.mockResolvedValue(5)
    expect((await creerServeur(requete({ name: "Six" }))).status).toBe(403)
  })

  it("un admin n'a pas de limite", async () => {
    chat.getCurrentUser.mockResolvedValue(utilisateur({ isAdmin: true }))
    prisma.server.count.mockResolvedValue(50)

    expect((await creerServeur(requete({ name: "Admin" }))).status).toBe(200)
  })
})

describe("donnerPieces", () => {
  it("ajoute 1 pièce à l'utilisateur", async () => {
    prisma.user.findUnique.mockResolvedValue(utilisateur())

    const gain = await donnerPieces("u1")

    expect(gain).toBe(1)
    const appel = prisma.user.update.mock.calls[0][0]
    expect(appel.where).toEqual({ id: "u1" })
    expect(appel.data.coins).toEqual({ increment: 1 })
    expect(appel.data.coinsEarnedToday).toBe(1)
  })

  it("ne donne rien quand la limite du jour est atteinte", async () => {
    const aujourdhui = new Date().toISOString().slice(0, 10)
    prisma.user.findUnique.mockResolvedValue(
      utilisateur({ coinsEarnedToday: 200, coinsDay: aujourdhui }),
    )

    const gain = await donnerPieces("u1")

    expect(gain).toBe(0)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })
})
