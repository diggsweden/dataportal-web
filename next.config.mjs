import createNextIntlPlugin from "next-intl/plugin";
import nextTranslate from "next-translate-plugin";

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

// Plugin chain (apply order matters):
//   1. `createNextIntlPlugin("./i18n/request.ts")` wires `next-intl` server config.
//   2. `nextTranslate(..., { turbopack: true })` injects the legacy `i18n` key
//      that `next-translate` (still used by `pages/`) requires. Applying
//      `next-intl` first keeps it from seeing that key and erroring out with
//      "An i18n property was found in your Next.js config".
// `next-translate-plugin` requires `{ turbopack: true }` on Next 16 so it
// registers its `t()` rewrite loader under Turbopack (the default bundler).
// Without it, `t()` calls render as raw keys (e.g. `common|dataportal`).
// NOTE: with turbopack: true the plugin strips any `webpack` config you pass,
// so we express bundler-specific rules via `turbopack.rules` only.

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

export default nextTranslate(withNextIntl(coreNextConfig), { turbopack: true });
