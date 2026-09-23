"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/lib/error-messages"
import { EMPTY_PASSWORD_STRENGTH, validatePasswordStrength } from "@/lib/password-validator"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthCard, GoogleButton, PasswordInput, PasswordStrengthMeter } from "@/components/auth"

export default function InscriptionPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(EMPTY_PASSWORD_STRENGTH)

  function handlePasswordChange(value: string) {
    setPassword(value)
    setPasswordStrength(validatePasswordStrength(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!passwordStrength.isValid) {
      setError("Le mot de passe n'est pas assez fort. Veuillez respecter les critères.")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    const { error: signUpError } = await authClient.signUp.email({ name, email, password })

    setLoading(false)

    if (signUpError) {
      setError(translateError(signUpError.message))
      return
    }

    router.push("/dashboard")
  }

  return (
    <AuthCard
      title="Créer un compte"
      description="Rejoignez votre équipe sur Helix en quelques secondes."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nom" htmlFor="name">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Votre nom"
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@entreprise.com"
          />
        </Field>

        <Field label="Mot de passe" htmlFor="password" className="gap-2">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
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
          {loading ? "Création du compte..." : "Créer mon compte"}
        </Button>

        <GoogleButton loadingLabel="Inscription..." />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/auth/connexion" className="text-primary hover:underline">
          Connectez-vous
        </Link>
      </p>
    </AuthCard>
  )
}
