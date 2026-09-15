import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignOutButton } from "./sign-out-button"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/auth/connexion")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-4">
      <p className="text-3xl font-bold font-sans">Bonjour {session.user.name}</p>
      <p className="text-muted-foreground">{session.user.email}</p>
      <Link
        href="/discussion"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Ouvrir la messagerie
      </Link>
      <SignOutButton />
    </div>
  )
}
