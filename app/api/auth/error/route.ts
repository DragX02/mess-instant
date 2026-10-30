import { redirect } from "next/navigation"
import { codeErreurAuth } from "@/lib/auth-errors"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = codeErreurAuth(searchParams.get("error"))

  // On ne transmet que le code connu : jamais error_description ni texte libre.
  redirect(code ? `/auth/error?error=${code}` : "/auth/error")
}
