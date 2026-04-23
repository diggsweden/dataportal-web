import { notFound } from "next/navigation";

/**
 * TEMPORARY placeholder to activate the `[locale]` dynamic segment.
 *
 * Next.js only routes URLs into `app/[locale]/...` (including its
 * `not-found.tsx` sibling) if the segment has at least one matchable
 * `page.tsx` somewhere underneath. Without this file, `/sv/whatever`
 * short-circuits to the root `app/not-found.tsx` and never renders the
 * chrome-wrapped `app/[locale]/not-found.tsx` — see the earlier Route
 * Info debug session.
 *
 * This file is deleted the moment `pages/index.ts` is ported onto the
 * App Router (next step of Phase 4). Until then it serves `/sv` and
 * `/en` as the chrome-wrapped 404 — those routes had no real content
 * after Option B dropped the Pages Router `i18n` block anyway, so this
 * is a net improvement for the ~2 URLs it affects during the migration.
 */
export default function LocaleIndexStub() {
  notFound();
}
