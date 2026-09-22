/**
 * Traduit les messages d'erreur de better-auth en français
 */
const errorTranslations: Record<string, string> = {
  // Connexion
  "Invalid email or password": "Email ou mot de passe incorrect",
  "User not found": "Cet utilisateur n'existe pas",
  "Email not verified": "Veuillez vérifier votre adresse email avant de continuer",
  "User already exists": "Un compte existe déjà avec cet email",

  // Inscription
  "Email already in use": "Un compte existe déjà avec cet email",
  "Password is too weak": "Le mot de passe n'est pas assez fort",
  "Invalid email": "L'adresse email n'est pas valide",

  // Réinitialisation
  "Invalid token": "Le lien de réinitialisation est invalide ou a expiré",
  "Token expired": "Le lien a expiré. Veuillez demander un nouveau lien",
  "Reset password token not found": "Ce lien de réinitialisation n'existe pas",

  // Vérification
  "Verification email already sent": "Un email de vérification a déjà été envoyé",
  "Email verification failed": "La vérification de l'email a échoué",

  // Général
  "An error occurred": "Une erreur est survenue",
  "Something went wrong": "Quelque chose s'est mal passé",
  "Bad request": "Requête invalide",
  "Unauthorized": "Non autorisé",
  "Forbidden": "Accès refusé",
  "Not found": "Non trouvé",
  "Internal server error": "Erreur serveur interne",
}

export function translateError(errorMessage: string | null | undefined): string {
  if (!errorMessage) return "Une erreur est survenue"

  // Vérifier si on a une traduction exacte
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  // Chercher une traduction partielle (pour les messages avec variables)
  for (const [english, french] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase().includes(english.toLowerCase())) {
      return french
    }
  }

  // Si pas de traduction trouvée, retourner le message original ou un message par défaut
  return errorMessage.startsWith("Error") || errorMessage.length > 100
    ? "Une erreur est survenue"
    : errorMessage
}
