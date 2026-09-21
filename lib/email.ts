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
          <p class="content-title">Bienvenue sur Helix ! 🎉</p>
          <p>Merci de vous être inscrit. Pour activer votre compte, vérifiez votre adresse email en cliquant sur le bouton ci-dessous.</p>
          <center>
            <a href="${url}" class="button">Vérifier mon adresse email</a>
          </center>
          <hr class="divider-line">
          <p style="font-size: 13px; color: #6b7280; margin: 16px 0;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <div class="code-box">${url}</div>
          <div class="info-box">
            <p>💡 Ce lien expire dans 24 heures. Après expiration, vous devrez demander un nouveau lien de vérification.</p>
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
          <p class="content-title">Réinitialiser votre mot de passe 🔐</p>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.</p>
          <center>
            <a href="${url}" class="button">Réinitialiser mon mot de passe</a>
          </center>
          <hr class="divider-line">
          <p style="font-size: 13px; color: #6b7280; margin: 16px 0;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <div class="code-box">${url}</div>
          <div class="warning">
            <p>⏱️ <strong>Lien expirant</strong></p>
            <p>Ce lien est valide pendant 24 heures. Après, vous devrez demander une nouvelle réinitialisation.</p>
          </div>
          <div class="info-box">
            <p>🔒 Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe restera inchangé.</p>
          </div>
          <p style="font-size: 13px; color: #6b7280; margin-top: 24px;"><strong>Note de sécurité :</strong> Nous ne vous demanderons jamais votre mot de passe par email.</p>
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
}
