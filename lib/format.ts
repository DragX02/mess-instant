/** Formate une date ISO en « Aujourd'hui à 14:02 » ou « 12/09/2026 à 14:02 ». */
export function formatMessageDate(date: string) {
  const messageDate = new Date(date)
  const time = messageDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  if (messageDate.toDateString() === new Date().toDateString()) {
    return "Aujourd'hui à " + time
  }

  return messageDate.toLocaleDateString("fr-FR") + " à " + time
}
