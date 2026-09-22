"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput, PasswordStrengthMeter } from "@/components/auth"
import { validatePasswordStrength, type PasswordStrength } from "@/lib/password-validator"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    level: "weak",
    feedback: [],
    isValid: false,
  })

  const handlePasswordChange = (value: string) => {
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

    const { error: resetError } = await authClient.resetPassword({
      newPassword,
      token,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message ?? "Une erreur est survenue.")
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/auth/connexion"), 2000)
  }

  if (!token) {
    return (
      <p
        role="alert"
        className="rounded-[var(--radius)] border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        Ce lien de réinitialisation est invalide ou a expiré.{" "}
        <Link href="/auth/mot-de-passe-oublie" className="underline">
          Redemander un lien
        </Link>
      </p>
    )
  }

  if (success) {
    return (
      <p className="rounded-[var(--radius)] border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
        Votre mot de passe a été réinitialisé. Redirection vers la connexion...
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">Nouveau mot de passe</Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => handlePasswordChange(event.target.value)}
        />
        <PasswordStrengthMeter strength={passwordStrength} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[var(--radius)] border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  )
}
