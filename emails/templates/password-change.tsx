import * as React from "react"
import { DarkLayout } from "@/emails/layout/DarkLayout"
import { Button, Panel } from "@/emails/components"
import { getForgotPasswordUrl } from "@/lib/email-config"
import { darkEmailStyles } from "@/emails/styles"

interface PasswordChangeEmailProps {
  userName?: string
  /** Date de la modification (par défaut : au moment du rendu, c'est-à-dire de l'envoi) */
  changedAt?: Date
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("fr-BE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Brussels",
  }).format(date)

export const PasswordChangeEmailDark = ({ changedAt }: PasswordChangeEmailProps = {}) => (
  <DarkLayout
    preview="Le mot de passe de votre compte Helix vient d'être modifié."
    label="Compte"
    icon="shield-check"
    iconAlt="Bouclier validé"
    title="Votre mot de passe a été modifié"
    intro="Le mot de passe de votre compte Helix vient d'être modifié. Si vous êtes à l'origine de ce changement, vous n'avez rien d'autre à faire."
    securityNote="Ce n'était pas vous ? Sécurisez votre compte sans attendre et prévenez votre administrateur."
  >
    <Panel label="Modifié le">
      <p className="t-white" style={darkEmailStyles.panelValue}>
        {formatDate(changedAt ?? new Date())}
      </p>
    </Panel>
    <Button href={getForgotPasswordUrl()} variant="secondary">
      Sécuriser mon compte
    </Button>
  </DarkLayout>
)

PasswordChangeEmailDark.PreviewProps = {
  userName: "Adrien",
  changedAt: new Date("2026-10-01T13:42:00+02:00"),
} as PasswordChangeEmailProps

export default PasswordChangeEmailDark
