import { cn } from "cn"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export function AuthCard({
  title,
  description,
  titleClassName,
  children,
}: {
  title: string
  description: string
  titleClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header with logo */}
      <header className="px-8 py-6 border-b border-border">
        <Logo href="/" withText size="md" />
      </header>

      {/* Main content - Split layout */}
      <div className="flex-1 flex">
        {/* Left section - Hero content */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-12 py-16">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Decorative circles with logo */}
            <div className="relative w-64 h-64 mb-12 flex items-center justify-center flex-shrink-0">
              {/* Decorative circles */}
              <div className="absolute w-56 h-56 rounded-full border border-orange-500/15"></div>
              <div className="absolute w-40 h-40 rounded-full border border-orange-500/20"></div>
              <div className="absolute w-24 h-24 rounded-full border border-orange-500/30"></div>
              {/* Logo in center */}
              <Logo href="/" size="lg" />
            </div>

            {/* Text content */}
            <h2 className="text-4xl font-bold mb-4 text-white text-center leading-tight">
              La messagerie de votre équipe, en temps réel.
            </h2>
            <p className="text-base text-muted-foreground text-center">
              Échangez, partagez et avancez ensemble dans un espace de travail unique et sécurisé.
            </p>
          </div>
        </div>

        {/* Right section - Form card */}
        <div className="flex-1 flex items-center justify-center px-8 py-16 bg-card/30">
          <Card className="w-full max-w-md rounded-[var(--radius)] border-0 shadow-lg">
            <CardHeader className="flex flex-col pt-8">
              <div className="lg:hidden mb-6 flex justify-center">
                <Logo href="/" withText size="md" />
              </div>
              <CardTitle className={cn("text-2xl", titleClassName)}>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
