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

interface ProfileUpdateEmailProps {
  newName: string
}

export const ProfileUpdateEmail = ({ newName }: ProfileUpdateEmailProps) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Votre nom d&apos;utilisateur a été modifié avec succès</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://helix.app/api/logo"
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
          <Text style={contentTitle}>Profil mis à jour ✅</Text>

          {/* Highlight Box */}
          <Section style={highlightBox}>
            <Text style={highlightLabel}>Nouveau nom d&apos;utilisateur</Text>
            <Text style={highlightValue}>{newName}</Text>
          </Section>

          {/* Details Box */}
          <Section style={successBox}>
            <Text style={successBoxText}>Cette modification a été appliquée à votre compte.</Text>
          </Section>

          {/* Security Info */}
          <Section style={securitySection}>
            <Text style={securityLabel}>🔒 Sécurité du compte</Text>
            <Text style={securityMessage}>
              Si vous n&apos;avez pas effectué cette modification, veuillez contacter notre équipe
              de support immédiatement.
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

ProfileUpdateEmail.PreviewProps = {
  newName: "Adrien Nouveau",
} as ProfileUpdateEmailProps

export default ProfileUpdateEmail

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

const highlightBox = {
  backgroundColor: "#fff4ef",
  padding: "24px",
  borderRadius: "8px",
  margin: "28px 0",
  textAlign: "center" as const,
}

const highlightLabel = {
  fontSize: "12px",
  fontWeight: "700" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#2f4b79",
  margin: "0 0 12px 0",
  fontFamily: "Outfit",
}

const highlightValue = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#df6035",
  margin: "0",
  fontFamily: "Outfit",
  letterSpacing: "-0.5px",
}

const securitySection = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  margin: "32px 0",
  borderLeft: "4px solid #df6035",
}

const securityLabel = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#2f4b79",
  margin: "0 0 8px 0",
  fontFamily: "Outfit",
}

const securityMessage = {
  fontSize: "14px",
  color: "#555555",
  margin: "0",
  fontFamily: "Outfit",
  lineHeight: "1.6",
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
