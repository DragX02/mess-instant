// Génère un aperçu HTML de chaque email dans .email-preview/ (à ouvrir dans le navigateur).
// Usage : npm run email:preview
// Les images distantes (logo, icônes) sont remplacées par les fichiers locaux de public/.
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"

const root = process.cwd()
const outDir = join(root, ".email-preview")
const bundle = join(outDir, ".bundle.mjs")

mkdirSync(outDir, { recursive: true })

// Bundle les templates TSX (alias @/ géré via tsconfig), dépendances npm laissées externes
await build({
  stdin: {
    contents: `export * from "@/emails/templates"`,
    resolveDir: root,
    loader: "ts",
  },
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
const templates = await import(pathToFileURL(bundle).href)

const previews = [
  ["reset-password", "Réinitialisation du mot de passe", templates.ResetPasswordEmailDark],
  ["verification", "Vérification de l'adresse email", templates.VerificationEmailDark],
  ["password-change", "Mot de passe modifié", templates.PasswordChangeEmailDark],
  ["profile-update", "Profil mis à jour", templates.ProfileUpdateEmailDark],
  ["welcome", "Bienvenue (annexe)", templates.WelcomeEmailDark],
  ["friend-request", "Demande d'ami (annexe)", templates.FriendRequestEmailDark],
  ["unusual-login", "Connexion inhabituelle (annexe)", templates.UnusualLoginEmailDark],
]

const localize = (html) =>
  html
    .replaceAll("https://chat.olbrechts.cloud/api/logo", "../public/logo-full.png")
    .replaceAll("https://chat.olbrechts.cloud/email/", "../public/email/")

for (const [file, , Template] of previews) {
  const html = await render(React.createElement(Template, Template.PreviewProps))
  writeFileSync(join(outDir, `${file}.html`), localize(html))
}

const index = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Aperçu des emails Helix</title>
<style>body{font-family:system-ui,sans-serif;background:#0D0C11;color:#C9C5D3;padding:40px}a{color:#F2704B;display:block;margin:10px 0}</style></head>
<body><h1>Aperçu des emails Helix</h1>${previews
  .map(([file, label]) => `<a href="${file}.html">${label}</a>`)
  .join("")}</body></html>`
writeFileSync(join(outDir, "index.html"), index)

rmSync(bundle)
console.log(`Aperçus générés : ${join(outDir, "index.html")}`)
