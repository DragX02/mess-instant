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

  if (newName.length > 50) {
    throw new Error("Le nom doit faire moins de 50 caractères")
  }

  // Import Prisma for database update
  const { prisma } = await import("@/lib/prisma")

  // Update user in database
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: newName.trim() },
  })

  // Send confirmation email (non-blocking)
  try {
    const emailHtml = await render(
      ProfileUpdateEmail({
        newName,
      }),
    )

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Modification de votre nom - Helix",
      html: emailHtml,
    })

    if (error) {
      console.error("[resend] Erreur envoi update profil:", error)
    }
  } catch (emailError) {
    console.error("Erreur lors de l'envoi du mail update profil:", emailError)
  }

  revalidatePath("/profil")
  return { success: true, message: "Profil mis à jour" }
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

  // Send confirmation email (non-blocking)
  try {
    const emailHtml = await render(PasswordChangeEmail())

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Changement de votre mot de passe - Helix",
      html: emailHtml,
    })

    if (error) {
      console.error("[resend] Erreur envoi change password:", error)
    }
  } catch (emailError) {
    console.error("Erreur lors de l'envoi du mail change password:", emailError)
  }

  revalidatePath("/profil")
  return { success: true, message: "Mot de passe changé" }
}
