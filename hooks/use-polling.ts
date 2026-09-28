"use client"

import { useEffect, type DependencyList } from "react"

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
  }, deps)
}
