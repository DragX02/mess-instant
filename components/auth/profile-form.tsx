"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { updateProfileName, changePassword } from "@/app/profil/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"

interface User {
  name?: string | null
  email: string
  id: string
}

export function ProfileForm({ user, hasPassword = true }: { user: User; hasPassword?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [nameEdit, setNameEdit] = useState(user?.name || "")
  const [newName, setNewName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handle name update
  async function handleUpdateName() {
    if (!newName.trim()) {
      setMessage({ type: "error", text: "Le nom ne peut pas être vide" })
      return
    }

    setLoading(true)
    try {
      await updateProfileName(newName)
      setMessage({ type: "success", text: "Nom mis à jour" })
      setNameEdit(newName)
      setNewName("")
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de la mise à jour du nom"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Tous les champs sont requis" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" })
      return
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Le nouveau mot de passe doit avoir au moins 8 caractères",
      })
      return
    }

    setLoading(true)
    try {
      await changePassword(currentPassword, newPassword, confirmPassword)
      setMessage({ type: "success", text: "Mot de passe changé" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors du changement de mot de passe"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {message && (
        <Alert
          className={`mb-6 p-4 ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
        >
          {message.text}
        </Alert>
      )}

      {/* Update Name Card */}
      <Card>
        <CardHeader>
          <CardTitle>Nom d&apos;utilisateur</CardTitle>
          <CardDescription>Modifiez votre nom d&apos;utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-name">Nom actuel</Label>
            <Input id="current-name" value={nameEdit} disabled className="mt-2" />
          </div>
          <div>
            <Label htmlFor="new-name">Nouveau nom</Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Entrez votre nouveau nom"
              className="mt-2"
            />
          </div>
          <Button onClick={handleUpdateName} disabled={loading} className="w-full">
            {loading ? "Mise à jour..." : "Mettre à jour le nom"}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      {hasPassword ? (
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Modifiez votre mot de passe</CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleChangePassword()
            }}
          >
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <div className="relative mt-2">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mot de passe actuel"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Mise à jour..." : "Changer le mot de passe"}
              </Button>
            </CardContent>
          </form>
        </Card>
      ) : (
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-amber-600">Sécurité</CardTitle>
            <CardDescription>Mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Votre compte a été créé avec Google. Vous ne pouvez pas modifier votre mot de passe,
              car vous n&apos;en avez pas défini.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
