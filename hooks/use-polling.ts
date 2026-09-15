"use client"

import { useEffect, type DependencyList } from "react"

/**
 * Appelle `load` immédiatement, puis toutes les `intervalMs` millisecondes.
 *
 * `load` reçoit `isActive` : renvoie `false` dès que l'effet est nettoyé (changement
 * de conversation, démontage), ce qui permet d'ignorer une réponse arrivée trop tard.
 */
export function usePolling(
  load: (isActive: () => boolean) => Promise<void> | void,
  intervalMs: number,
  deps: DependencyList,
) {
  useEffect(() => {
    let active = true
    const isActive = () => active
    const run = () => load(isActive)

    run()
    const timer = setInterval(run, intervalMs)

    return () => {
      active = false
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
