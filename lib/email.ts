import { Resend } from "resend"
import { render } from "@react-email/components"
import { VerificationEmail } from "@/emails/verification-email"
import { ResetPasswordEmail } from "@/emails/reset-password-email"

let resend: Resend | undefined

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

function hasResendKey() {
  return Boolean(process.env.RESEND_API_KEY)
}

export async function sendVerificationEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de vérification pour ${to} : ${url}`)
    return
  }

  const emailHtml = await render(VerificationEmail({ verificationUrl: url }))

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Vérifiez votre adresse email - Helix",
    html: emailHtml,
  })

  if (error) {
    console.error("[resend] Erreur envoi vérification:", error)
    throw new Error(error.message)
  }
}

export async function sendResetPasswordEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de réinitialisation pour ${to} : ${url}`)
    return
  }

  const emailHtml = await render(ResetPasswordEmail({ resetUrl: url }))

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Réinitialiser votre mot de passe - Helix",
    html: emailHtml,
  })

  if (error) {
    console.error("[resend] Erreur envoi réinitialisation:", error)
    throw new Error(error.message)
  }
}
