"use client";

import reactenv from "@beam-australia/react-env";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { type FC, useState } from "react";

import { type EnvSettings, SettingsUtil } from "@/env";
import type { SeoDataFragment } from "@/graphql/__generated__/operations";
import { defaultSettings } from "@/providers/settings-provider";

export const MetaData: FC<{ seo?: SeoDataFragment | null }> = ({ seo }) => {
  const [env] = useState<EnvSettings>(SettingsUtil.create());
  const pathname = usePathname();
  const locale = useLocale();
  const { title, description, image, robotsFollow, robotsIndex } = seo || {};
  const strapiImageUrl = image?.url;
  const imageUrl = strapiImageUrl
    ? `${reactenv("MEDIA_BASE_URL") || ""}${strapiImageUrl}`
    : "/images/svdp-favicon-150.png";
  const defaultDescription =
    "Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor";

  const isDraft = pathname?.substring(0, 7) === "/drafts";
  const allowSEO = env.envName === "prod" && !isDraft;

  return (
    <>
      <meta name="referrer" content="no-referrer" />
      {/*
       * CSP is emitted as a `Content-Security-Policy` response header by
       * `proxy.ts` (the single source of truth). The `<meta http-equiv>`
       * variant previously lived here as a fallback; dropped to avoid
       * dueling policies (browsers apply the intersection when both are
       * present) now that the middleware owns delivery.
       */}
      {/* SEO */}
      <title>
        {title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"}
      </title>
      <meta
        property="og:title"
        content={
          title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"
        }
        key="og:title"
      />
      <meta
        name="twitter:title"
        content={
          title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"
        }
        key="twitter:title"
      />
      <meta
        name="description"
        content={description || defaultDescription}
        key="description"
      />
      <meta
        name="og:description"
        content={description || defaultDescription}
        key="og:description"
      />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
        key="twitter:description"
      />
      <meta property="og:image" content={imageUrl} key="og:image" />
      <meta name="twitter:image" content={imageUrl} key="twitter:image" />

      <link rel="canonical" href={`${env.CANONICAL_URL}${pathname || ""}`} />
      <meta
        property="og:url"
        content={`${env.CANONICAL_URL}${pathname || ""}`}
      />
      <meta
        name="twitter:url"
        content={`${env.CANONICAL_URL}${pathname || ""}`}
        key="twitter:url"
      />

      <meta
        name="robots"
        content={`${robotsFollow && allowSEO ? "follow" : "nofollow"}, ${
          robotsIndex && allowSEO ? "index" : "noindex"
        }`}
      />
      <meta
        name="og:site_name"
        content={defaultSettings.siteName}
        key="og:site_name"
      />
      <meta name="language" content={locale} key="language" />
      <meta name="og:type" content="website" key="og:type" />

      {/* PWA settings */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content={"#171A21"} />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-status-bar" />
      <meta
        name="google-site-verification"
        content="w0YYxJ7mqlvbxEYUahNuFqQEgViod8_jgBykWc3TYzE"
      />

      <link
        rel="icon"
        type="image/png"
        href="/images/svdp-favicon-16.png"
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href="/images/svdp-favicon-32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/images/svdp-favicon-64.png"
        sizes="64x64"
      />
      <link rel="apple-touch-icon" href="/images/svdp-favicon-150.png" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/svdp-favicon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/images/svdp-favicon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/images/svdp-favicon.png"
      />
      <link
        rel="mask-icon"
        href="/images/safari-pinned-tab.svg"
        color="black"
      />
    </>
  );
};
