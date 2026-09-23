"use client"

import { useRef, type Dispatch, type SetStateAction } from "react"
import { LocateFixed, ZoomIn, ZoomOut } from "lucide-react"
import {
  DEFAULT_CAMERA,
  MAX_SCALE,
  MIN_SCALE,
  useCamera,
  zoomCamera,
  type Camera,
} from "./use-camera"

export function SpaceViewport({
  camera,
  onCameraChange,
  hint,
  children,
}: {
  camera: Camera
  onCameraChange: Dispatch<SetStateAction<Camera>>
  hint?: string
  children: React.ReactNode
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cameraHandlers = useCamera(viewportRef, onCameraChange)

  function zoomBy(factor: number) {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (rect) {
      onCameraChange((current) => zoomCamera(current, factor, rect.width / 2, rect.height / 2))
    }
  }

  return (
    <div
      ref={viewportRef}
      {...cameraHandlers}
      className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})` }}
        className="absolute inset-0 origin-top-left"
      >
        {children}
      </div>

      <div
        className="absolute right-3 bottom-3 z-10 flex flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/10 p-1 text-white backdrop-blur-md"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ZoomButton
          label="Zoomer"
          disabled={camera.scale >= MAX_SCALE}
          onClick={() => zoomBy(1.25)}
        >
          <ZoomIn className="h-4 w-4" />
        </ZoomButton>
        <span className="font-mono text-[10px] text-white/70">
          {Math.round(camera.scale * 100)}%
        </span>
        <ZoomButton
          label="Dézoomer"
          disabled={camera.scale <= MIN_SCALE}
          onClick={() => zoomBy(1 / 1.25)}
        >
          <ZoomOut className="h-4 w-4" />
        </ZoomButton>
        <ZoomButton label="Recentrer" onClick={() => onCameraChange(DEFAULT_CAMERA)}>
          <LocateFixed className="h-4 w-4" />
        </ZoomButton>
      </div>

      {hint && (
        <p className="pointer-events-none absolute inset-x-0 bottom-3 px-16 text-center text-xs text-white/50">
          {hint}
        </p>
      )}
    </div>
  )
}

function ZoomButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
