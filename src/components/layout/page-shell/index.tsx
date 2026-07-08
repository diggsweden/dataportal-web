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
  search?: boolean;
  children: ReactNode;
}

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
