const errorTranslations: Record<string, string> = {
  "Invalid email or password": "Email ou mot de passe incorrect",
  "User not found": "Cet utilisateur n'existe pas",
  "Email not verified": "Veuillez vérifier votre adresse email avant de continuer",
  "User already exists": "Un compte existe déjà avec cet email",

  "Email already in use": "Un compte existe déjà avec cet email",
  "Password is too weak": "Le mot de passe n'est pas assez fort",
  "Invalid email": "L'adresse email n'est pas valide",

  "Invalid token": "Le lien de réinitialisation est invalide ou a expiré",
  "Token expired": "Le lien a expiré. Veuillez demander un nouveau lien",
  "Reset password token not found": "Ce lien de réinitialisation n'existe pas",

  "Verification email already sent": "Un email de vérification a déjà été envoyé",
  "Email verification failed": "La vérification de l'email a échoué",

  access_denied:
    "Vous avez refusé d'autoriser Helix. Veuillez réessayer et accepter les permissions demandées.",
  invalid_request: "Requête d'authentification invalide",
  server_error: "Une erreur serveur s'est produite lors de l'authentification",
  temporarily_unavailable: "Le service d'authentification est temporairement indisponible",
  account_not_found:
    "Aucun compte n'est associé à cet identifiant Google. Veuillez d'abord créer un compte via l'inscription.",

  "An error occurred": "Une erreur est survenue",
  "Something went wrong": "Quelque chose s'est mal passé",
  "Bad request": "Requête invalide",
  Unauthorized: "Non autorisé",
  Forbidden: "Accès refusé",
  "Not found": "Non trouvé",
  "Internal server error": "Erreur serveur interne",
}

export function translateError(errorMessage: string | null | undefined): string {
  if (!errorMessage) return "Une erreur est survenue"

  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  for (const [english, french] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase().includes(english.toLowerCase())) {
      return french
    }
  }

  return errorMessage.startsWith("Error") || errorMessage.length > 100
    ? "Une erreur est survenue"
    : errorMessage
}
