import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation wrappers around Next.js routing APIs.
 *
 * Use `Link` instead of `next/link` for internal routes — it applies
 * `localePrefix: "as-needed"` automatically (`/datasets` vs `/en/datasets`).
 *
 * Use `getPathname` for server-side URLs (canonical tags, form actions,
 * redirects). Prefer this over hand-rolling `includeLangInPath`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
