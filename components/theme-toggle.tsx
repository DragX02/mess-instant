"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { IconButton } from "@/components/ui/icon-button"

function subscribe() {
  return () => {}
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const mounted = useMounted()
  const { theme, setTheme } = useTheme()

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const dark = theme === "dark"

  return (
    <IconButton
      label="Changer de thème"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
    >
      {dark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
    </IconButton>
  )
}
