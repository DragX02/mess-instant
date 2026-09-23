export function erreur(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export function nonConnecte() {
  return erreur("Vous devez être connecté.", 401)
}

export function actionImpossible() {
  return erreur("Action impossible.", 403)
}

export function ok() {
  return Response.json({ ok: true })
}
