import { getCurrentUser } from "@/lib/chat"
import { abonner } from "@/lib/temps-reel"

export async function GET(request: Request) {
  const user = await getCurrentUser()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      function ecrire(texte: string) {
        try {
          controller.enqueue(encoder.encode(texte))
        } catch {
          fermer()
        }
      }

      const desabonner = abonner({
        userId: user ? user.id : null,
        envoyer: (evenement) => ecrire("data: " + JSON.stringify(evenement) + "\n\n"),
      })

      const ping = setInterval(() => ecrire(": ping\n\n"), 25000)

      function fermer() {
        clearInterval(ping)
        desabonner()
      }

      request.signal.addEventListener("abort", fermer)
      ecrire("retry: 3000\n\n")
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
