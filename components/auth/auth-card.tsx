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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <Card className="w-full max-w-md rounded-[var(--radius)]">
        <CardHeader className="flex flex-col items-center pt-8">
          <Logo href="/" full className="mb-6" />
          <CardTitle className={cn("text-2xl", titleClassName)}>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
