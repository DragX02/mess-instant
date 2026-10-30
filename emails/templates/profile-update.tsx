import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Panel } from "@/emails/components"
import { bgAttr, solid, colors, darkEmailStyles, fonts } from "@/emails/styles"

interface ProfileUpdateEmailProps {
  newName: string
  oldName?: string
}

export const ProfileUpdateEmailDark = ({ newName, oldName }: ProfileUpdateEmailProps) => (
  <DarkLayout
    preview="Le nom d'utilisateur de votre compte Helix vient d'être modifié."
    label="Compte"
    icon="user"
    iconAlt="Utilisateur"
    title="Votre profil a été mis à jour"
    intro="Le nom d'utilisateur associé à votre compte Helix vient d'être modifié."
    securityNote="Vous n'êtes pas à l'origine de cette modification ? Contactez votre administrateur Helix."
  >
    <Panel label="Nom d'utilisateur">
      <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            {oldName && (
              <>
                <td
                  valign="middle"
                  className="t-sec"
                  style={{
                    ...darkEmailStyles.panelValue,
                    fontWeight: 500,
                    color: colors.textSecondary,
                    textDecoration: "line-through",
                  }}
                >
                  {oldName}
                </td>
                <td
                  valign="middle"
                  className="t-muted"
                  style={{
                    padding: "0 12px",
                    fontFamily: fonts.body,
                    fontSize: "18px",
                    color: colors.textMuted,
                  }}
                >
                  &rarr;
                </td>
              </>
            )}
            <td
              valign="middle"
              className="bg-pill t-accent"
              {...bgAttr(colors.accentSoftSolid)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                backgroundColor: colors.accentSoftSolid,
                ...solid(colors.accentSoftSolid),
                fontFamily: fonts.heading,
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 700,
                color: colors.accent,
              }}
            >
              {newName}
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
  </DarkLayout>
)

ProfileUpdateEmailDark.PreviewProps = {
  newName: "Adrien Mertens",
  oldName: "Adrien",
} as ProfileUpdateEmailProps

export default ProfileUpdateEmailDark
