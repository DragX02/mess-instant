import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusPage } from "@/components/status-page"

export default function NotFound() {
  return (
    <StatusPage
      symbol="404"
      symbolClassName="text-primary"
      title="Page non trouvée"
      description="Désolé, la page que vous recherchez n'existe pas ou a été supprimée."
    >
      <div className="flex flex-col gap-3 sm:flex-row justify-center">
        <Button nativeButton={false} render={<Link href="/" />}>
          Retour à l&apos;accueil
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/auth/connexion" />}>
          Se connecter
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Besoin d&apos;aide ?{" "}
        <a href="mailto:hello@helix.app" className="text-primary hover:underline">
          Nous contacter
        </a>
      </p>
    </StatusPage>
  )
}
