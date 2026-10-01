import * as React from "react"
import { colors, darkEmailStyles, solid } from "@/emails/styles"

interface InfoBoxProps {
  title?: string
  children: React.ReactNode
}

/** Encadré d'information discret (conseil, rappel de sécurité) */
export const InfoBox = ({ title, children }: InfoBoxProps) => (
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
      margin: "0 0 24px 0",
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: "16px 20px" }}>
          <p className="t-sec" style={darkEmailStyles.small}>
            {title && (
              <strong className="t-white" style={{ color: colors.white }}>
                {title}{" "}
              </strong>
            )}
            {children}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
)
