/**
 * Fait voler une copie de la bulle de brouillon jusqu'au centre de la planète,
 * puis fait « vibrer » la planète à l'impact. Résout la promesse une fois l'animation finie.
 */
export async function launchBubble(bubble: HTMLElement, planet: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return
  }

  const from = bubble.getBoundingClientRect()
  const to = planet.getBoundingClientRect()
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  const clone = bubble.cloneNode(true) as HTMLElement
  Object.assign(clone.style, {
    position: "fixed",
    left: from.left + "px",
    top: from.top + "px",
    width: from.width + "px",
    height: from.height + "px",
    margin: "0",
    zIndex: "50",
    pointerEvents: "none",
    animation: "none",
  })
  document.body.appendChild(clone)

  try {
    // Trajectoire en arc : la bulle monte d'abord un peu sur le côté avant de plonger.
    await clone.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.3}px, ${dy * 0.5 - 60}px) scale(0.75)`,
          opacity: 1,
          offset: 0.45,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.05)`, opacity: 0.2 },
      ],
      { duration: 800, easing: "cubic-bezier(0.45, 0, 0.3, 1)" },
    ).finished
  } catch {
    // Animation interrompue (onglet caché, etc.) : rien à faire.
  } finally {
    clone.remove()
  }

  planet.animate(
    [
      { transform: "scale(1)", filter: "brightness(1)" },
      { transform: "scale(1.025)", filter: "brightness(1.35)" },
      { transform: "scale(1)", filter: "brightness(1)" },
    ],
    { duration: 450, easing: "ease-out" },
  )
}
