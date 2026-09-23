"use client"

import { useSyncExternalStore } from "react"

export type UiTheme = "classique" | "univers"

const STORAGE_KEY = "helix-interface"
const EVENT = "helix-interface-change"

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)

  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

function readTheme(): UiTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "univers" ? "univers" : "classique"
  } catch {
    return "classique"
  }
}

function defaultTheme(): UiTheme {
  return "classique"
}

export function useUiTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, defaultTheme)

  function apply(next: UiTheme) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }

    window.dispatchEvent(new Event(EVENT))
  }

  return { theme, apply }
}
