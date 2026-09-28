import { Logo } from "@/components/logo"

export function StatusPage({
  symbol,
  symbolClassName,
  title,
  description,
  children,
}: {
  symbol: string
  symbolClassName: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="max-w-md text-center space-y-8">
        <Logo href="/" full className="flex justify-center mb-8" />

        <div className="space-y-4">
          <h1 className={`text-6xl font-bold ${symbolClassName}`}>{symbol}</h1>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {children}
      </div>
    </div>
  )
}
