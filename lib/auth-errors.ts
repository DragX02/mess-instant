// Codes d'erreur d'authentification acceptés dans l'URL /auth/error?error=...
// Tout autre contenu (texte libre, error_description) est ignoré : sinon un lien piégé
// pourrait afficher un message arbitraire sur notre domaine.
export const CODES_ERREUR_AUTH = [
  "access_denied",
  "invalid_request",
  "server_error",
  "temporarily_unavailable",
  "account_not_found",
] as const

export function codeErreurAuth(valeur: string | null) {
  const code = CODES_ERREUR_AUTH.find((item) => item === valeur)
  return code ?? null
}
