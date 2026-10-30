import * as React from "react"
import { colors, darkEmailStyles, solid } from "@/emails/styles"

interface LinkFallbackProps {
  url: string
}

/** Bloc « Le bouton ne fonctionne pas ? » avec le lien dans un cadre monospace */
export const LinkFallback = ({ url }: LinkFallbackProps) => (
  <table
    role="presentation"
    width="100%"
    cellPadding={0}
    cellSpacing={0}
    border={0}
    className="bg-panel"
    bgcolor={colors.panel}
    style={{
      backgroundColor: colors.panel,
      ...solid(colors.panel),
      border: `1px solid ${colors.panelBorder}`,
      borderRadius: "12px",
      borderCollapse: "separate",
      margin: "28px 0 0 0",
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: "20px 24px" }}>
          <p className="t-sec" style={{ ...darkEmailStyles.small, margin: "0 0 12px 0" }}>
            <strong className="t-white" style={{ color: colors.white }}>
              Le bouton ne fonctionne pas ?
            </strong>{" "}
            Copiez et collez ce lien dans votre navigateur :
          </p>
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            className="bg-page"
            bgcolor={colors.bg}
            style={{
              backgroundColor: colors.bg,
              ...solid(colors.bg),
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: "8px",
              borderCollapse: "separate",
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "12px 14px" }}>
                  <a
                    href={url}
                    className="t-accent"
                    style={{
                      ...darkEmailStyles.monospace,
                      color: colors.accent,
                      textDecoration: "none",
                    }}
                  >
                    {url}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
)
