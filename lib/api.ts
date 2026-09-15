export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: FormData | Record<string, unknown>
}

/**
 * Appelle une route de l'API et renvoie toujours un résultat exploitable :
 * `{ ok: true, data }` en cas de succès, `{ ok: false, error }` avec le message
 * renvoyé par le serveur sinon. Évite de répéter fetch / JSON.stringify / response.ok
 * dans chaque composant.
 */
export async function api<T>(url: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
  const { method = "GET", body } = options
  const isFormData = body instanceof FormData

  const response = await fetch(url, {
    method,
    headers: body && !isFormData ? { "Content-Type": "application/json" } : undefined,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = data && typeof data.error === "string" ? data.error : "Une erreur est survenue."
    return { ok: false, error }
  }

  return { ok: true, data: data as T }
}

/** Raccourci pour les appels dont on ignore la réponse (PATCH / DELETE). */
export async function apiSend(url: string, method: "POST" | "PATCH" | "DELETE") {
  return api<{ ok: boolean }>(url, { method })
}
