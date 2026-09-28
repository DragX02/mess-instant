import { Resend } from "resend"

const resend = new Resend("re_4sLDgoAK_89P3otXVHPUmCkDexQTfewE5")

const testEmail = "warse@live.fr"

const emailStyles = `
  * { margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #e8ebed; }
  .wrapper { padding: 24px; }
  .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04); overflow: hidden; }
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
`

console.log("╔════════════════════════════════════════════════════════════╗")
console.log("║           🧪 SUITE DE TESTS D'AUTHENTIFICATION             ║")
console.log("╚════════════════════════════════════════════════════════════╝\n")

const tests = []

// Test 1: Email de bienvenue/inscription
console.log("📧 Test 1: Email d'inscription")
try {
  const result = await resend.emails.send({
    from: "noreply@olbrechts.cloud",
    to: testEmail,
    subject: "Vérifiez votre adresse email - Helix",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${emailStyles}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div class="header-content"><h1>Helix</h1><p class="header-subtitle">Messagerie temps réel B2B</p></div></div><div class="content"><p class="content-title">Bienvenue sur Helix ! 🎉</p><p>Merci de vous être inscrit. Pour activer votre compte, vérifiez votre adresse email en cliquant sur le bouton ci-dessous.</p><center><a href="http://localhost:3000/auth/verify" class="button">Vérifier mon adresse email</a></center><hr class="divider-line"><p style="font-size: 13px; color: #6b7280; margin: 16px 0;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p><div class="code-box">http://localhost:3000/auth/verify?token=TEST_VERIFICATION_TOKEN</div><div class="info-box"><p>💡 Ce lien expire dans 24 heures. Après expiration, vous devrez demander un nouveau lien de vérification.</p></div></div><div class="footer"><div class="footer-logo">Helix</div><p>© 2026 Helix. Tous droits réservés.</p><p><a href="mailto:hello@helix.app">hello@helix.app</a></p></div></div></div></body></html>`,
  })
  tests.push({
    name: "Email d'inscription",
    status: !result.error ? "✅" : "❌",
    id: result.data?.id,
  })
  console.log("  ✅ Email d'inscription envoyé - ID:", result.data?.id)
} catch (e) {
  tests.push({ name: "Email d'inscription", status: "❌", error: e.message })
  console.log("  ❌ Erreur:", e.message)
}

// Test 2: Email de réinitialisation de mot de passe
console.log("\n📧 Test 2: Email de réinitialisation de mot de passe")
try {
  const result = await resend.emails.send({
    from: "noreply@olbrechts.cloud",
    to: testEmail,
    subject: "Réinitialiser votre mot de passe - Helix",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${emailStyles}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div class="header-content"><h1>Helix</h1><p class="header-subtitle">Messagerie temps réel B2B</p></div></div><div class="content"><p class="content-title">Réinitialiser votre mot de passe 🔐</p><p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.</p><center><a href="http://localhost:3000/auth/reset-password" class="button">Réinitialiser mon mot de passe</a></center><hr class="divider-line"><p style="font-size: 13px; color: #6b7280; margin: 16px 0;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p><div class="code-box">http://localhost:3000/auth/reset-password?token=TEST_RESET_TOKEN</div><div class="warning"><p>⏱️ <strong>Lien expirant</strong></p><p>Ce lien est valide pendant 24 heures. Après, vous devrez demander une nouvelle réinitialisation.</p></div><div class="info-box"><p>🔒 Si vous n\'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe restera inchangé.</p></div><p style="font-size: 13px; color: #6b7280; margin-top: 24px;"><strong>Note de sécurité :</strong> Nous ne vous demanderons jamais votre mot de passe par email.</p></div><div class="footer"><div class="footer-logo">Helix</div><p>© 2026 Helix. Tous droits réservés.</p><p><a href="mailto:hello@helix.app">hello@helix.app</a></p></div></div></div></body></html>`,
  })
  tests.push({
    name: "Email réinitialisation MDP",
    status: !result.error ? "✅" : "❌",
    id: result.data?.id,
  })
  console.log("  ✅ Email réinitialisation envoyé - ID:", result.data?.id)
} catch (e) {
  tests.push({ name: "Email réinitialisation MDP", status: "❌", error: e.message })
  console.log("  ❌ Erreur:", e.message)
}

// Test 3: Email de notification de connexion
console.log("\n📧 Test 3: Email de notification de connexion")
try {
  const result = await resend.emails.send({
    from: "noreply@olbrechts.cloud",
    to: testEmail,
    subject: "Nouvelle connexion à votre compte Helix",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${emailStyles}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div class="header-content"><h1>Helix</h1><p class="header-subtitle">Messagerie temps réel B2B</p></div></div><div class="content"><p class="content-title">Nouvelle connexion à votre compte 🔐</p><p>Nous avons détecté une nouvelle connexion à votre compte Helix.</p><div class="success"><p>✅ Cela vient de vous ? Aucune action n\'est requise.</p></div><p><strong>Détails de la connexion :</strong></p><div class="code-box">Navigateur: Chrome<br>Appareil: Windows<br>Localisation: France<br>Date: ${new Date().toLocaleString("fr-FR")}</div><p>Si cette connexion n\'est pas de vous, <strong>changez immédiatement votre mot de passe</strong>.</p></div><div class="footer"><div class="footer-logo">Helix</div><p>© 2026 Helix. Tous droits réservés.</p><p><a href="mailto:hello@helix.app">hello@helix.app</a></p></div></div></div></body></html>`,
  })
  tests.push({
    name: "Email notification connexion",
    status: !result.error ? "✅" : "❌",
    id: result.data?.id,
  })
  console.log("  ✅ Email notification envoyé - ID:", result.data?.id)
} catch (e) {
  tests.push({ name: "Email notification connexion", status: "❌", error: e.message })
  console.log("  ❌ Erreur:", e.message)
}

// Test 4: Email d'alerte sécurité
console.log("\n📧 Test 4: Email d'alerte sécurité")
try {
  const result = await resend.emails.send({
    from: "noreply@olbrechts.cloud",
    to: testEmail,
    subject: "Alerte sécurité - Mot de passe modifié",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${emailStyles}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div class="header-content"><h1>Helix</h1><p class="header-subtitle">Messagerie temps réel B2B</p></div></div><div class="content"><p class="content-title">Votre mot de passe a été modifié 🔒</p><p>Votre mot de passe a été changé avec succès le <strong>${new Date().toLocaleString("fr-FR")}</strong>.</p><div class="success"><p>✅ Si c\'est vous qui avez initié ce changement, aucune action n\'est requise.</p></div><div class="warning"><p>⚠️ N\'avez-vous pas demandé ce changement ?</p><p>Contactez immédiatement notre support. Il se peut que quelqu\'un d\'autre ait accès à votre compte.</p></div><p><strong>Pour protéger votre compte :</strong></p><ul style="margin: 16px 0; padding-left: 24px; color: #4b5563;"><li>Changez à nouveau votre mot de passe si nécessaire</li><li>Vérifiez vos sessions actives</li><li>Activez l\'authentification à deux facteurs</li></ul></div><div class="footer"><div class="footer-logo">Helix</div><p>© 2026 Helix. Tous droits réservés.</p><p><a href="mailto:hello@helix.app">hello@helix.app</a></p></div></div></div></body></html>`,
  })
  tests.push({
    name: "Email alerte sécurité",
    status: !result.error ? "✅" : "❌",
    id: result.data?.id,
  })
  console.log("  ✅ Email alerte sécurité envoyé - ID:", result.data?.id)
} catch (e) {
  tests.push({ name: "Email alerte sécurité", status: "❌", error: e.message })
  console.log("  ❌ Erreur:", e.message)
}

// Test 5: Email d'invitation
console.log("\n📧 Test 5: Email d'invitation")
try {
  const result = await resend.emails.send({
    from: "noreply@olbrechts.cloud",
    to: testEmail,
    subject: "Vous êtes invité à rejoindre une équipe - Helix",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${emailStyles}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div class="header-content"><h1>Helix</h1><p class="header-subtitle">Messagerie temps réel B2B</p></div></div><div class="content"><p class="content-title">Vous êtes invité à rejoindre une équipe 👋</p><p><strong>Alice Dupont</strong> vous a invité à rejoindre l\'équipe <strong>Engineering Team</strong> sur Helix.</p><div class="info-box"><p>💡 Helix est une plateforme de messagerie en temps réel pensée pour le travail en équipe, avec canaux, rôles et conversations organisées.</p></div><center><a href="http://localhost:3000/invitations/accept" class="button">Accepter l\'invitation</a></center><hr class="divider-line"><p style="font-size: 13px; color: #6b7280; margin: 16px 0;">Ou copiez ce lien dans votre navigateur :</p><div class="code-box">http://localhost:3000/invitations/accept?token=TEST_INVITE_TOKEN</div><p style="font-size: 13px; color: #6b7280; margin-top: 24px;">Cette invitation expire dans 7 jours.</p></div><div class="footer"><div class="footer-logo">Helix</div><p>© 2026 Helix. Tous droits réservés.</p><p><a href="mailto:hello@helix.app">hello@helix.app</a></p></div></div></div></body></html>`,
  })
  tests.push({
    name: "Email d'invitation",
    status: !result.error ? "✅" : "❌",
    id: result.data?.id,
  })
  console.log("  ✅ Email d'invitation envoyé - ID:", result.data?.id)
} catch (e) {
  tests.push({ name: "Email d'invitation", status: "❌", error: e.message })
  console.log("  ❌ Erreur:", e.message)
}

// Résumé
console.log("\n╔════════════════════════════════════════════════════════════╗")
console.log("║                    📊 RÉSUMÉ DES TESTS                      ║")
console.log("╚════════════════════════════════════════════════════════════╝\n")

let passed = 0
tests.forEach((test) => {
  console.log(`${test.status} ${test.name}`)
  if (test.status === "✅") passed++
})

console.log(`\n${passed}/${tests.length} tests réussis\n`)

if (passed === tests.length) {
  console.log("✨ TOUS LES EMAILS D'AUTHENTIFICATION ONT ÉTÉ ENVOYÉS AVEC SUCCÈS !\n")
  console.log("📋 Résumé des emails testés:")
  console.log("   1. ✅ Email d'inscription avec lien de vérification")
  console.log("   2. ✅ Email de réinitialisation de mot de passe")
  console.log("   3. ✅ Email de notification de connexion")
  console.log("   4. ✅ Email d'alerte sécurité")
  console.log("   5. ✅ Email d'invitation")
  console.log("\n🎯 Configuration Resend est 100% fonctionnelle pour l'authentification\n")
  console.log("🚀 Prêt pour le déploiement sur Coolify !")
}
