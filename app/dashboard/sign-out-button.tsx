"use client"

import { useSignOut } from "@/hooks/use-sign-out"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const signOut = useSignOut()

  return (
    <Button variant="outline" onClick={signOut}>
      Se déconnecter
    </Button>
  )
}
