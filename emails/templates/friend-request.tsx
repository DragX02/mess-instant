import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Panel, Button } from "@/emails/components"
import { colors, darkEmailStyles } from "@/emails/styles"

interface FriendRequestEmailProps {
  senderName: string
}

export const FriendRequestEmailDark = ({ senderName }: FriendRequestEmailProps) => (
  <DarkLayout
    preview={`${senderName} vous a envoyé une demande d'ami`}
    label="Réseau"
    icon="users"
    iconAlt="Contacts"
    title={`${senderName} souhaite se connecter`}
    intro={
      <>
        <strong style={{ color: colors.white }}>{senderName}</strong> vous a envoyé une demande
        d&apos;ami sur Helix. Acceptez-la pour commencer à collaborer ensemble.
      </>
    }
    securityNote="Vous ne connaissez pas cette personne ? Vous pouvez simplement ignorer cette demande."
  >
    <Panel label="Expéditeur">
      <p style={darkEmailStyles.panelValue}>{senderName}</p>
    </Panel>

    <Button href="https://chat.olbrechts.cloud/amis">Gérer mes demandes</Button>
  </DarkLayout>
)

FriendRequestEmailDark.PreviewProps = {
  senderName: "Jean Dupont",
} as FriendRequestEmailProps

export default FriendRequestEmailDark
