import { describe, it, expect, vi, beforeEach } from "vitest"

const prisma = vi.hoisted(() => ({
  conversation: { findUnique: vi.fn(), delete: vi.fn(), update: vi.fn() },
  message: { findUnique: vi.fn(), findFirst: vi.fn(), delete: vi.fn() },
  friendship: { findUnique: vi.fn(), delete: vi.fn(), update: vi.fn() },
  server: { delete: vi.fn() },
  membership: { findUnique: vi.fn(), findMany: vi.fn() },
  serverMember: { findUnique: vi.fn(), findMany: vi.fn(), delete: vi.fn() },
}))

vi.mock("@/lib/prisma", () => ({ prisma }))
vi.mock("@/lib/chat", async (original) => ({
  ...(await original<typeof import("@/lib/chat")>()),
  getCurrentUser: vi.fn(async () => ({ id: "u1", isAdmin: true })),
}))

const IDS_PIEGES = ["' OR '1'='1", "1; DROP TABLE user", "../../etc/passwd", "<script>", "a b"]

type Contexte = { params: Promise<{ id: string }> }

function ctx(id: string): Contexte {
  return { params: Promise.resolve({ id }) }
}

const requete = new Request("http://localhost:3000/x", { method: "POST", body: "{}" })

type Gestionnaire = (request: Request, ctx: Contexte) => Promise<Response>

const cas: [string, () => Promise<Record<string, Gestionnaire>>, string][] = [
  ["amis/[id]", () => import("@/app/api/amis/[id]/route"), "PATCH"],
  ["amis/[id]", () => import("@/app/api/amis/[id]/route"), "DELETE"],
  ["conversations/[id]", () => import("@/app/api/conversations/[id]/route"), "PATCH"],
  ["conversations/[id]", () => import("@/app/api/conversations/[id]/route"), "DELETE"],
  ["conversations/[id]/membres", () => import("@/app/api/conversations/[id]/membres/route"), "GET"],
  [
    "conversations/[id]/membres",
    () => import("@/app/api/conversations/[id]/membres/route"),
    "POST",
  ],
  [
    "conversations/[id]/messages",
    () => import("@/app/api/conversations/[id]/messages/route"),
    "GET",
  ],
  [
    "conversations/[id]/messages",
    () => import("@/app/api/conversations/[id]/messages/route"),
    "POST",
  ],
  ["messages/[id]", () => import("@/app/api/messages/[id]/route"), "DELETE"],
  ["messages/[id]/reactions", () => import("@/app/api/messages/[id]/reactions/route"), "POST"],
  ["serveurs/[id]", () => import("@/app/api/serveurs/[id]/route"), "DELETE"],
  ["serveurs/[id]/membres", () => import("@/app/api/serveurs/[id]/membres/route"), "GET"],
]

describe("Routes [id] : un identifiant mal formé n'atteint jamais la base", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  for (const [nom, charger, methode] of cas) {
    it(`${methode} ${nom}`, async () => {
      const route = await charger()

      for (const id of IDS_PIEGES) {
        const reponse = await route[methode](requete, ctx(id))
        expect(reponse.status).toBe(404)
      }

      for (const modele of Object.values(prisma)) {
        for (const fonction of Object.values(modele)) {
          expect(fonction).not.toHaveBeenCalled()
        }
      }
    })
  }

  it("GET fichiers/[nom] rejette un nom piégé sans toucher la base", async () => {
    const { GET } = await import("@/app/api/fichiers/[nom]/route")

    for (const nom of ["..", ".env", "../../.env", "a'b", "x.png; DROP"]) {
      const reponse = await GET(new Request("http://localhost:3000/x"), {
        params: Promise.resolve({ nom }),
      })
      expect(reponse.status).toBe(404)
    }

    expect(prisma.message.findFirst).not.toHaveBeenCalled()
  })
})
