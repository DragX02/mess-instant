import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { ProfileForm } from "@/components/auth/profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/auth/connexion")
  }

  const user = session.user

  // Check if user has a password (not OAuth-only)
  const { prisma } = await import("@/lib/prisma")
  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      password: { not: null },
    },
  })

  const hasPassword = !!account

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main content */}
      <div className="flex-1 py-16 px-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/discussion"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">Mon Profil</h1>
            </div>
            <p className="text-muted-foreground">
              Gérez vos paramètres personnels et vos informations de compte
            </p>
          </div>

          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>Vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Nom</Label>
                    <p className="mt-2 font-medium">{user?.name || "Non défini"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Email</Label>
                    <p className="mt-2 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Membre depuis</Label>
                    <p className="mt-2 font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Statut</Label>
                    <p className="mt-2 font-medium">
                      {user?.emailVerified ? "Vérifié" : "Non vérifié"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form Component */}
            <ProfileForm user={user} hasPassword={hasPassword} />

            {/* Account Actions */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
                <CardDescription>Actions qui ne peuvent pas être annulées</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  action={async () => {
                    "use server"
                    await auth.api.signOut({ headers: await headers() })
                    redirect("/")
                  }}
                >
                  <Button variant="destructive" className="w-full" type="submit">
                    supprimer mon compte
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
