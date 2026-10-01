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
  Img,
} from "@react-email/components"
import * as React from "react"

interface ResetPasswordEmailProps {
  resetUrl: string
}

export const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Réinitialiser votre mot de passe Helix</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://helix.app/logo-full.png"
            alt="Helix"
            width={180}
            height={72}
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={contentTitle}>Réinitialiser votre mot de passe 🔐</Text>
          <Text style={paragraph}>
            Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le
            bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
          </Text>

          {/* Action Box - Simplified for Outlook */}
          <Section style={actionBoxWrapper}>
            <Text style={actionLabel}>Action requise</Text>
            <Section style={buttonContainer}>
              <Button href={resetUrl} style={button}>
                🔑 Réinitialiser mon mot de passe
              </Button>
            </Section>
            <Text style={expirationText}>Valide pendant 24 heures</Text>
          </Section>

          <Hr style={divider} />

          {/* Fallback Section */}
          <Section style={fallbackSection}>
            <Text style={fallbackTitle}>⚠️ Le bouton ne fonctionne pas ?</Text>
            <Text style={fallbackText}>Copiez et collez ce lien dans votre navigateur :</Text>
            <Section style={codeBox}>
              <Text style={codeBoxText}>{resetUrl}</Text>
            </Section>
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

// Styles - Match site design (Helix)
const main = {
  backgroundColor: "#e8ebed",
  fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
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
  borderRadius: "8px",
  boxShadow: "0px 1px 3px 0px rgba(26, 26, 26, 0.1), 0px 1px 2px -1px rgba(26, 26, 26, 0.1)",
  overflow: "hidden" as const,
}

const header = {
  background: "linear-gradient(135deg, #df6035 0%, #e05d38 100%)",
  color: "white",
  padding: "40px 40px 32px 40px",
  textAlign: "center" as const,
}

const logoText = {
  fontSize: "32px",
  fontWeight: "700" as const,
  color: "white",
  margin: "0",
  fontFamily: "Outfit, sans-serif",
  letterSpacing: "-1px",
}

const logoSubtext = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.9)",
  margin: "4px 0 0 0",
  fontFamily: "Outfit, sans-serif",
  letterSpacing: "2px",
  fontWeight: "500" as const,
}

const content = {
  padding: "56px 40px",
  backgroundColor: "#ffffff",
}

const contentTitle = {
  fontSize: "28px",
  fontWeight: "700" as const,
  marginBottom: "24px",
  color: "#2f4b79",
  margin: "0 0 24px 0",
  fontFamily: "Outfit",
}

const paragraph = {
  margin: "16px 0",
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#555555",
  fontFamily: "Outfit",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#df6035",
  color: "white",
  padding: "12px 32px",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "600" as const,
  fontSize: "15px",
  display: "inline-block",
  fontFamily: "Outfit",
  border: "none",
  cursor: "pointer",
}

const divider = {
  borderColor: "#d6e4f0",
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #d6e4f0",
  height: "0",
}

const fallbackText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "16px 0",
  fontFamily: "Outfit",
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
  fontFamily: "Outfit, monospace",
  fontSize: "12px",
  color: "#6b7280",
  lineHeight: "1.5",
  margin: "0",
}

const warningBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  padding: "20px",
  borderRadius: "8px",
  margin: "32px 0",
}

const warningBoxTitle = {
  margin: "0",
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "600" as const,
  fontFamily: "Outfit",
}

const warningBoxText = {
  margin: "8px 0 0 0",
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "500" as const,
  fontFamily: "Outfit",
}

const infoBox = {
  backgroundColor: "#f0f4f8",
  border: "1px solid #d6e4f0",
  padding: "20px",
  borderRadius: "8px",
  margin: "32px 0",
}

const infoBoxText = {
  margin: "0",
  color: "#2f4b79",
  fontSize: "14px",
  fontWeight: "500" as const,
  fontFamily: "Outfit",
}

const securityNote = {
  fontSize: "13px",
  color: "#6b7280",
  marginTop: "24px",
  margin: "24px 0 0 0",
  fontFamily: "Outfit",
}

const actionBoxWrapper = {
  backgroundColor: "#fef9e7",
  padding: "20px",
  margin: "32px 0 24px 0",
  borderRadius: "8px",
}

const actionLabel = {
  fontSize: "12px",
  fontWeight: "700" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#92400e",
  margin: "0 0 16px 0",
  fontFamily: "Outfit",
}

const expirationText = {
  fontSize: "12px",
  color: "#92400e",
  textAlign: "center" as const,
  marginTop: "12px",
  fontFamily: "Outfit",
  fontStyle: "italic",
}

const fallbackSection = {
  backgroundColor: "#fafbfc",
  padding: "20px",
  borderRadius: "8px",
  margin: "32px 0",
  border: "1px solid #d6e4f0",
}

const fallbackTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#2f4b79",
  margin: "0 0 12px 0",
  fontFamily: "Outfit",
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
  fontFamily: "Outfit",
}

const footerText = {
  margin: "6px 0",
  fontSize: "13px",
  color: "#6b7280",
  fontFamily: "Outfit",
}

const footerLink = {
  color: "#2f4b79",
  textDecoration: "none",
  fontWeight: "600" as const,
  fontFamily: "Outfit",
}
