import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="max-w-md text-center space-y-8">
        <Logo href="/" full className="flex justify-center mb-8" />

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold">Page non trouvée</h2>
          <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n'existe pas ou a été supprimée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Button nativeButton={false} render={<Link href="/" />}>
            Retour à l'accueil
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/auth/connexion" />}
          >
            Se connecter
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Besoin d'aide ?{" "}
          <a href="mailto:hello@helix.app" className="text-primary hover:underline">
            Nous contacter
          </a>
        </p>
      </div>
    </div>
  )
}
