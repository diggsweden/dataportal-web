import Link from "next/link";

import { routing } from "@/i18n/routing";

/**
 * Root-level 404 fallback. Triggered when Next can't route a request into
 * any segment — i.e. the URL doesn't match the `app/[locale]/...` tree.
 * Because `app/layout.tsx` is a passthrough
 * (the `<html lang={locale}>`/`<body>` live in `app/[locale]/layout.tsx`
 * so the language attribute stays dynamic), this file has to ship its own
 * `<html>` + `<body>` — same pattern as `app/global-error.tsx`.
 *
 * Styles come from `@/styles/main.css` imported in `app/layout.tsx`.
 *
 * We can't know the requester's locale here (no `[locale]` segment was
 * matched), so we hard-code Swedish. Once an unmatched URL under
 * `app/[locale]/...` is hit, `app/[locale]/not-found.tsx` takes over
 * and gets the real locale from `next-intl/server`.
 */
export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className="font-ubuntu text-md text-textPrimary">
        <div className="mx-auto max-w-lg px-md py-xl">
          <h1 className="mb-md text-2xl font-semibold">
            404 - Sidan hittades inte
          </h1>
          <p className="mb-lg">
            Vi kunde tyvärr inte hitta sidan du letade efter.
          </p>
          <Link href="/" className="text-lg underline">
            Till startsidan
          </Link>
        </div>
      </body>
    </html>
  );
}
