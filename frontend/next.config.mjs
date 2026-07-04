/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "s3-symbol-logo.tradingview.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // --- TAMBAHAN BARU UNTUK PROXY API KE FASTAPI ---
  async rewrites() {
    return [
      {
        // Jika frontend melakukan fetch ke /api/proxy/market/snapshot
        source: "/api/proxy/:path*",
        // Next.js akan meneruskannya ke backend Uvicorn di port 8080 secara rahasia
        destination: "http://127.0.0.1:8080/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;