import * as React from "react"
import { colors, fonts } from "@/emails/styles"

interface ButtonProps {
  href: string
  children: string
  variant?: "primary" | "secondary"
}

const HEIGHT = 54
// Largeur utile de la carte : 600 - 2 × 1px de bordure - 2 × 44px de padding
const VML_WIDTH = 510

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/**
 * Bouton « bulletproof » : lien <a> stylé dans une cellule de tableau, avec un
 * fallback VML (v:roundrect) pour Outlook desktop qui ignore border-radius et
 * la hauteur des liens. Le HTML est écrit à la main car React ne sait pas
 * émettre les commentaires conditionnels <!--[if mso]>.
 */
export const Button = ({ href, children, variant = "primary" }: ButtonProps) => {
  const primary = variant === "primary"
  const label = `${escapeHtml(children)} &rarr;`
  const url = escapeHtml(href)
  const textColor = primary ? colors.card : colors.accent
  const fill = primary ? colors.accent : colors.card
  const border = primary ? 0 : 2
  const inner = HEIGHT - border * 2

  const vml = `<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:${HEIGHT}px;width:${VML_WIDTH}px;v-text-anchor:middle;" arcsize="19%" ${
    primary ? 'stroke="f"' : `stroke="t" strokecolor="${colors.accent}" strokeweight="2px"`
  } fillcolor="${fill}"><w:anchorlock/><center style="color:${textColor};font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;">${label}</center></v:roundrect>`

  const link = `<a href="${url}" target="_blank" class="btn-${variant}" style="display:block;box-sizing:border-box;height:${HEIGHT}px;line-height:${inner}px;border-radius:10px;${
    border ? `border:${border}px solid ${colors.accent};` : ""
  }background-color:${fill};background-image:linear-gradient(${fill},${fill});color:${textColor};font-family:${fonts.body.replace(/"/g, "'")};font-size:16px;font-weight:700;text-align:center;text-decoration:none;">${label}</a>`

  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
      <tbody>
        <tr>
          <td
            align="center"
            style={{ borderRadius: "10px" }}
            dangerouslySetInnerHTML={{
              __html: `<!--[if mso]>${vml}<![endif]--><!--[if !mso]><!-->${link}<!--<![endif]-->`,
            }}
          />
        </tr>
      </tbody>
    </table>
  )
}
