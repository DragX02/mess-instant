import type { PasswordStrength } from "@/lib/password-validator"

const levels = {
  weak: { label: "Faible", bar: "bg-destructive", text: "text-destructive" },
  fair: { label: "Acceptable", bar: "bg-yellow-500", text: "text-yellow-500" },
  good: { label: "Bon", bar: "bg-blue-500", text: "text-blue-500" },
  strong: { label: "Très fort", bar: "bg-green-500", text: "text-green-500" },
}

export function PasswordStrengthMeter({
  strength,
  visible = true,
}: {
  strength: PasswordStrength
  visible?: boolean
}) {
  if (!visible) {
    return null
  }

  const level = levels[strength.level]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Force du mot de passe</span>
        <span className={`font-medium ${level.text}`}>{level.label}</span>
      </div>

      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${level.bar}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>

      {strength.feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="text-destructive">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {strength.isValid && (
        <p className="text-xs text-green-500 font-medium">✓ Mot de passe fort</p>
      )}
    </div>
  )
}
