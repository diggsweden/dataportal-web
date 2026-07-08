import type { ComponentProps, ReactNode } from "react";

import { Hero } from "@/components/layout/hero";
import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";

type HeroImage = ComponentProps<typeof Hero>["image"];

interface PageShellProps {
  breadcrumb: BreadcrumbProps;
  heading?: string | null;
  preamble?: string | null;
  image?: HeroImage;
  search?: ComponentProps<typeof Hero>["search"];
  children: ReactNode;
}

/**
 * Shared chrome for content pages (containers, landing pages and the
 * publication routes): syncs the breadcrumb and renders the hero above the
 * body when there's an image. Keeps the hero/breadcrumb wiring in one place so
 * route pages only fetch data, build a breadcrumb and drop in their body.
 */
export function PageShell({
  breadcrumb,
  heading,
  preamble,
  image,
  search,
  children,
}: PageShellProps) {
  return (
    <>
      <BreadcrumbSetter {...breadcrumb} />
      {(image || search) && (
        <Hero
          heading={heading}
          preamble={preamble}
          image={image ?? null}
          search={search}
        />
      )}
      {children}
    </>
  );
}
