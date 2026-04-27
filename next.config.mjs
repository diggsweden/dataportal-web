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

// `createNextIntlPlugin` wires the App Router message loader (`i18n/request.ts`).
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const coreNextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
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
