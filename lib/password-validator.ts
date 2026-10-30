export type PasswordStrength = {
  score: number
  level: "weak" | "fair" | "good" | "strong"
  feedback: string[]
  isValid: boolean
}

export const EMPTY_PASSWORD_STRENGTH: PasswordStrength = {
  score: 0,
  level: "weak",
  feedback: [],
  isValid: false,
}

const REQUIREMENTS = [
  { test: (password: string) => password.length >= 8, message: "Minimum 8 caractères" },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: "Au moins une lettre minuscule (a-z)",
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: "Au moins une lettre majuscule (A-Z)",
  },
  { test: (password: string) => /\d/.test(password), message: "Au moins un chiffre (0-9)" },
  {
    test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(password),
    message: "Au moins un caractère spécial (!@#$%^&*)",
  },
]

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  for (const requirement of REQUIREMENTS) {
    if (requirement.test(password)) {
      score = score + 1
    } else {
      feedback.push(requirement.message)
    }
  }

  let level: PasswordStrength["level"] = "weak"

  if (score >= 4) {
    level = "strong"
  } else if (score >= 3) {
    level = "good"
  } else if (score >= 2) {
    level = "fair"
  }

  return { score, level, feedback, isValid: score >= 3 }
}
