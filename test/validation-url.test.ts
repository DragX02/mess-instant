import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { idValide, nomFichierValide, verifierUrl } from "@/lib/validation-url"

const BASE = "http://localhost:3000"
const rejet = (chemin: string) => verifierUrl(new URL(chemin, BASE))

const ATTAQUES = [
  // SQL classique
  "/api/conversations/' OR '1'='1/messages",
  "/api/conversations/1' OR 1=1--/messages",
  "/api/conversations/x'; DROP TABLE user;--/messages",
  "/api/conversations/1 UNION SELECT email,password FROM user/messages",
  "/api/amis?email=a' UNION ALL SELECT null,null--",
  "/api/amis?email=' OR 1=1 --",
  "/api/serveurs?q=1; SELECT pg_sleep(10)",
  "/api/serveurs?q=1 AND 1=1",
  "/api/serveurs?q=1 or 2=2",
  "/api/serveurs?q=SELECT password FROM account",
  "/api/serveurs?q=INSERT INTO user VALUES(1)",
  "/api/serveurs?q=DELETE FROM message",
  "/api/serveurs?q=1;UPDATE user SET isAdmin=true",
  "/api/serveurs?q=information_schema.tables",
  "/api/serveurs?q=1 AND SLEEP(5)",
  "/api/serveurs?q=1/**/OR/**/1=1",
  // encodage et double encodage
  "/api/conversations/%27%20OR%201%3D1--/messages",
  "/api/conversations/%2527%2520OR%25201%253D1/messages",
  "/api/amis?email=%27%3B%20DROP%20TABLE%20user%3B--",
  "/api/amis?email=1%20UNION%20SELECT%20password%20FROM%20account",
  "/api/amis?email=%E0%A4%A",
  // XSS
  "/auth/error?error=<script>alert(1)</script>",
  "/auth/error?error=%3Cscript%3Ealert(1)%3C%2Fscript%3E",
  "/auth/error?error=javascript:alert(1)",
  '/auth/error?error="onmouseover="alert(1)',
  "/auth/error?error=<img src=x onerror=alert(1)>",
  // traversée de chemin
  "/api/fichiers/../../.env",
  "/api/fichiers/%2e%2e/%2e%2e/.env",
  "/api/fichiers/..%2f..%2f.env",
  "/api/fichiers/%252e%252e%252f.env",
  // octet nul, injection de commande / template
  "/api/fichiers/a%00.png",
  "/api/amis?x=${7*7}",
  "/api/amis?x={{7*7}}",
  "/api/amis?x=`id`",
  "/api/amis?x=a%5Cb",
  // longueur
  "/api/amis?x=" + "a".repeat(3000),
]

const LEGITIMES = [
  "/",
  "/discussion",
  "/profil",
  "/auth/connexion",
  "/auth/inscription",
  "/auth/error?error=access_denied",
  "/auth/reinitialiser-mot-de-passe?token=AbC123-_xyz.987",
  "/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImEifQ.sig-nature_ok&callbackURL=%2Fdiscussion",
  "/api/auth/callback/google?code=4%2F0AVMBsJh_xyz-abc&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent&state=Zm9v-_YmFy",
  "/api/conversations",
  "/api/conversations/general/messages",
  "/api/conversations/cmabc123def456ghi789jkl012/messages",
  "/api/messages/cmabc123def456ghi789jkl012/reactions",
  "/api/serveurs/rejoindre",
  "/api/fichiers/0f8fad5b-d9cb-469f-a165-70867728950e.png",
  "/api/evenements",
  "/email/icon-lock.png",
  "/site.webmanifest",
  "/discussion/?_rsc=1abcd",
  "/.well-known/security.txt",
]

describe("verifierUrl : attaques bloquées", () => {
  it.each(ATTAQUES)("rejette %s", (chemin) => {
    expect(rejet(chemin)).not.toBeNull()
  })
})

describe("verifierUrl : URL légitimes acceptées", () => {
  it.each(LEGITIMES)("accepte %s", (chemin) => {
    expect(rejet(chemin)).toBeNull()
  })
})

describe("validateurs d'identifiants", () => {
  it("idValide accepte cuid et ids fixes", () => {
    expect(idValide("cmabc123def456ghi789jkl012")).toBe(true)
    expect(idValide("general")).toBe(true)
    expect(idValide("helix")).toBe(true)
  })

  it("idValide rejette le reste", () => {
    const interdits = ["", "a b", "a'b", "a;b", "../x", "a/b", "<x>", "a".repeat(65), null, 12]

    for (const valeur of interdits) {
      expect(idValide(valeur)).toBe(false)
    }
  })

  it("nomFichierValide n'accepte que UUID + extension", () => {
    const uuid = "0f8fad5b-d9cb-469f-a165-70867728950e"

    expect(nomFichierValide(uuid + ".png")).toBe(true)
    expect(nomFichierValide(uuid)).toBe(true)

    for (const valeur of ["..", ".env", "a.png", "../x", uuid + "/../x"]) {
      expect(nomFichierValide(valeur)).toBe(false)
    }
  })
})

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: mocks.getSession } } }))

describe("proxy : rejet avant toute lecture de session", () => {
  beforeEach(() => {
    mocks.getSession.mockReset()
    mocks.getSession.mockResolvedValue(null)
  })

  it("répond 400 sans appeler la session pour une URL piégée", async () => {
    const { proxy } = await import("@/proxy")
    const requete = new NextRequest(BASE + "/api/conversations/%27%20OR%201%3D1--/messages")
    const reponse = await proxy(requete)

    expect(reponse.status).toBe(400)
    expect(mocks.getSession).not.toHaveBeenCalled()
  })

  it("laisse passer une API sans lire la session", async () => {
    const { proxy } = await import("@/proxy")
    const reponse = await proxy(new NextRequest(BASE + "/api/conversations"))

    expect(reponse.status).toBe(200)
    expect(mocks.getSession).not.toHaveBeenCalled()
  })

  it("redirige /discussion vers la connexion sans session", async () => {
    const { proxy } = await import("@/proxy")
    const reponse = await proxy(new NextRequest(BASE + "/discussion"))

    expect(reponse.status).toBe(307)
    expect(reponse.headers.get("location")).toContain("/auth/connexion")
  })
})
