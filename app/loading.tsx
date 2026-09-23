import { Logo } from "@/components/logo"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-8">
        <Logo href="/" full className="flex justify-center animate-pulse" />
        <div className="space-y-2">
          <p className="text-muted-foreground">Chargement en cours...</p>
          <div className="flex justify-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            <div
              className="h-2 w-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="h-2 w-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
