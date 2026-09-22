import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  const params = new URLSearchParams()
  if (error) params.append("error", error)
  if (error_description) params.append("error_description", error_description)

  redirect(`/auth/error?${params.toString()}`)
}
