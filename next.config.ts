import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imagen mínima para desplegar con Docker o en cualquier host Node.
  // En Vercel sobra, así que solo se activa fuera de allí.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  poweredByHeader: false,
  images: {
    // AVIF primero (más ligero), WebP de respaldo.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Anchos que de verdad pide la maqueta (del móvil al lienzo de 1920 a 2x).
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|webp|avif|png|jpg|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
