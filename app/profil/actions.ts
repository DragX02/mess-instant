"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { render } from "@react-email/components"
import { ProfileUpdateEmail } from "@/emails/profile-update"
import { PasswordChangeEmail } from "@/emails/password-change"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

export async function updateProfileName(newName: string) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error("Non authentifié")
  }

  if (!newName.trim()) {
    throw new Error("Le nom ne peut pas être vide")
  }

  // Import Prisma for database update
  const { prisma } = await import("@/lib/prisma")

  try {
    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: newName },
    })

    // Send confirmation email
    const emailHtml = await render(
      ProfileUpdateEmail({
        newName,
      }),
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Modification de votre nom - Helix",
      html: emailHtml,
    })

    revalidatePath("/profil")
    return { success: true, message: "Profil mis à jour" }
  } catch {
    throw new Error("Erreur lors de l'envoi de l'email")
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error("Non authentifié")
  }

  if (!currentPassword) {
    throw new Error("Le mot de passe actuel est requis")
  }

  if (!newPassword || !confirmPassword) {
    throw new Error("Tous les champs sont requis")
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas")
  }

  if (newPassword.length < 8) {
    throw new Error("Le nouveau mot de passe doit avoir au moins 8 caractères")
  }

  if (currentPassword === newPassword) {
    throw new Error("Le nouveau mot de passe doit être différent de l'actuel")
  }

  try {
    // Call API route to change password
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: (await headers()).get("cookie") || "",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erreur lors du changement de mot de passe")
    }

    // Send confirmation email
    const emailHtml = await render(PasswordChangeEmail())

    await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Changement de votre mot de passe - Helix",
      html: emailHtml,
    })

    revalidatePath("/profil")
    return { success: true, message: "Mot de passe changé" }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur lors du changement de mot de passe"
    console.error("Erreur lors du changement de mot de passe:", error)
    throw new Error(errorMessage)
  }
}
