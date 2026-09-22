export interface PasswordStrength {
  score: number // 0-4
  level: "weak" | "fair" | "good" | "strong"
  feedback: string[]
  isValid: boolean
}

const REQUIREMENTS = {
  minLength: 8,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /\d/,
  hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Check minimum length
  if (password.length >= REQUIREMENTS.minLength) {
    score++
  } else {
    feedback.push(`Minimum ${REQUIREMENTS.minLength} caractères`)
  }

  // Check lowercase
  if (REQUIREMENTS.hasLowercase.test(password)) {
    score++
  } else {
    feedback.push("Au moins une lettre minuscule (a-z)")
  }

  // Check uppercase
  if (REQUIREMENTS.hasUppercase.test(password)) {
    score++
  } else {
    feedback.push("Au moins une lettre majuscule (A-Z)")
  }

  // Check number
  if (REQUIREMENTS.hasNumber.test(password)) {
    score++
  } else {
    feedback.push("Au moins un chiffre (0-9)")
  }

  // Check special character
  if (REQUIREMENTS.hasSpecial.test(password)) {
    score++
  } else {
    feedback.push("Au moins un caractère spécial (!@#$%^&*)")
  }

  // Determine level
  let level: "weak" | "fair" | "good" | "strong" = "weak"
  if (score >= 4) {
    level = "strong"
  } else if (score >= 3) {
    level = "good"
  } else if (score >= 2) {
    level = "fair"
  }

  return {
    score,
    level,
    feedback,
    isValid: score >= 3, // Minimum "good" pour être valide
  }
}
