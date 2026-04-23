"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";

interface TeaserLinkProps {
  href: string;
}

/**
 * Client wrapper around `<Link>` for `<PublicationTeaser>`. Exists
 * solely so the smooth scroll-to-top onClick can ship — Server
 * Components can't pass event handlers to client component props, and
 * the rest of the teaser is happy being server-rendered. Keep this
 * shell as small as possible: just the link, the styling, and the
 * handler.
 */
export function TeaserLink({
  href,
  children,
}: PropsWithChildren<TeaserLinkProps>) {
  return (
    <Link
      href={href}
      className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
      scroll={false}
      data-tracking-name="publication-teaser"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      {children}
    </Link>
  );
}
