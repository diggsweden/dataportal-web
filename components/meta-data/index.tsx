import reactenv from "@beam-australia/react-env";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { FC, useState, useContext } from "react";

import { EnvSettings, SettingsUtil } from "@/env";
import { SeoDataFragment } from "@/graphql/__generated__/operations";
import { defaultSettings } from "@/providers/settings-provider";
import { TrackingContext } from "@/providers/tracking-provider";
import generateCSP from "@/utilities/generate-csp";

export const MetaData: FC<{ seo?: SeoDataFragment | null }> = ({ seo }) => {
  const [env] = useState<EnvSettings>(SettingsUtil.create());
  const { activateMatomo } = useContext(TrackingContext);
  const pathname = usePathname();
  const { locale } = useRouter();
  const { title, description, image, robotsFollow, robotsIndex } = seo || {};
  const strapiImageUrl = image?.url;
  const imageUrl = strapiImageUrl
    ? `${reactenv("MEDIA_BASE_URL") || ""}${strapiImageUrl}`
    : "/images/svdp-favicon-150.png";
  const defaultDescription =
    "Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor";

  const isDraft = pathname?.substring(0, 7) === "/drafts";
  const allowSEO = env.envName == "prod" && !isDraft;

  return (
    <Head>
      <meta name="referrer" content="no-referrer" />
      <meta
        httpEquiv="Content-Security-Policy"
        content={generateCSP({ nonce: env.nonce })}
      />
      {/* SEO */}
      <title>
        {title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"}
      </title>
      <meta
        property="og:title"
        content={
          title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"
        }
      />
      <meta
        name="twitter:title"
        content={
          title ? `${title} - Sveriges Dataportal` : "Sveriges Dataportal"
        }
      />
      <meta name="description" content={description || defaultDescription} />
      <meta name="og:description" content={description || defaultDescription} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="canonical" href={`${env.CANONICAL_URL}${pathname || ""}`} />
      <meta
        property="og:url"
        content={`${env.CANONICAL_URL}${pathname || ""}`}
      />
      <meta
        name="twitter:url"
        content={`${env.CANONICAL_URL}${pathname || ""}`}
      />
      <meta
        name="robots"
        content={`${robotsFollow && allowSEO ? "follow" : "nofollow"}, ${
          robotsIndex && allowSEO ? "index" : "noindex"
        }`}
      />
      <meta name="og:site_name" content={defaultSettings.siteName} />
      <meta name="language" content={locale} />
      <meta name="og:type" content="website" />
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
      {/* Matomo Tag Manager */}
      {activateMatomo && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
                var _mtm = window._mtm = window._mtm || [];
                _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
                (function() {
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src='https://webbanalys.digg.se/js/container_hV6fNi9j.js'; s.parentNode.insertBefore(g,s);
                })();
              `,
          }}
        />
      )}
      {/* End Matomo Tag Manager */}
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
    </Head>
  );
};
