import Script from "next/script";

interface MatomoScriptProps {
  nonce?: string;
}

/**
 * Injects the Matomo Tag Manager container bootstrap. Runs after hydration
 * (`afterInteractive`) so it doesn't block rendering, and dedupes by `id` so
 * client-side navigation can't double-mount it.
 */
export function MatomoScript({ nonce }: MatomoScriptProps) {
  return (
    <Script id="matomo-tag-manager" strategy="afterInteractive" nonce={nonce}>
      {`
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        (function() {
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src='https://webbanalys.digg.se/js/container_hV6fNi9j.js'; s.parentNode.insertBefore(g,s);
        })();
      `}
    </Script>
  );
}
