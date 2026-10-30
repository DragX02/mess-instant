"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/lib/error-messages"
import { EMPTY_PASSWORD_STRENGTH, validatePasswordStrength } from "@/lib/password-validator"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { PasswordInput, PasswordStrengthMeter } from "@/components/auth"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(EMPTY_PASSWORD_STRENGTH)

  function handlePasswordChange(value: string) {
    setNewPassword(value)
    setPasswordStrength(validatePasswordStrength(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("Lien invalide ou expiré. Redemandez une réinitialisation.")
      return
    }

    if (!passwordStrength.isValid) {
      setError("Le mot de passe n'est pas assez fort. Veuillez respecter les critères.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    const { error: resetError } = await authClient.resetPassword({ newPassword, token })

    setLoading(false)

    if (resetError) {
      setError(translateError(resetError.message))
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/auth/connexion"), 2000)
  }

  if (!token) {
    return (
      <Alert>
        Ce lien de réinitialisation est invalide ou a expiré.{" "}
        <Link href="/auth/mot-de-passe-oublie" className="underline">
          Redemander un lien
        </Link>
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert variant="info">
        Votre mot de passe a été réinitialisé. Redirection vers la connexion...
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nouveau mot de passe" htmlFor="new-password" className="gap-2">
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => handlePasswordChange(event.target.value)}
        />
        <PasswordStrengthMeter strength={passwordStrength} />
      </Field>

      <Field label="Confirmer le mot de passe" htmlFor="confirm-password">
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </Field>

      {error && <Alert>{error}</Alert>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  )
}
