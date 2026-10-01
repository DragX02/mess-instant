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

interface VerificationEmailProps {
  verificationUrl: string
}

export const VerificationEmail = ({ verificationUrl }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Vérifiez votre adresse email pour activer votre compte</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={headerTitle}>Helix</Text>
          <Text style={headerSubtitle}>Messagerie temps réel B2B</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={contentTitle}>Bienvenue sur Helix ! 🎉</Text>
          <Text style={paragraph}>
            Merci de vous être inscrit. Pour activer votre compte, vérifiez votre adresse email en
            cliquant sur le bouton ci-dessous.
          </Text>

          {/* Button */}
          <Section style={buttonContainer}>
            <Button href={verificationUrl} style={button}>
              Vérifier mon adresse email
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Fallback URL */}
          <Text style={fallbackText}>
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          </Text>
          <Section style={codeBox}>
            <Text style={codeBoxText}>{verificationUrl}</Text>
          </Section>

          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoBoxText}>
              💡 Ce lien expire dans 24 heures. Après expiration, vous devrez demander un nouveau
              lien de vérification.
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

VerificationEmail.PreviewProps = {
  verificationUrl: "https://helix.app/verify?token=abc123",
} as VerificationEmailProps

export default VerificationEmail

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
