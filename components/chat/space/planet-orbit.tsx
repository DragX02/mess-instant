"use client"

import type { ConversationItem } from "@/lib/types"
import { planetStyle, sunStyle } from "./planet-style"

/** Ouverture maximale (en degrés) des arcs gauche et droit où sont placées les petites planètes. */
const MAX_SPREAD = 50

/** Position d'une planète : moitié à droite, moitié à gauche, en éventail sur une ellipse. */
function position(index: number, count: number) {
  const onRight = index % 2 === 0
  const sideIndex = Math.floor(index / 2)
  const sideCount = Math.ceil((onRight ? count : count - 1) / 2)
  const step = sideCount > 1 ? (2 * MAX_SPREAD) / (sideCount - 1) : 0
  const degrees = sideCount > 1 ? -MAX_SPREAD + sideIndex * step : 0
  const angle = (degrees * Math.PI) / 180
  const x = Math.cos(angle) * 44 * (onRight ? 1 : -1)
  const y = Math.sin(angle) * 38

  return { left: `calc(50% + ${x.toFixed(2)}cqw)`, top: `calc(50% + ${y.toFixed(2)}cqh)` }
}

/** Les autres conversations, en petites planètes flottant autour de la planète ouverte. */
export function PlanetOrbit({
  conversations,
  onSelect,
}: {
  conversations: ConversationItem[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {conversations.map((conversation, index) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation.id)}
          title={conversation.name || ""}
          style={{
            ...position(index, conversations.length),
            animationDelay: `${-index * 1.3}s`,
          }}
          className="group pointer-events-auto absolute flex animate-float flex-col items-center gap-1 focus-visible:outline-none"
        >
          <span
            style={
              conversation.type === "INFO"
                ? sunStyle()
                : planetStyle(conversation.id, conversation.type, true)
            }
            className="block h-11 w-11 rounded-full transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-white/70"
          />
          <span className="max-w-24 truncate text-[11px] text-white/60 group-hover:text-white">
            {conversation.name}
          </span>
        </button>
      ))}
    </div>
  )
}
