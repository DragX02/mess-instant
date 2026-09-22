"use client"

import type { Dispatch, SetStateAction } from "react"
import type { ConversationItem, CurrentUser } from "@/lib/types"
import { hashString, planetStyle, sunStyle } from "./planet-style"
import { SpaceViewport } from "./space-viewport"
import type { Camera } from "./use-camera"
import { UserStar } from "./user-star"

/** Nombre de planètes sur l'orbite la plus proche ; chaque orbite suivante en accueille 4 de plus. */
const FIRST_RING_CAPACITY = 6

/** Répartit les planètes sur des orbites concentriques : [6, 10, 14…] au maximum. */
function ringSizes(count: number) {
  const sizes: number[] = []
  let capacity = FIRST_RING_CAPACITY

  for (let remaining = count; remaining > 0; remaining -= capacity, capacity += 4) {
    sizes.push(Math.min(remaining, capacity))
  }
  return sizes
}

/** Position stable d'une étoile, tirée de son identifiant, à l'écart du centre. */
function starPosition(id: string) {
  const hash = hashString(id)
  const angle = ((hash % 360) * Math.PI) / 180
  const distance = 0.2 + ((hash >>> 9) % 100) / 360 // entre 0,2 et 0,47
  return {
    left: `calc(50% + ${(Math.cos(angle) * distance * 100).toFixed(2)}cqw)`,
    top: `calc(50% + ${(Math.sin(angle) * distance * 100).toFixed(2)}cqh)`,
  }
}

export type GalaxyStar = { id: string; name: string }

/**
 * Une galaxie vue comme un système solaire : le soleil (canal #info) au centre,
 * les canaux en planètes sur leurs orbites, les membres en étoiles tout autour.
 * Sans soleil (galaxie des messages privés), c'est l'étoile de l'utilisateur qui est au centre.
 */
export function Galaxy({
  user,
  sun,
  planets,
  stars,
  camera,
  onCameraChange,
  onSelect,
}: {
  user: CurrentUser | null
  sun: ConversationItem | undefined
  planets: ConversationItem[]
  stars: GalaxyStar[]
  camera: Camera
  onCameraChange: Dispatch<SetStateAction<Camera>>
  onSelect: (id: string) => void
}) {
  const rings = ringSizes(planets.length)

  return (
    <SpaceViewport
      camera={camera}
      onCameraChange={onCameraChange}
      hint={
        sun || planets.length > 0
          ? "Cliquez sur le soleil ou une planète pour lire ses messages"
          : undefined
      }
    >
      {/* Les étoiles (membres) sont derrière les planètes et ne captent pas les clics. */}
      {stars.map((star) => (
        <div
          key={"star-" + star.id}
          style={starPosition(star.id)}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        >
          {star.id === user?.id ? (
            <UserStar name={star.name} size={30} />
          ) : (
            <UserStar name={star.name} size={16} variant="other" />
          )}
        </div>
      ))}

      {rings.map((size, ring) => {
        // La première orbite laisse la place au soleil, les suivantes s'écartent jusqu'au bord.
        const fraction = 0.3 + (0.7 * (ring + 1)) / rings.length
        const rx = fraction * 40
        const ry = fraction * 36
        const first = rings.slice(0, ring).reduce((total, count) => total + count, 0)

        const orbit = (
          <div
            key={"orbit-" + ring}
            aria-hidden
            style={{ width: `${2 * rx}cqw`, height: `${2 * ry}cqh` }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
          />
        )

        const items = Array.from({ length: size }, (_, position) => {
          const index = first + position
          const conversation = planets[index]
          // Décalage par orbite pour que les planètes ne s'alignent pas en rayons.
          const angle = ((-90 + (position * 360) / size + ring * 25) * Math.PI) / 180

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation.id)}
              style={{
                left: `calc(50% + ${(Math.cos(angle) * rx).toFixed(2)}cqw)`,
                top: `calc(50% + ${(Math.sin(angle) * ry).toFixed(2)}cqh)`,
                animationDelay: `${-index * 1.1}s`,
              }}
              className="group absolute flex animate-float flex-col items-center gap-1.5 focus-visible:outline-none"
            >
              <span
                style={planetStyle(conversation.id, conversation.type)}
                className="block size-[clamp(36px,8cqmin,72px)] rounded-full transition-transform duration-300 group-hover:scale-115 group-focus-visible:scale-115 group-focus-visible:ring-2 group-focus-visible:ring-white/70"
              />
              <span className="max-w-28 truncate text-xs text-white/75 group-hover:text-white">
                {conversation.type === "PUBLIC" ? "#" + conversation.name : conversation.name}
              </span>
            </button>
          )
        })

        return [orbit, ...items]
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {sun ? (
          <button
            type="button"
            onClick={() => onSelect(sun.id)}
            className="group flex flex-col items-center gap-2 focus-visible:outline-none"
          >
            <span
              style={sunStyle()}
              className="block size-[clamp(64px,15cqmin,132px)] rounded-full transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white/70"
            />
            <span className="text-sm font-semibold text-amber-100">#{sun.name}</span>
          </button>
        ) : (
          user && <UserStar name={user.name} size={64} />
        )}
      </div>
    </SpaceViewport>
  )
}
