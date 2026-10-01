import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Button, IconLine, LinkFallback } from "@/emails/components"

interface ResetPasswordEmailProps {
  resetUrl: string
}

export const ResetPasswordEmailDark = ({ resetUrl }: ResetPasswordEmailProps) => (
  <DarkLayout
    preview="Choisissez un nouveau mot de passe pour votre compte Helix. Ce lien est valable 1 heure."
    label="Sécurité"
    icon="lock"
    iconAlt="Cadenas"
    title="Réinitialisez votre mot de passe"
    intro="Nous avons reçu une demande de réinitialisation du mot de passe de votre compte Helix. Cliquez sur le bouton ci-dessous pour en choisir un nouveau."
    securityNote="Vous n'avez pas fait cette demande ? Ignorez simplement cet email : votre mot de passe actuel reste inchangé."
  >
    <Button href={resetUrl}>Réinitialiser mon mot de passe</Button>
    <IconLine icon="clock" alt="Durée de validité">
      Ce lien est valable pendant 1 heure.
    </IconLine>
    <LinkFallback url={resetUrl} />
  </DarkLayout>
)

ResetPasswordEmailDark.PreviewProps = {
  resetUrl: "https://chat.olbrechts.cloud/auth/reinitialiser-mot-de-passe?token=abc123def456",
} as ResetPasswordEmailProps

export default ResetPasswordEmailDark
