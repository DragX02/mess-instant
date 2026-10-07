"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/lib/error-messages"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, GoogleButton, PasswordInput } from "@/components/auth"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/discussion",
      })

      if (signInError) {
        setError(translateError(signInError.message))
        return
      }

      router.push("/discussion")
    } catch {
      setError("Problème de connexion réseau. Vérifiez votre connexion et réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Connexion" description="Connectez-vous à votre espace d'équipe.">
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="/auth/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        <GoogleButton loadingLabel="Connexion..." />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/auth/inscription" className="text-primary hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </AuthCard>
  )
}
