import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { verifierUrl } from "@/lib/validation-url"

const AUTH_PAGES = [
  "/auth/connexion",
  "/auth/inscription",
  "/auth/mot-de-passe-oublie",
  "/auth/reinitialiser-mot-de-passe",
]

export async function proxy(request: NextRequest) {
  // Première barrière, avant toute lecture de session ou de base de données.
  const rejet = verifierUrl(new URL(request.url))

  if (rejet) {
    console.warn(
      "[url-guard] requête rejetée (" + rejet + ") :",
      request.method,
      request.nextUrl.pathname,
    )
    return new NextResponse("Requête invalide", { status: 400 })
  }

  const { pathname } = request.nextUrl

  if (
    !pathname.startsWith("/discussion") &&
    !pathname.startsWith("/profil") &&
    !AUTH_PAGES.some((page) => pathname.startsWith(page))
  ) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: await headers() })

  if (pathname.startsWith("/discussion") || pathname.startsWith("/profil")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/connexion", request.url))
    }
    return NextResponse.next()
  }

  if (session && AUTH_PAGES.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL("/discussion", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Toutes les requêtes (pages, API, fichiers) sauf les assets internes de Next.
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr).*)"],
}
