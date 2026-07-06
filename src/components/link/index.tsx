import NextLink from "next/link";
import type { ComponentProps } from "react";

import { Link as IntlLink, type LocalizedLinkProps } from "@/i18n/navigation";
import { isExternalLink } from "@/utilities/checkers";

type NextLinkProps = ComponentProps<typeof NextLink>;

export type AppLinkProps = NextLinkProps & LocalizedLinkProps;

/**
 * Picks the locale-aware `Link` for same-origin paths and falls back
 * to `next/link` for external / mailto URLs.
 */
export function AppLink({ href, ...rest }: AppLinkProps) {
  if (typeof href === "string" && isExternalLink(href)) {
    return <NextLink href={href} {...rest} />;
  }

  return <IntlLink href={href} {...rest} />;
}
