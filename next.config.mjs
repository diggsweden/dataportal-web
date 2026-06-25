import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */

const baseHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  {
    key: "Access-Control-Allow-Origin",
    value:
      "https://www.dataportal.se https://webbanalys.digg.se https://cdn.screen9.com",
  },
];

const csp = [
  {
    key: "Content-Security-Policy",
    value: `frame-ancestors 'none';`,
  },
];

// `createNextIntlPlugin` wires the App Router message loader
// (`i18n/request.ts`). We intentionally do NOT set Next's native Pages Router
// `i18n` option here: it's incompatible with the App Router and `next-intl`
// logs a warning when both are present. During the migration, Pages Router
// routes are effectively Swedish-only (callers read `useLocale()` from
// `next-intl`, which resolves to `routing.defaultLocale` outside `app/`);
// `/en` gets re-enabled per-route as each tree moves under `app/[locale]/`.
// See `docs/next15-app-router-migration.md` for the full rollout.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const coreNextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "swagger-client/es/resolver/strategies/openapi-3-1-apidom":
        "swagger-client/es/resolver/strategies/openapi-3-0",
    },
  },
  // Keep Node-only deps out of the browser bundle. `winston` and the
  // logstash transport import `net`/`tls`/`fs`; with Turbopack default in
  // Next 16 there's no implicit `resolve.fallback: false` shim, so they
  // crash the build when transitively imported from `pages/_error.tsx`.
  serverExternalPackages: ["winston", "@alfalab/winston3-logstash-transport"],
  productionBrowserSourceMaps: true,
  env: {
    REVALIDATE_INTERVAL: process.env.REVALIDATE_INTERVAL,
  },

  staticPageGenerationTimeout: 240,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.IMAGE_DOMAIN || "localhost",
      },
      { protocol: "https", hostname: "bcdn.screen9.com" },
    ],
    deviceSizes: [640, 1080, 1200, 1920],
    imageSizes: [128, 384],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 604800,
  },

  async redirects() {
    return [
      {
        source: "/fortroendemodellen",
        destination: "https://fortroendemodellen.dataportal.se/",
        permanent: true,
      },
      {
        source: "/fortroendemodellen/:path*",
        destination: "https://fortroendemodellen.dataportal.se/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...baseHeaders, ...csp],
      },
      {
        source: "/",
        headers: [...baseHeaders, ...csp],
      },
    ];
  },
};

export default withNextIntl(coreNextConfig);
