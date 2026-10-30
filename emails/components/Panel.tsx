import * as React from "react"
import { colors, darkEmailStyles, solid } from "@/emails/styles"

interface PanelProps {
  label: string
  children: React.ReactNode
}

/** Panneau secondaire (#1E1D25) avec un label en majuscules */
export const Panel = ({ label, children }: PanelProps) => (
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
        <td style={{ padding: "20px 24px" }}>
          <p className="t-muted" style={darkEmailStyles.panelLabel}>
            {label}
          </p>
          {children}
        </td>
      </tr>
    </tbody>
  </table>
)
