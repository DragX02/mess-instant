// Envoie les 4 emails transactionnels de test à une adresse.
// Usage : node --env-file=.env scripts/send-test-emails.mjs <adresse>
import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { Resend } from "resend"

const to = process.argv[2]
if (!to) throw new Error("Adresse destinataire manquante")
if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY manquante")

const root = process.cwd()
const tmp = join(root, ".email-preview")
const bundle = join(tmp, ".send-bundle.mjs")
mkdirSync(tmp, { recursive: true })

await build({
  stdin: { contents: `export * from "@/emails/templates"`, resolveDir: root, loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  tsconfig: join(root, "tsconfig.json"),
  jsx: "automatic",
  outfile: bundle,
  logLevel: "error",
})

const React = (await import("react")).default
const { render } = await import("@react-email/components")
const t = await import(pathToFileURL(bundle).href)

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"

// Avant déploiement, les images distantes n'existent pas encore : on les joint en images CID
const BASE = "https://chat.olbrechts.cloud"
const assets = [
  { url: `${BASE}/api/logo`, file: join(root, "public", "logo-full.png"), cid: "helix-logo" },
  ...readdirSync(join(root, "public", "email")).map((name) => ({
    url: `${BASE}/email/${name}`,
    file: join(root, "public", "email", name),
    cid: name.replace(".png", ""),
  })),
]
const attachments = assets.map((a) => ({
  filename: a.cid + ".png",
  content: readFileSync(a.file),
  contentId: a.cid,
}))

const emails = [
  ["Réinitialiser votre mot de passe - Helix", t.ResetPasswordEmailDark],
  ["Vérifiez votre adresse email - Helix", t.VerificationEmailDark],
  ["Changement de votre mot de passe - Helix", t.PasswordChangeEmailDark],
  ["Modification de votre nom - Helix", t.ProfileUpdateEmailDark],
]

for (const [subject, Template] of emails) {
  let html = await render(React.createElement(Template, Template.PreviewProps))
  for (const a of assets) html = html.replaceAll(a.url, `cid:${a.cid}`)
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `[TEST] ${subject}`,
    html,
    attachments,
  })
  console.log(error ? `ECHEC ${subject}: ${error.message}` : `OK ${subject} (${data.id})`)
}

rmSync(bundle)
