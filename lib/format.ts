/** Formate une date ISO en « Aujourd'hui à 14:02 » ou « 12/09/2026 à 14:02 ». */
export function formatMessageDate(date: string) {
  const messageDate = new Date(date)
  const time = messageDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  if (messageDate.toDateString() === new Date().toDateString()) {
    return "Aujourd'hui à " + time
  }

  return messageDate.toLocaleDateString("fr-FR") + " à " + time
}

export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(total / 60)
  const reste = total % 60

  return minutes + ":" + String(reste).padStart(2, "0")
}
