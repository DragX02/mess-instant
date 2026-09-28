"use client"

import type { Dispatch, SetStateAction } from "react"
import { galaxyHue } from "./planet-style"
import { SpaceViewport } from "./space-viewport"
import type { Camera } from "./use-camera"

export type UniverseGalaxy = {
  id: string
  name: string
  detail: string
}

function GalaxyGlyph({ id }: { id: string }) {
  const hue = galaxyHue(id)
  const arm = `hsl(${hue} 85% 70% / 0.75)`

  return (
    <span className="relative block size-[clamp(96px,22cqmin,190px)] scale-y-[0.6] transition-transform duration-300 group-hover:scale-x-110 group-hover:scale-y-[0.66]">
      <span
        className="absolute inset-0 animate-spin-slow rounded-full blur-[2px]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${arm} 50deg, transparent 110deg, transparent 180deg, ${arm} 230deg, transparent 290deg)`,
          maskImage: "radial-gradient(circle, #000 15%, transparent 70%)",
        }}
      />
      <span
        className="absolute inset-[8%] animate-spin-slow rounded-full opacity-70 blur-[6px] [animation-direction:reverse]"
        style={{
          background: `conic-gradient(from 90deg, transparent, hsl(${(hue + 40) % 360} 80% 65% / 0.6) 60deg, transparent 140deg, transparent 180deg, hsl(${(hue + 40) % 360} 80% 65% / 0.6) 240deg, transparent 320deg)`,
          maskImage: "radial-gradient(circle, #000 20%, transparent 70%)",
        }}
      />
      <span
        className="absolute inset-[38%] rounded-full"
        style={{
          background: `radial-gradient(circle, #fff 0%, hsl(${hue} 90% 85%) 45%, transparent 75%)`,
          boxShadow: `0 0 40px 12px hsl(${hue} 90% 70% / 0.45)`,
        }}
      />
    </span>
  )
}

export function Universe({
  galaxies,
  camera,
  onCameraChange,
  onEnter,
}: {
  galaxies: UniverseGalaxy[]
  camera: Camera
  onCameraChange: Dispatch<SetStateAction<Camera>>
  onEnter: (id: string) => void
}) {
  return (
    <SpaceViewport
      camera={camera}
      onCameraChange={onCameraChange}
      hint="Cliquez sur une galaxie pour y entrer"
    >
      {galaxies.map((galaxy, index) => {
        const angle = ((-90 + (index * 360) / galaxies.length) * Math.PI) / 180
        const radius = galaxies.length > 1 ? 1 : 0

        return (
          <button
            key={galaxy.id}
            type="button"
            onClick={() => onEnter(galaxy.id)}
            style={{
              left: `calc(50% + ${(Math.cos(angle) * 30 * radius).toFixed(2)}cqw)`,
              top: `calc(50% + ${(Math.sin(angle) * 28 * radius).toFixed(2)}cqh)`,
              animationDelay: `${-index * 1.7}s`,
            }}
            className="group absolute flex animate-float flex-col items-center gap-1 focus-visible:outline-none"
          >
            <GalaxyGlyph id={galaxy.id} />
            <span className="max-w-40 truncate text-sm font-semibold text-white group-hover:text-amber-100 group-focus-visible:underline">
              {galaxy.name}
            </span>
            <span className="text-[11px] text-white/55">{galaxy.detail}</span>
          </button>
        )
      })}
    </SpaceViewport>
  )
}
