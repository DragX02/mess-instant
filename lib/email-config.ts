// Helper pour construire l'URL du logo selon l'environnement
export function getLogoUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chat.olbrechts.cloud"
  return `${appUrl}/api/logo`
}
