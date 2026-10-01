import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface ResetPasswordEmailProps {
  resetUrl: string
}

export const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Réinitialiser votre mot de passe Helix</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={headerTitle}>Helix</Text>
          <Text style={headerSubtitle}>Messagerie temps réel B2B</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={contentTitle}>Réinitialiser votre mot de passe 🔐</Text>
          <Text style={paragraph}>
            Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le
            bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
          </Text>

          {/* Button */}
          <Section style={buttonContainer}>
            <Button href={resetUrl} style={button}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Fallback URL */}
          <Text style={fallbackText}>
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          </Text>
          <Section style={codeBox}>
            <Text style={codeBoxText}>{resetUrl}</Text>
          </Section>

          {/* Warning Box */}
          <Section style={warningBox}>
            <Text style={warningBoxTitle}>
              ⏱️ <strong>Lien expirant</strong>
            </Text>
            <Text style={warningBoxText}>
              Ce lien est valide pendant 24 heures. Après, vous devrez demander une nouvelle
              réinitialisation.
            </Text>
          </Section>

          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoBoxText}>
              🔒 Si vous n&apos;avez pas demandé cette réinitialisation, ignorez simplement cet
              email. Votre mot de passe restera inchangé.
            </Text>
          </Section>

          {/* Security Note */}
          <Text style={securityNote}>
            <strong>Note de sécurité :</strong> Nous ne vous demanderons jamais votre mot de passe
            par email.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerLogo}>Helix</Text>
          <Text style={footerText}>© 2026 Helix. Tous droits réservés.</Text>
          <Text style={footerText}>
            <Link href="mailto:hello@helix.app" style={footerLink}>
              hello@helix.app
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

ResetPasswordEmail.PreviewProps = {
  resetUrl: "https://helix.app/reset?token=abc123",
} as ResetPasswordEmailProps

export default ResetPasswordEmail

// Styles
const main = {
  backgroundColor: "#e8ebed",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  lineHeight: "1.6",
  color: "#333333",
  margin: "0",
  padding: "0",
}

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  marginTop: "24px",
  marginBottom: "24px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  overflow: "hidden" as const,
}

const header = {
  background: "linear-gradient(135deg, #df6035 0%, #e05d38 100%)",
  color: "white",
  padding: "60px 40px",
  textAlign: "center" as const,
}

const headerTitle = {
  margin: "0",
  fontSize: "36px",
  fontWeight: "700" as const,
  letterSpacing: "-0.5px",
  color: "white",
}

const headerSubtitle = {
  fontSize: "14px",
  opacity: 0.95,
  fontWeight: "400" as const,
  margin: "8px 0 0 0",
  color: "white",
}

const content = {
  padding: "48px 40px",
  backgroundColor: "#ffffff",
}

const contentTitle = {
  fontSize: "24px",
  fontWeight: "700" as const,
  marginBottom: "20px",
  color: "#2f4b79",
  margin: "0 0 20px 0",
}

const paragraph = {
  margin: "16px 0",
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#555555",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0",
}

const button = {
  backgroundColor: "#df6035",
  color: "white",
  padding: "14px 32px",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "600" as const,
  fontSize: "15px",
  display: "inline-block",
  boxShadow: "0 1px 3px rgba(223, 96, 53, 0.3)",
}

const divider = {
  borderColor: "#d6e4f0",
  margin: "28px 0",
}

const fallbackText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "16px 0",
}

const codeBox = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #d6e4f0",
  margin: "12px 0",
  wordBreak: "break-all" as const,
}

const codeBoxText = {
  fontFamily: '"Courier New", monospace',
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "1.5",
  margin: "0",
}

const warningBox = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "20px",
  borderRadius: "6px",
  margin: "24px 0",
}

const warningBoxTitle = {
  margin: "0",
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "500" as const,
}

const warningBoxText = {
  margin: "8px 0 0 0",
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "500" as const,
}

const infoBox = {
  backgroundColor: "#d6e4f0",
  borderLeft: "4px solid #2f4b79",
  padding: "20px",
  borderRadius: "6px",
  margin: "24px 0",
}

const infoBoxText = {
  margin: "0",
  color: "#2f4b79",
  fontSize: "14px",
  fontWeight: "500" as const,
}

const securityNote = {
  fontSize: "13px",
  color: "#6b7280",
  marginTop: "24px",
  margin: "24px 0 0 0",
}

const footer = {
  backgroundColor: "#f9fafb",
  padding: "40px",
  textAlign: "center" as const,
  borderTop: "1px solid #d6e4f0",
}

const footerLogo = {
  fontSize: "18px",
  fontWeight: "700" as const,
  color: "#df6035",
  marginBottom: "12px",
  margin: "0 0 12px 0",
}

const footerText = {
  margin: "6px 0",
  fontSize: "13px",
  color: "#6b7280",
}

const footerLink = {
  color: "#2f4b79",
  textDecoration: "none",
  fontWeight: "500" as const,
}
