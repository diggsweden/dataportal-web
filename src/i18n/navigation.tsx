import { createNavigation } from "next-intl/navigation";
import type { ComponentProps } from "react";

import { routing } from "./routing";

const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);

type IntlLinkProps = ComponentProps<typeof IntlLink>;

/**
 * Locale-aware navigation wrappers around Next.js routing APIs.
 *
 * Use `Link` instead of `next/link` for internal routes — it applies
 * `localePrefix: "as-needed"` and localized `pathnames` automatically.
 *
 * During incremental `pathnames` rollout, `href` also accepts arbitrary
 * strings (CMS slugs, Entryscape detail URLs). Known static routes stay
 * strictly typed via the cast below.
 */
export type LocalizedLinkProps = Omit<IntlLinkProps, "href"> & {
  href: IntlLinkProps["href"] | string;
};

export function Link({ href, ...rest }: LocalizedLinkProps) {
  return <IntlLink href={href as IntlLinkProps["href"]} {...rest} />;
}

export { getPathname, redirect, usePathname, useRouter };
