import { render } from "@react-email/render"
import { Resend } from "resend"
import { VerificationEmail } from "@/emails/verification-email"
import { ResetPasswordEmail } from "@/emails/reset-password-email"
import { PasswordChangeEmail } from "@/emails/password-change"
import { ProfileUpdateEmail } from "@/emails/profile-update"

export async function GET() {
  // Route de test dev seulement
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Route non disponible en production" }, { status: 403 })
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "RESEND_API_KEY manquante" }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
  const testEmail = "warse@live.fr"

  try {
    const results = []

    // Test Verification Email
    const verificationHtml = await render(
      VerificationEmail({
        verificationUrl: "http://localhost:3000/verify?token=test123",
      }),
    )
    const { error: verificationError, data: verificationData } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "✅ Test - Email de vérification",
      html: verificationHtml,
    })
    results.push({
      type: "verification",
      success: !verificationError,
      data: verificationData,
      error: verificationError?.message,
    })

    // Test Reset Password Email
    const resetHtml = await render(
      ResetPasswordEmail({
        resetUrl: "http://localhost:3000/reset?token=test456",
      }),
    )
    const { error: resetError, data: resetData } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "🔐 Test - Réinitialiser votre mot de passe",
      html: resetHtml,
    })
    results.push({
      type: "reset-password",
      success: !resetError,
      data: resetData,
      error: resetError?.message,
    })

    // Test Password Change Email
    const passwordChangeHtml = await render(PasswordChangeEmail({}))
    const { error: passwordError, data: passwordData } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "🔑 Test - Mot de passe modifié",
      html: passwordChangeHtml,
    })
    results.push({
      type: "password-change",
      success: !passwordError,
      data: passwordData,
      error: passwordError?.message,
    })

    // Test Profile Update Email
    const profileHtml = await render(ProfileUpdateEmail({ newName: "Adrien Test" }))
    const { error: profileError, data: profileData } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "👤 Test - Profil mis à jour",
      html: profileHtml,
    })
    results.push({
      type: "profile-update",
      success: !profileError,
      data: profileData,
      error: profileError?.message,
    })

    const allSuccess = results.every((r) => r.success)
    return Response.json({ success: allSuccess, results })
  } catch (error) {
    console.error("Test email error:", error)
    return Response.json({ error: String(error), success: false }, { status: 500 })
  }
}
