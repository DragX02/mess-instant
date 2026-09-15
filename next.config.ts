import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Autorise l'accès au serveur de dev depuis l'IP réseau de la machine
  // (sinon Next bloque /_next/hmr et le rechargement à chaud ne marche pas).
  allowedDevOrigins: ["169.254.83.107"],
}

export default nextConfig
