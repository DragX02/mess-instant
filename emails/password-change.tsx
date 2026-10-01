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
  Img,
} from "@react-email/components"
import * as React from "react"

interface PasswordChangeEmailProps {
  userName?: string
}

export const PasswordChangeEmail = ({}: PasswordChangeEmailProps = {}) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Votre mot de passe a été modifié avec succès</Preview>
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
          <Text style={contentTitle}>Mot de passe modifié 🔐</Text>

          {/* Confirmation Box */}
          <Section style={confirmationBox}>
            <Text style={confirmationIcon}>✓</Text>
            <Text style={confirmationText}>Votre mot de passe a été changé avec succès.</Text>
          </Section>

          {/* Details Box */}
          <Section style={successBox}>
            <Text style={successBoxText}>
              🛡️ Votre compte est maintenant sécurisé avec votre nouveau mot de passe.
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

const successBox = {
  backgroundColor: "#d6e4f0",
  border: "1px solid #b8d5e8",
  padding: "20px",
  borderRadius: "8px",
  margin: "32px 0",
}

const successBoxText = {
  margin: "0",
  color: "#2f4b79",
  fontSize: "14px",
  fontWeight: "500" as const,
  fontFamily: "Outfit",
}

const confirmationBox = {
  backgroundColor: "#cfe5f0",
  padding: "24px",
  borderRadius: "8px",
  margin: "28px 0",
  textAlign: "center" as const,
}

const confirmationIcon = {
  display: "block",
  fontSize: "32px",
  margin: "0 0 12px 0",
  color: "#2f4b79",
  fontWeight: "700" as const,
}

const confirmationText = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#2f4b79",
  margin: "0",
  fontFamily: "Outfit",
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

const divider = {
  borderColor: "#d6e4f0",
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #d6e4f0",
  height: "0",
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
