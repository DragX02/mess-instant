import { Coins } from "lucide-react"
import { cn } from "cn"
import { formaterPrix, prixPack, type PackPieces } from "@/lib/boutique"

export function PackCard({
  pack,
  compact,
  children,
}: {
  pack: PackPieces
  compact?: boolean
  children: React.ReactNode
}) {
  const promo = pack.reduction > 0

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-xl border bg-card",
        promo ? "border-primary" : "border-border",
        compact ? "p-3" : "p-6",
      )}
    >
      {promo && (
        <span className="absolute -top-3 right-4 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          -{pack.reduction} %
        </span>
      )}

      <p className="text-sm font-medium text-muted-foreground">Pack {pack.nom}</p>

      <p className={cn("flex items-center gap-2 font-bold", compact ? "text-lg" : "text-3xl")}>
        <Coins className={cn("text-primary", compact ? "h-5 w-5" : "h-7 w-7")} />
        {pack.pieces} pièces
      </p>

      <p className="flex items-baseline gap-2">
        <span className={cn("font-semibold", compact ? "text-base" : "text-xl")}>
          {formaterPrix(prixPack(pack))}
        </span>
        {promo && (
          <span className="text-sm text-muted-foreground line-through">
            {formaterPrix(pack.prix)}
          </span>
        )}
      </p>

      {children}
    </div>
  )
}
