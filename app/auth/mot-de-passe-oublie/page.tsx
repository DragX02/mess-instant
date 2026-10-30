"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/lib/error-messages"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthCard } from "@/components/auth"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: requestError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/auth/reinitialiser-mot-de-passe",
    })

    setLoading(false)

    if (requestError) {
      setError(translateError(requestError.message))
      return
    }

    setSent(true)
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      description="Indiquez votre email, nous vous envoyons un lien de réinitialisation."
    >
      {sent ? (
        <Alert variant="info">
          Si un compte existe pour <span className="text-foreground font-medium">{email}</span>, un
          email contenant un lien de réinitialisation vient de lui être envoyé.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {error && <Alert>{error}</Alert>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/auth/connexion" className="text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  )
}
