import type { CSSProperties } from "react"
import type { ConversationType } from "@/lib/types"

const BASE_HUES: Record<ConversationType, number> = {
  INFO: 38,
  PUBLIC: 205,
  GROUP: 275,
  PRIVATE: 150,
}

export function hashString(value: string) {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

function hueFor(id: string, type: ConversationType) {
  return (BASE_HUES[type] + (hashString(id) % 50) - 25 + 360) % 360
}

export function planetStyle(id: string, type: ConversationType, dim = false): CSSProperties {
  const hue = hueFor(id, type)
  const light = dim ? 38 : 62
  const mid = dim ? 22 : 38

  return {
    background: `radial-gradient(circle at 30% 28%, hsl(${hue} 70% ${light}%), hsl(${hue} 55% ${mid}%) 55%, hsl(${hue} 60% 8%) 100%)`,
    boxShadow: `0 0 40px -6px hsl(${hue} 90% 60% / 0.55), inset -12px -16px 40px hsl(${hue} 60% 5% / 0.6)`,
  }
}

export function sunStyle(): CSSProperties {
  return {
    background:
      "radial-gradient(circle at 45% 42%, #fffdf2 0%, #ffe08a 30%, #ffae3d 62%, #e5621f 100%)",
    boxShadow:
      "0 0 30px 8px rgba(255, 190, 80, 0.7), 0 0 90px 30px rgba(255, 140, 40, 0.35), 0 0 180px 60px rgba(255, 110, 30, 0.15)",
  }
}

export function galaxyHue(id: string) {
  return hashString(id) % 360
}
