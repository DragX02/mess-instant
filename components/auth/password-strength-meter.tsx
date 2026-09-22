import { PasswordStrength } from "@/lib/password-validator"

interface PasswordStrengthMeterProps {
  strength: PasswordStrength
  visible?: boolean
}

export function PasswordStrengthMeter({
  strength,
  visible = true,
}: PasswordStrengthMeterProps) {
  if (!visible) return null

  const colors = {
    weak: "bg-destructive",
    fair: "bg-yellow-500",
    good: "bg-blue-500",
    strong: "bg-green-500",
  }

  const labels = {
    weak: "Faible",
    fair: "Acceptable",
    good: "Bon",
    strong: "Très fort",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Force du mot de passe</span>
        <span className={`font-medium ${
          strength.level === "weak" ? "text-destructive" :
          strength.level === "fair" ? "text-yellow-500" :
          strength.level === "good" ? "text-blue-500" :
          "text-green-500"
        }`}>
          {labels[strength.level]}
        </span>
      </div>

      {/* Strength bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${colors[strength.level]}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.map((item, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="text-destructive">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Success message */}
      {strength.isValid && (
        <p className="text-xs text-green-500 font-medium">
          ✓ Mot de passe fort
        </p>
      )}
    </div>
  )
}
