import { Link } from "@react-email/components"
import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Panel, InfoBox, Button } from "@/emails/components"
import { colors, darkEmailStyles } from "@/emails/styles"

interface UnusualLoginEmailProps {
  deviceName: string
  location: string
  time: string
}

export const UnusualLoginEmailDark = ({ deviceName, location, time }: UnusualLoginEmailProps) => (
  <DarkLayout
    preview="Une connexion inhabituelle à votre compte Helix a été détectée."
    label="Sécurité"
    icon="alert"
    iconAlt="Alerte"
    title="Tentative de connexion détectée"
    intro="Nous avons détecté une tentative de connexion à votre compte depuis un appareil ou une localisation inhabituelle."
    securityNote="C'était vous ? Vous pouvez ignorer cet email. Sinon, changez immédiatement votre mot de passe."
  >
    <Panel label="Détails de la connexion">
      <p style={{ ...darkEmailStyles.small, color: colors.text }}>
        <strong style={{ color: colors.white }}>Appareil :</strong> {deviceName}
        <br />
        <strong style={{ color: colors.white }}>Localisation :</strong> {location}
        <br />
        <strong style={{ color: colors.white }}>Heure :</strong> {time}
      </p>
    </Panel>

    <InfoBox title="Sécurité :">
      Si ce n&apos;était pas vous, changez votre mot de passe immédiatement et{" "}
      <Link href="mailto:hello@helix.app" style={darkEmailStyles.link}>
        contactez notre support
      </Link>
      .
    </InfoBox>

    <Button href="https://chat.olbrechts.cloud/securite" variant="secondary">
      Vérifier l&apos;activité de mon compte
    </Button>
  </DarkLayout>
)

UnusualLoginEmailDark.PreviewProps = {
  deviceName: "Chrome sur Windows",
  location: "Paris, France",
  time: "11 oct 2026, 14:32",
} as UnusualLoginEmailProps

export default UnusualLoginEmailDark
