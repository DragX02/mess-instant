// URL du serveur pour les assets (logo, images, etc.)
// Doit être accessible 24/7 pour que Gmail puisse charger les images
export const EMAIL_ASSET_BASE_URL = "https://chat.olbrechts.cloud"

export function getLogoUrl(): string {
  return `${EMAIL_ASSET_BASE_URL}/api/logo`
}

// Icônes PNG générées par scripts/generate-email-icons.mjs (public/email/)
export function getEmailIconUrl(name: string): string {
  return `${EMAIL_ASSET_BASE_URL}/email/icon-${name}.png`
}

// Page « mot de passe oublié » : point d'entrée de la réinitialisation
export function getForgotPasswordUrl(): string {
  return `${EMAIL_ASSET_BASE_URL}/auth/mot-de-passe-oublie`
}
