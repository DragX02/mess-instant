import { Suspense } from "react"
import { AuthCard } from "@/components/auth"
import { ResetPasswordForm } from "./reset-password-form"

export default function ReinitialiserMotDePassePage() {
  return (
    <AuthCard
      title="Réinitialiser le mot de passe"
      description="Choisissez un nouveau mot de passe pour votre compte."
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  )
}
