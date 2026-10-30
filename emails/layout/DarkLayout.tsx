import { Html, Head, Preview, Body, Img } from "@react-email/components"
import * as React from "react"
import { getLogoUrl, getEmailIconUrl } from "@/lib/email-config"
import { bgAttr, colors, fonts, solid } from "@/emails/styles"

export type EmailIcon = "lock" | "mail" | "shield-check" | "user" | "users" | "alert" | "party"

export type EmailLabel = "Sécurité" | "Bienvenue" | "Compte" | "Réseau"

interface DarkLayoutProps {
  /** Texte d'aperçu caché (preheader) affiché dans la boîte de réception */
  preview: string
  /** Petit label en majuscules affiché à droite du logo */
  label: EmailLabel
  icon: EmailIcon
  /** Texte alternatif de l'icône */
  iconAlt: string
  title: string
  intro: React.ReactNode
  children?: React.ReactNode
  /** Phrase de sécurité, affichée sous la carte */
  securityNote: string
}

// Dimensions du logo : 168px de large, ratio du fichier 1953x756
const LOGO_WIDTH = 168
const LOGO_HEIGHT = 65

// Namespaces VML nécessaires au bouton « bulletproof » dans Outlook
const vmlNamespaces = {
  "xmlns:v": "urn:schemas-microsoft-com:vml",
  "xmlns:o": "urn:schemas-microsoft-com:office:office",
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');

  :root { color-scheme: dark; supported-color-schemes: dark; }
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

  /* Outlook.com / nouvel Outlook : data-ogsb = fonds, data-ogsc = textes.
     Ces attributs servent à re-forcer nos couleurs quand le client les transforme. */
  [data-ogsb] .bg-page { background-color: ${colors.bg} !important; }
  [data-ogsb] .bg-card { background-color: ${colors.card} !important; }
  [data-ogsb] .bg-panel { background-color: ${colors.panel} !important; }
  [data-ogsb] .bg-accent { background-color: ${colors.accent} !important; }
  [data-ogsb] .bg-pill { background-color: ${colors.accentSoftSolid} !important; }
  [data-ogsb] .btn-secondary { background-color: ${colors.card} !important; }
  [data-ogsc] .t-white { color: ${colors.white} !important; }
  [data-ogsc] .t-text { color: ${colors.text} !important; }
  [data-ogsc] .t-sec { color: ${colors.textSecondary} !important; }
  [data-ogsc] .t-muted { color: ${colors.textMuted} !important; }
  [data-ogsc] .t-accent { color: ${colors.accent} !important; }
  [data-ogsc] .btn-primary { color: ${colors.card} !important; }
  [data-ogsc] .btn-secondary { color: ${colors.accent} !important; }

  @media only screen and (max-width: 620px) {
    .outer { padding: 20px 12px !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .title { font-size: 28px !important; line-height: 34px !important; }
  }
`

export const DarkLayout = ({
  preview,
  label,
  icon,
  iconAlt,
  title,
  intro,
  children,
  securityNote,
}: DarkLayoutProps) => (
  <Html lang="fr" dir="ltr" {...vmlNamespaces}>
    <Head>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <style>{css}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body
      className="bg-page"
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        backgroundColor: colors.bg,
        ...solid(colors.bg),
        fontFamily: fonts.body,
        color: colors.text,
      }}
    >
      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        className="bg-page"
        bgcolor={colors.bg}
        style={{ backgroundColor: colors.bg, ...solid(colors.bg), width: "100%" }}
      >
        <tbody>
          <tr>
            <td
              align="center"
              {...bgAttr(colors.bg)}
              className="outer bg-page"
              style={{ padding: "40px 16px", backgroundColor: colors.bg, ...solid(colors.bg) }}
            >
              {/* Carte : 600px (attribut width pour Outlook, max-width pour le reste) */}
              <table
                role="presentation"
                width={600}
                cellPadding={0}
                cellSpacing={0}
                border={0}
                className="bg-card"
                bgcolor={colors.card}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  backgroundColor: colors.card,
                  ...solid(colors.card),
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "16px",
                  borderCollapse: "separate",
                  overflow: "hidden",
                }}
              >
                <tbody>
                  {/* Barre d'accent de 4px */}
                  <tr>
                    <td
                      height={4}
                      className="bg-accent"
                      {...bgAttr(colors.accent)}
                      style={{
                        height: "4px",
                        fontSize: "0px",
                        lineHeight: "4px",
                        backgroundColor: colors.accent,
                        ...solid(colors.accent),
                      }}
                    >
                      &nbsp;
                    </td>
                  </tr>

                  {/* Header : logo à gauche, label à droite */}
                  <tr>
                    <td className="px" style={{ padding: "40px 44px 0 44px" }}>
                      <table
                        role="presentation"
                        width="100%"
                        cellPadding={0}
                        cellSpacing={0}
                        border={0}
                      >
                        <tbody>
                          <tr>
                            <td align="left" valign="middle" width={LOGO_WIDTH}>
                              <Img
                                src={getLogoUrl()}
                                alt="Helix Messagerie B2B"
                                width={LOGO_WIDTH}
                                height={LOGO_HEIGHT}
                                style={{
                                  display: "block",
                                  width: `${LOGO_WIDTH}px`,
                                  height: "auto",
                                }}
                              />
                            </td>
                            <td
                              align="right"
                              valign="middle"
                              className="t-muted"
                              style={{
                                fontFamily: fonts.heading,
                                fontSize: "11px",
                                lineHeight: "16px",
                                fontWeight: 700,
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                color: colors.textMuted,
                              }}
                            >
                              {label}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Corps : icône, titre, intro, contenu */}
                  <tr>
                    <td className="px" style={{ padding: "36px 44px 44px 44px" }}>
                      <Img
                        src={getEmailIconUrl(icon)}
                        alt={iconAlt}
                        width={60}
                        height={60}
                        style={{ display: "block", width: "60px", height: "60px" }}
                      />
                      <h1
                        className="title t-white"
                        style={{
                          margin: "24px 0 16px 0",
                          fontFamily: fonts.heading,
                          fontSize: "34px",
                          lineHeight: "40px",
                          fontWeight: 700,
                          color: colors.white,
                        }}
                      >
                        {title}
                      </h1>
                      <div
                        className="t-text"
                        style={{
                          margin: "0 0 28px 0",
                          fontFamily: fonts.body,
                          fontSize: "16px",
                          lineHeight: "26px",
                          color: colors.text,
                        }}
                      >
                        {intro}
                      </div>
                      {children}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Pied de page hors carte */}
              <table
                role="presentation"
                width={600}
                cellPadding={0}
                cellSpacing={0}
                border={0}
                style={{ width: "100%", maxWidth: "600px" }}
              >
                <tbody>
                  <tr>
                    <td align="center" style={{ padding: "28px 24px 0 24px" }}>
                      <p
                        className="t-sec"
                        style={{
                          margin: "0 0 12px 0",
                          fontFamily: fonts.body,
                          fontSize: "13px",
                          lineHeight: "20px",
                          color: colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        {securityNote}
                      </p>
                      <p
                        className="t-muted"
                        style={{
                          margin: 0,
                          fontFamily: fonts.body,
                          fontSize: "12px",
                          lineHeight: "18px",
                          color: colors.textMuted,
                          textAlign: "center",
                        }}
                      >
                        Helix Messagerie B2B · Cet email est envoyé automatiquement, merci de ne pas
                        y répondre.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </Body>
  </Html>
)

export { darkEmailStyles } from "@/emails/styles"
