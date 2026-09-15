'use client'

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold font-sans text-primary">Helix</div>

          <nav className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Tarifs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button size="sm" nativeButton={false} render={<Link href="/auth/connexion" />}>
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold font-sans leading-tight">
                Vos équipes se parlent.
                <br />
                <span className="text-primary">Helix porte le signal.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                La messagerie temps réel conçue pour les équipes B2B. Conversations sécurisées, groupes organisés, permissions natives.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto" nativeButton={false} render={<Link href="/auth/inscription" />}>
                Démarrer gratuitement
              </Button>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                En savoir plus ↓
              </a>
            </div>
          </div>

          {/* SVG Minimaliste */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 300" className="w-full max-w-sm h-auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  {`
                    @keyframes pulse-primary {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.6; }
                    }
                    .pulse { animation: pulse-primary 2s ease-in-out infinite; }
                  `}
                </style>
              </defs>

              {/* Centre - Point principal */}
              <circle cx="150" cy="150" r="14" fill="currentColor" className="text-primary pulse" />

              {/* Nœuds satellites */}
              <circle cx="80" cy="80" r="9" fill="currentColor" className="text-secondary opacity-80" />
              <circle cx="220" cy="80" r="9" fill="currentColor" className="text-secondary opacity-80" />
              <circle cx="150" cy="240" r="9" fill="currentColor" className="text-secondary opacity-80" />

              {/* Lignes de connexion principales */}
              <line x1="150" y1="150" x2="80" y2="80" stroke="currentColor" strokeWidth="2.5" className="text-primary opacity-40" />
              <line x1="150" y1="150" x2="220" y2="80" stroke="currentColor" strokeWidth="2.5" className="text-primary opacity-40" />
              <line x1="150" y1="150" x2="150" y2="240" stroke="currentColor" strokeWidth="2.5" className="text-primary opacity-40" />

              {/* Connexions entre satellites */}
              <line x1="80" y1="80" x2="220" y2="80" stroke="currentColor" strokeWidth="2" className="text-border opacity-50" strokeDasharray="6,4" />
              <line x1="80" y1="80" x2="150" y2="240" stroke="currentColor" strokeWidth="2" className="text-border opacity-50" strokeDasharray="6,4" />
              <line x1="220" y1="80" x2="150" y2="240" stroke="currentColor" strokeWidth="2" className="text-border opacity-50" strokeDasharray="6,4" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans mb-4">Conçu pour les équipes B2B</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour une communication d'équipe sécurisée et organisée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">⚡</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans mb-2">Conversations temps réel</h3>
                <p className="text-muted-foreground">
                  Échanges instantanés sans latence. Chaque message arrive au moment où il compte.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/10">
                  <span className="text-secondary font-bold text-lg">👥</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans mb-2">Groupes et rôles</h3>
                <p className="text-muted-foreground">
                  Organisez vos discussions. Définissez les rôles et contrôlez qui peut faire quoi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">🔒</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans mb-2">Sécurité native</h3>
                <p className="text-muted-foreground">
                  Auth native dès le démarrage. Permissions granulaires et audit complet.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/10">
                  <span className="text-secondary font-bold text-lg">🚀</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sans mb-2">Flexibilité totale</h3>
                <p className="text-muted-foreground">
                  Hébergé, self-hosted ou hybride. API complète pour l'intégration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans mb-4">Tarification transparent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {/* Starter */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Pour démarrer</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-6">
                <div>
                  <span className="text-4xl font-bold">Gratuit</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Jusqu'à 3 utilisateurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>5 groupes de discussion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Historique 7 jours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-muted-foreground font-bold mt-0.5">✗</span>
                    <span className="text-muted-foreground">Intégrations API</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-auto" nativeButton={false} render={<Link href="/auth/inscription" />}>
                  Commencer
                </Button>
              </CardContent>
            </Card>

            {/* Professional - Highlighted */}
            <Card className="border-2 border-primary flex flex-col lg:scale-105 lg:z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                Populaire
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professionnel</CardTitle>
                <CardDescription>Pour les équipes</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-6">
                <div>
                  <span className="text-4xl font-bold">29€</span>
                  <span className="text-muted-foreground text-sm">/mois</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Jusqu'à 50 utilisateurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Groupes illimités</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Historique illimité</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Intégrations API</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button className="w-full mt-auto" nativeButton={false} render={<Link href="/auth/inscription" />}>
                  Commencer l'essai
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Entreprise</CardTitle>
                <CardDescription>Solution personnalisée</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-6">
                <div>
                  <span className="text-4xl font-bold">Sur devis</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Self-hosted ou cloud</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>SSO & SAML</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>SLA garanti</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Support dédié 24/7</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-auto">
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Prêt à transformer votre communication d'équipe ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Commencez gratuitement. Aucune carte bancaire requise.
          </p>
          <Button size="lg" nativeButton={false} render={<Link href="/auth/inscription" />}>
            Démarrer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="text-xl font-bold font-sans text-primary mb-4">Helix</div>
              <p className="text-sm text-muted-foreground">
                Messagerie temps réel pour les équipes B2B.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                <a href="mailto:hello@relai.app" className="hover:text-primary transition-colors">
                  hello@relai.app
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Helix. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
