import { Resend } from "resend"

let resend: Resend | undefined

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

function hasResendKey() {
  return Boolean(process.env.RESEND_API_KEY)
}

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #df6035 0%, #e05d38 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
  .content { background-color: #f9fafb; padding: 40px 30px; }
  .content p { margin: 16px 0; }
  .button { display: inline-block; background-color: #df6035; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 24px 0; }
  .button:hover { background-color: #e05d38; }
  .code-box { background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-all; font-family: "Courier New", monospace; font-size: 13px; color: #6b7280; }
  .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 24px 0; }
  .warning p { margin: 0; color: #92400e; font-size: 14px; }
  .footer { background-color: #f3f4f6; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
  .footer p { margin: 8px 0; }
  .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
`

export async function sendVerificationEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de vérification pour ${to} : ${url}`)
    return
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Vérifiez votre adresse email - Helix",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>${emailStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Helix</h1>
      </div>
      <div class="content">
        <p>Bienvenue sur <strong>Helix</strong> ! 🎉</p>
        <p>Merci de vous être inscrit. Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>
        <a href="${url}" class="button">Vérifier mon adresse email</a>
        <p style="color: #6b7280; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
        <div class="code-box">${url}</div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">Ce lien expire dans 24 heures.</p>
      </div>
      <div class="footer">
        <p><strong>Helix</strong> - Messagerie temps réel B2B</p>
        <p>© 2026 Helix. Tous droits réservés.</p>
        <p><a href="mailto:hello@helix.app" style="color: #0ea5e9; text-decoration: none;">hello@helix.app</a></p>
      </div>
    </div>
  </body>
</html>`,
  })
}

export async function sendResetPasswordEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de réinitialisation pour ${to} : ${url}`)
    return
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Réinitialiser votre mot de passe - Helix",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>${emailStyles}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Helix</h1>
      </div>
      <div class="content">
        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.</p>
        <a href="${url}" class="button">Réinitialiser mon mot de passe</a>
        <p style="color: #6b7280; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
        <div class="code-box">${url}</div>
        <div class="warning">
          <p><strong>⚠️ Lien d'expiration limitée</strong></p>
          <p>Ce lien est valide pendant 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</p>
        </div>
        <p style="color: #6b7280; font-size: 13px;">Par sécurité, nous ne demanderons jamais votre mot de passe par email.</p>
      </div>
      <div class="footer">
        <p><strong>Helix</strong> - Messagerie temps réel B2B</p>
        <p>© 2026 Helix. Tous droits réservés.</p>
        <p><a href="mailto:hello@helix.app" style="color: #0ea5e9; text-decoration: none;">hello@helix.app</a></p>
      </div>
    </div>
  </body>
</html>`,
  })
}
