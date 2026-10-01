import {
  Body,
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

interface PasswordChangeEmailProps {
  userName?: string
}

export const PasswordChangeEmail = ({}: PasswordChangeEmailProps = {}) => (
  <Html>
    <Head />
    <Preview>Votre mot de passe a été modifié avec succès</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={headerTitle}>Helix</Text>
          <Text style={headerSubtitle}>Messagerie temps réel B2B</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={contentTitle}>Mot de passe modifié 🔐</Text>
          <Text style={paragraph}>Votre mot de passe a été changé avec succès.</Text>

          {/* Success Box */}
          <Section style={successBox}>
            <Text style={successBoxText}>
              Votre compte est maintenant sécurisé avec votre nouveau mot de passe.
            </Text>
          </Section>

          {/* Warning Box */}
          <Section style={warningBox}>
            <Text style={warningBoxTitle}>
              ⚠️ <strong>Attention</strong>
            </Text>
            <Text style={warningBoxText}>
              Si vous n&apos;avez pas effectué ce changement, veuillez contacter notre équipe de
              support immédiatement.
            </Text>
          </Section>

          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoBoxText}>
              🔒 Nous ne vous demanderons jamais votre mot de passe par email.
            </Text>
          </Section>
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

PasswordChangeEmail.PreviewProps = {
  userName: "Adrien",
} as PasswordChangeEmailProps

export default PasswordChangeEmail

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

const successBox = {
  backgroundColor: "#dcfce7",
  borderLeft: "4px solid #22c55e",
  padding: "20px",
  borderRadius: "6px",
  margin: "24px 0",
}

const successBoxText = {
  margin: "0",
  color: "#166534",
  fontSize: "14px",
  fontWeight: "500" as const,
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

const divider = {
  borderColor: "#d6e4f0",
  margin: "28px 0",
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
