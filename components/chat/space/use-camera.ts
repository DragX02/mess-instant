"use client"

import {
  useEffect,
  useRef,
  type Dispatch,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  type SetStateAction,
} from "react"

export type Camera = { x: number; y: number; scale: number }

export const DEFAULT_CAMERA: Camera = { x: 0, y: 0, scale: 1 }
export const MIN_SCALE = 0.4
export const MAX_SCALE = 3

const DRAG_THRESHOLD = 5

export function zoomCamera(camera: Camera, factor: number, px: number, py: number): Camera {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, camera.scale * factor))
  const ratio = scale / camera.scale

  return {
    scale,
    x: px - (px - camera.x) * ratio,
    y: py - (py - camera.y) * ratio,
  }
}

type Point = { x: number; y: number }

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function useCamera(
  ref: RefObject<HTMLElement | null>,
  setCamera: Dispatch<SetStateAction<Camera>>,
) {
  const pointers = useRef(new Map<number, Point>())
  const origin = useRef<Point>({ x: 0, y: 0 })
  const dragged = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const rect = element!.getBoundingClientRect()
      const factor = Math.exp(-event.deltaY * 0.0015)
      setCamera((camera) =>
        zoomCamera(camera, factor, event.clientX - rect.left, event.clientY - rect.top),
      )
    }

    element.addEventListener("wheel", onWheel, { passive: false })
    return () => element.removeEventListener("wheel", onWheel)
  }, [ref, setCamera])

  function local(event: PointerEvent<HTMLElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    const point = local(event)
    pointers.current.set(event.pointerId, point)
    if (pointers.current.size === 1) {
      origin.current = point
      dragged.current = false
    }
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) {
      return
    }

    const point = local(event)

    if (pointers.current.size === 1) {
      if (!dragged.current && distance(point, origin.current) > DRAG_THRESHOLD) {
        dragged.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      if (dragged.current) {
        setCamera((camera) => ({
          ...camera,
          x: camera.x + point.x - previous.x,
          y: camera.y + point.y - previous.y,
        }))
      }
    } else if (pointers.current.size === 2) {
      const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)![1]
      const factor = distance(point, other) / Math.max(1, distance(previous, other))
      const middle = { x: (point.x + other.x) / 2, y: (point.y + other.y) / 2 }
      dragged.current = true
      setCamera((camera) => zoomCamera(camera, factor, middle.x, middle.y))
    }

    pointers.current.set(event.pointerId, point)
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    pointers.current.delete(event.pointerId)
  }

  function onClickCapture(event: MouseEvent<HTMLElement>) {
    if (dragged.current) {
      event.stopPropagation()
      event.preventDefault()
      dragged.current = false
    }
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onPointerLeave: onPointerUp,
    onClickCapture,
  }
}
