"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/google-icon"

export function GoogleButton({ loadingLabel }: { loadingLabel: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await authClient.signIn.social({ provider: "google", callbackURL: "/discussion" })
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={handleClick}
        className="w-full"
      >
        <GoogleIcon className="h-4 w-4 mr-2" />
        {loading ? loadingLabel : "Google"}
      </Button>
    </>
  )
}
