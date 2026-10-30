import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Button, LinkFallback } from "@/emails/components"

interface VerificationEmailProps {
  verificationUrl: string
}

export const VerificationEmailDark = ({ verificationUrl }: VerificationEmailProps) => (
  <DarkLayout
    preview="Confirmez votre adresse email pour finaliser la création de votre compte Helix."
    label="Bienvenue"
    icon="mail"
    iconAlt="Enveloppe"
    title="Vérifiez votre adresse email"
    intro="Bienvenue sur Helix ! Confirmez votre adresse email pour finaliser la création de votre compte."
    securityNote="Vous n'avez pas créé de compte Helix ? Vous pouvez ignorer cet email en toute sécurité."
  >
    <Button href={verificationUrl}>Vérifier mon adresse email</Button>
    <LinkFallback url={verificationUrl} />
  </DarkLayout>
)

VerificationEmailDark.PreviewProps = {
  verificationUrl: "https://chat.olbrechts.cloud/api/auth/verify-email?token=abc123def456",
} as VerificationEmailProps

export default VerificationEmailDark
