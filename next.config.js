/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type-check during builds
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint during builds
    ignoreDuringBuilds: false,
  },
  images: {
    // Optimisations d'images pour SEO
    remotePatterns: [],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimisations pour Vercel et SEO
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Optimisations de performance pour SEO
  swcMinify: true,

  // Headers pour SEO et sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/data/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source:
          "/static/:path*\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirections pour SEO
  async redirects() {
    return [
      {
        source: "/prenoms-brevet",
        destination: "/",
        permanent: true,
      },
      {
        source: "/nuage-prenoms",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Gestion des assets statiques avec optimisations SEO
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",

  // Optimisation du bundle pour de meilleures performances
  outputFileTracing: true,

  // Optimisations webpack pour de meilleures performances
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour la production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
