import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { ResetPasswordForm } from "./reset-password-form"

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <Card className="w-full max-w-md rounded-[var(--radius)]">
        <CardHeader className="flex flex-col items-center pt-8">
          <Logo href="/" full className="mb-6" />
          <CardTitle className="text-2xl">Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Choisissez un nouveau mot de passe pour votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
