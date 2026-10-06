"use client"

import { useEffect, useEffectEvent } from "react"
import type { EvenementTempsReel } from "@/lib/types"

export function useTempsReel(onEvenement: (evenement: EvenementTempsReel) => void, cle: string) {
  const recevoir = useEffectEvent(onEvenement)

  useEffect(() => {
    const source = new EventSource("/api/evenements")
    let dejaOuvert = false

    source.onopen = () => {
      if (dejaOuvert) {
        recevoir({ type: "donnees" })
      }
      dejaOuvert = true
    }

    source.onmessage = (message) => {
      recevoir(JSON.parse(message.data))
    }

    return () => source.close()
  }, [cle])
}
