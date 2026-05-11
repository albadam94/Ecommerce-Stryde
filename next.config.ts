import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Permite imágenes locales sin restricciones
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
}

export default nextConfig