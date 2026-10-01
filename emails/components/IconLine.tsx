import { Img } from "@react-email/components"
import * as React from "react"
import { getEmailIconUrl } from "@/lib/email-config"
import { darkEmailStyles } from "@/emails/styles"

interface IconLineProps {
  icon: "clock"
  alt: string
  children: React.ReactNode
}

/** Ligne de texte secondaire précédée d'une petite icône PNG de 16px */
export const IconLine = ({ icon, alt, children }: IconLineProps) => (
  <table
    role="presentation"
    cellPadding={0}
    cellSpacing={0}
    border={0}
    style={{ margin: "20px 0 0 0" }}
  >
    <tbody>
      <tr>
        <td valign="middle" width={16} style={{ paddingRight: "8px" }}>
          <Img
            src={getEmailIconUrl(icon)}
            alt={alt}
            width={16}
            height={16}
            style={{ display: "block", width: "16px", height: "16px" }}
          />
        </td>
        <td valign="middle">
          <p className="t-sec" style={darkEmailStyles.small}>
            {children}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
)
