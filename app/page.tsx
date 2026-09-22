"use client"

import Link from "next/link"
import { ChatPreview } from "@/components/chat-preview"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/" size="sm" withText />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/discussion" />}
            >
              Canal info
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href="/auth/connexion" />}>
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
                Nouveau : canaux vocaux en bêta
              </span>
              <h1 className="text-5xl leading-tight font-bold font-sans md:text-6xl">
                Vos équipes se parlent.
                <br />
                <span className="text-primary">Helix porte le signal.</span>
              </h1>
              <p className="max-w-md text-lg text-muted-foreground">
                Des canaux, des rôles, des conversations qui suivent le rythme de votre équipe —
                comme votre serveur communautaire préféré, pensé pour le travail sérieux.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                nativeButton={false}
                render={<Link href="/auth/inscription" />}
              >
                Démarrer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                nativeButton={false}
                render={<Link href="/auth/connexion" />}
              >
                Se connecter
              </Button>
            </div>
          </div>

          <ChatPreview />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold font-sans md:text-4xl">
            Prêt à transformer votre communication d&apos;équipe ?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Commencez gratuitement. Aucune carte bancaire requise.
          </p>
          <Button size="lg" nativeButton={false} render={<Link href="/auth/inscription" />}>
            Démarrer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="text-lg font-bold font-sans text-primary">Helix</div>
          <p className="text-sm text-muted-foreground">© 2026 Helix. Tous droits réservés.</p>
          <a
            href="mailto:hello@helix.app"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            hello@helix.app
          </a>
        </div>
      </footer>
    </div>
  )
}
