"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

const emailStyles = `
  * { margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #e8ebed; }
  .wrapper { padding: 24px; }
  .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04); overflow: hidden; }
  .container { max-width: 600px; margin: 0 auto; background-color: white; }
  .header { background: linear-gradient(135deg, #df6035 0%, #e05d38 100%); color: white; padding: 60px 40px; text-align: center; }
  .header-content { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .header h1 { margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; }
  .header-subtitle { font-size: 14px; opacity: 0.95; font-weight: 400; }
  .content { padding: 48px 40px; background-color: #ffffff; }
  .content-title { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #2f4b79; }
  .content p { margin: 16px 0; font-size: 15px; line-height: 1.7; color: #555555; }
  .content strong { color: #2f4b79; font-weight: 600; }
  .button { display: inline-block; background-color: #df6035; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 28px 0; font-size: 15px; cursor: pointer; box-shadow: 0 1px 3px rgba(223, 96, 53, 0.3); }
  .button:hover { background-color: #c94d2b; text-decoration: none; }
  .button-text { display: inline; }
  .divider-line { border: none; border-top: 1px solid #d6e4f0; margin: 28px 0; height: 0; }
  .code-box { background-color: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #d6e4f0; word-break: break-all; font-family: "Courier New", monospace; font-size: 12px; color: #6b7280; line-height: 1.5; }
  .info-box { background-color: #d6e4f0; border-left: 4px solid #2f4b79; padding: 20px; border-radius: 6px; margin: 24px 0; }
  .info-box p { margin: 0; color: #2f4b79; font-size: 14px; font-weight: 500; }
  .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 6px; margin: 24px 0; }
  .warning p { margin: 0; color: #92400e; font-size: 14px; font-weight: 500; }
  .success { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 20px; border-radius: 6px; margin: 24px 0; }
  .success p { margin: 0; color: #166534; font-size: 14px; font-weight: 500; }
  .footer { background-color: #f9fafb; padding: 40px; text-align: center; border-top: 1px solid #d6e4f0; }
  .footer-logo { font-size: 18px; font-weight: 700; color: #df6035; margin-bottom: 12px; }
  .footer p { margin: 6px 0; font-size: 13px; color: #6b7280; }
  .footer a { color: #2f4b79; text-decoration: none; font-weight: 500; }
  .footer a:hover { text-decoration: underline; }
  .spacer { height: 24px; }
`

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
    await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Modification de votre nom - Helix",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${emailStyles}</style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <div class="header-content">
            <h1>Helix</h1>
            <p class="header-subtitle">Messagerie temps réel B2B</p>
          </div>
        </div>
        <div class="content">
          <p class="content-title">Profil mis à jour ✅</p>
          <p>Votre nom d'utilisateur a été modifié avec succès.</p>
          <div class="success">
            <p><strong>Nouveau nom :</strong> ${newName}</p>
          </div>
          <div class="info-box">
            <p>💡 Si vous n'avez pas effectué cette modification, veuillez contacter notre équipe de support immédiatement.</p>
          </div>
        </div>
        <div class="footer">
          <div class="footer-logo">Helix</div>
          <p>© 2026 Helix. Tous droits réservés.</p>
          <p><a href="mailto:hello@helix.app">hello@helix.app</a></p>
        </div>
      </div>
    </div>
  </body>
</html>`,
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
    await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: "Changement de votre mot de passe - Helix",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${emailStyles}</style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <div class="header-content">
            <h1>Helix</h1>
            <p class="header-subtitle">Messagerie temps réel B2B</p>
          </div>
        </div>
        <div class="content">
          <p class="content-title">Mot de passe modifié 🔐</p>
          <p>Votre mot de passe a été changé avec succès.</p>
          <div class="success">
            <p>Votre compte est maintenant sécurisé avec votre nouveau mot de passe.</p>
          </div>
          <div class="warning">
            <p>⚠️ <strong>Attention</strong></p>
            <p>Si vous n'avez pas effectué ce changement, veuillez contacter notre équipe de support immédiatement.</p>
          </div>
          <div class="info-box">
            <p>🔒 Nous ne vous demanderons jamais votre mot de passe par email.</p>
          </div>
        </div>
        <div class="footer">
          <div class="footer-logo">Helix</div>
          <p>© 2026 Helix. Tous droits réservés.</p>
          <p><a href="mailto:hello@helix.app">hello@helix.app</a></p>
        </div>
      </div>
    </div>
  </body>
</html>`,
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
