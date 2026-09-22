"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { PasswordInput, PasswordStrengthMeter } from "@/components/auth"
import { validatePasswordStrength, type PasswordStrength } from "@/lib/password-validator"
import { translateError } from "@/lib/error-messages"

export default function InscriptionPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    level: "weak",
    feedback: [],
    isValid: false,
  })

  const handlePasswordChange = (value: string) => {
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

    // Vérification d'email désactivée pour l'instant (voir lib/auth.ts) : signUp.email ouvre directement une session.
    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(translateError(signUpError.message))
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <Card className="w-full max-w-md rounded-[var(--radius)]">
        <CardHeader className="flex flex-col items-center pt-8">
          <Logo href="/" full className="mb-6" />
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Rejoignez votre équipe sur Helix en quelques secondes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Votre nom"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@entreprise.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
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
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
