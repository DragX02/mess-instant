// Génère les icônes PNG utilisées dans les emails (Outlook ne supporte pas le SVG inline).
// Usage : node scripts/generate-email-icons.mjs
// Sortie : public/email/*.png (servis sur https://<domaine>/email/<nom>.png)
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Lock, Mail, ShieldCheck, User, Clock, Users, TriangleAlert, PartyPopper } from "lucide-react"
import sharp from "sharp"

const ACCENT = "#F2704B"
const PANEL = "#1E1D25"
const BORDER = "#2B2A35"
const OUT = join(process.cwd(), "public", "email")

const svgOf = (Icon, size, strokeWidth) =>
  renderToStaticMarkup(createElement(Icon, { size, color: ACCENT, strokeWidth }))

// Pastille ronde de 60px, exportée en 120px (écrans retina)
const badges = { lock: Lock, mail: Mail, "shield-check": ShieldCheck, user: User, users: Users, alert: TriangleAlert, party: PartyPopper }
// Petites icônes en ligne de 16px, exportées en 48px
const inline = { clock: Clock }

mkdirSync(OUT, { recursive: true })

for (const [name, Icon] of Object.entries(badges)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="59" fill="${PANEL}" stroke="${BORDER}" stroke-width="2"/>
    <g transform="translate(34 34)">${svgOf(Icon, 52, 1.75)}</g>
  </svg>`
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  writeFileSync(join(OUT, `icon-${name}.png`), png)
}

for (const [name, Icon] of Object.entries(inline)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <g transform="translate(4 4)">${svgOf(Icon, 40, 2)}</g>
  </svg>`
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  writeFileSync(join(OUT, `icon-${name}.png`), png)
}

console.log(`Icônes générées dans ${OUT}`)
