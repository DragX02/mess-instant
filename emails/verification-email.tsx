import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
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
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Vérifiez votre adresse email pour activer votre compte</Preview>
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
          <Text style={contentTitle}>Bienvenue sur Helix ! 🎉</Text>
          <Text style={paragraph}>
            Merci de vous être inscrit. Pour activer votre compte, vérifiez votre adresse email en
            cliquant sur le bouton ci-dessous.
          </Text>

          {/* Action Box */}
          <Section style={actionBox}>
            <Text style={actionLabel}>Étape suivante</Text>
            <Section style={buttonContainer}>
              <Button href={verificationUrl} style={button}>
                ✓ Vérifier mon adresse email
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Fallback Section */}
          <Section style={fallbackSection}>
            <Text style={fallbackTitle}>⚠️ Le bouton ne fonctionne pas ?</Text>
            <Text style={fallbackText}>Copiez et collez ce lien dans votre navigateur :</Text>
            <Section style={codeBox}>
              <Text style={codeBoxText}>{verificationUrl}</Text>
            </Section>
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

const actionBox = {
  backgroundColor: "#e8f2f9",
  padding: "20px",
  margin: "32px 0 24px 0",
  borderRadius: "8px",
}

const actionLabel = {
  fontSize: "12px",
  fontWeight: "700" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "#2f4b79",
  margin: "0 0 16px 0",
  fontFamily: "Outfit",
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
