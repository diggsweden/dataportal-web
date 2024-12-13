/** @type {import('next').NextConfig} */

const nextTranslate = require("next-translate-plugin");

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

const nextConfig = nextTranslate({
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      https: false,
      http: false,
      zlib: false,
      events: false,
      net: false,
      dgram: false,
      tls: false,
    };

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    return config;
  },
  productionBrowserSourceMaps: true,
  env: {
    REVALIDATE_INTERVAL: process.env.REVALIDATE_INTERVAL,
  },

  staticPageGenerationTimeout: 240,

  images: {
    domains: [process.env.IMAGE_DOMAIN || "localhost", "bcdn.screen9.com"],
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
});

module.exports = nextConfig;
