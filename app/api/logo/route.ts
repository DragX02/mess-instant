import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    const logoPath = join(process.cwd(), "public", "logo-full.png")
    const imageBuffer = readFileSync(logoPath)

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400", // 24h cache
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Logo API error:", error)
    return new Response("Logo not found", { status: 404 })
  }
}
