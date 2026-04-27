import type { ReactNode } from "react";

import { Hero, type HeroSearchProps } from "@/components/layout/hero";
import { ChromeBreadcrumbs } from "@/components/navigation/breadcrumbs/chrome-breadcrumbs";
import type { ImageFragment } from "@/graphql/__generated__/operations";

interface PageWithHeroProps {
  heading?: string | null;
  preamble?: string | null;
  /**
   * Full CMS image fragment. Takes precedence over `imageUrl` when both
   * are provided. Pass `null`/`undefined` together with `imageUrl` unset
   * to skip rendering the hero entirely.
   */
  image?: ImageFragment | null;
  /**
   * Shortcut for routes that ship a static asset under `/public/images`
   * (e.g. the curated list pages). Wrapped into an `ImageFragment` with
   * the same defaults the pages used to spell out by hand.
   */
  imageUrl?: string;
  /**
   * Renders the hero search form + shortcut buttons. Currently only the
   * start page sets this — see `app/[locale]/page.tsx`.
   */
  search?: HeroSearchProps | null;
  /**
   * Centers the heading + search block. Pair with `search` on the start
   * page; ignored when `search` is not set.
   */
  isFrontpage?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Renders the standard `<Hero>` + page body shell shared by most CMS
 * routes. Hero is rendered only when an image is available — matches
 * the previous `{image && <Hero …/>}` conditional in every page.
 *
 * Stays a Server Component: `<Hero>` is server-renderable and we only
 * forward props, so this composes inside `async` page components
 * without a client boundary.
 */
export function PageWithHero({
  heading,
  preamble,
  image,
  imageUrl,
  search,
  isFrontpage,
  className,
  children,
}: PageWithHeroProps) {
  const resolvedImage = image ?? (imageUrl ? staticHeroImage(imageUrl) : null);

  return (
    <div className="space-y-xl">
      {resolvedImage && (
        <div className="hero-breadcrumbs">
          <Hero
            heading={heading}
            preamble={preamble}
            image={resolvedImage}
            search={search}
            isFrontpage={isFrontpage}
            className={className}
          />
          <ChromeBreadcrumbs />
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Builds a minimal `ImageFragment` from a static asset URL. The CMS
 * never returns these — they're hard-coded hero illustrations stored
 * in `/public/images` — so the surrounding metadata (`alt`, `name`,
 * `screen9`, …) is just the empty shape `<Hero>`/`<CustomImage>`
 * expect.
 */
function staticHeroImage(url: string): ImageFragment {
  return {
    __typename: "dataportal_Digg_Image",
    url,
    name: null,
    alt: null,
    description: null,
    mime: "image/png",
    ext: ".png",
    width: 1200,
    height: 300,
    screen9: { id: "" },
  };
}
