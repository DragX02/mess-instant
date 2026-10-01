import { Link } from "@react-email/components"
import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Panel, InfoBox, List, Button } from "@/emails/components"
import { darkEmailStyles } from "@/emails/styles"

interface WelcomeEmailProps {
  userName: string
}

export const WelcomeEmailDark = ({ userName }: WelcomeEmailProps) => (
  <DarkLayout
    preview="Votre compte Helix Messagerie B2B est prêt."
    label="Bienvenue"
    icon="party"
    iconAlt="Célébration"
    title={`Bienvenue sur Helix, ${userName} !`}
    intro="Votre compte a été créé avec succès. Vous êtes maintenant prêt à rejoindre votre équipe et à commencer à collaborer sur Helix Messagerie B2B."
    securityNote="Vous n'avez pas créé ce compte ? Contactez immédiatement notre équipe de support."
  >
    <Panel label="Pour commencer">
      <List
        paddingLeft="18px"
        items={[
          "Complétez votre profil avec une photo",
          "Invitez vos collègues à rejoindre",
          "Explorez les canaux de discussion disponibles",
        ]}
      />
    </Panel>

    <InfoBox title="Besoin d'aide ?">
      Consultez notre documentation ou contactez{" "}
      <Link href="mailto:hello@helix.app" style={darkEmailStyles.link}>
        notre support
      </Link>
      .
    </InfoBox>

    <Button href="https://chat.olbrechts.cloud">Accéder à mon espace</Button>
  </DarkLayout>
)

WelcomeEmailDark.PreviewProps = {
  userName: "Adrien",
} as WelcomeEmailProps

export default WelcomeEmailDark
