// Protection des URL contre les tentatives d'injection (SQL, XSS, traversée de chemin...).
// Deux niveaux :
//  1. liste blanche : chaque segment de chemin et chaque identifiant doit avoir un format connu ;
//  2. liste noire : motifs d'attaque courants repérés dans le chemin et la query, décodés.
// La liste blanche est la vraie défense (Prisma paramètre déjà toutes les requêtes) ;
// la liste noire sert à rejeter tôt et à laisser une trace.

export const LONGUEUR_URL_MAX = 2048

// Identifiants cuid de Prisma ou fixes ("general", "info", "helix") : lettres, chiffres, - et _.
const FORMAT_ID = /^[A-Za-z0-9_-]{1,64}$/

// Segments de chemin autorisés (pages, routes API, fichiers statiques).
const FORMAT_SEGMENT = /^[A-Za-z0-9._~-]{1,128}$/

// Nom d'un fichier uploadé : UUID + extension éventuelle.
const FORMAT_FICHIER =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\.[A-Za-z0-9]{0,10})?$/i

export function idValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && FORMAT_ID.test(valeur)
}

export function nomFichierValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && FORMAT_FICHIER.test(valeur)
}

const MOTIFS_ATTAQUE: RegExp[] = [
  // caractères de rupture : guillemets, chevrons, antislash, point-virgule, backtick
  /[<>"'`\\;]/,
  // caractères de contrôle et octet nul
  /[\u0000-\u001f\u007f]/,
  // traversée de chemin
  /\.\.(\/|$)|(^|\/)\.\./,
  // commentaires SQL en bloc, expressions ${} et {{}}
  /\/\*|\*\/|\$\{|\{\{/,
  // schémas dangereux
  /\b(javascript|vbscript|data)\s*:/i,
  // mots-clés SQL en séquence
  /\bunion\b[\s\S]{0,20}\bselect\b/i,
  /\bselect\b[\s\S]{1,200}\bfrom\b/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
  /\bdrop\s+(table|database|schema)\b/i,
  /\bupdate\b[\s\S]{1,100}\bset\b/i,
  /\b(information_schema|pg_catalog|pg_sleep|pg_read_file|xp_cmdshell|load_file|into\s+outfile)\b/i,
  /\b(sleep|benchmark|waitfor\s+delay)\s*\(/i,
  // tautologies : or 1=1, and 1=1
  /\b(or|and)\b\s+\d+\s*=\s*\d+/i,
]

// Décode jusqu'à 3 fois (double encodage). Retourne null si l'encodage est invalide.
function decoder(valeur: string) {
  const etapes = [valeur]
  let courant = valeur

  for (let i = 0; i < 3; i++) {
    let suivant: string
    try {
      suivant = decodeURIComponent(courant.replace(/\+/g, " "))
    } catch {
      return null
    }
    if (suivant === courant) {
      break
    }
    etapes.push(suivant)
    courant = suivant
  }

  return etapes
}

export function contientMotifAttaque(valeur: string) {
  const etapes = decoder(valeur)

  if (etapes === null) {
    return true
  }

  return etapes.some((etape) => MOTIFS_ATTAQUE.some((motif) => motif.test(etape)))
}

export function segmentsValides(chemin: string) {
  const segments = chemin.split("/")

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    // segment vide autorisé seulement au début ("/x") et à la fin ("/x/")
    if (segment === "") {
      if (i === 0 || i === segments.length - 1) {
        continue
      }
      return false
    }

    if (segment === "." || segment === ".." || !FORMAT_SEGMENT.test(segment)) {
      return false
    }

    // Fichiers cachés (.env, .git...) : jamais légitimes dans une URL, sauf .well-known.
    // Couvre aussi les "../" que new URL() normalise avant que le proxy ne les voie.
    if (segment.startsWith(".") && segment !== ".well-known") {
      return false
    }
  }

  return true
}

// Retourne la raison du rejet, ou null si l'URL est acceptable.
export function verifierUrl(url: URL): string | null {
  if (url.pathname.length + url.search.length > LONGUEUR_URL_MAX) {
    return "url-trop-longue"
  }

  if (!segmentsValides(url.pathname)) {
    return "chemin-invalide"
  }

  if (contientMotifAttaque(url.pathname + url.search)) {
    return "motif-suspect"
  }

  return null
}
