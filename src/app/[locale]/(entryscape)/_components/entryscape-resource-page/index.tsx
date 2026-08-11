import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";

interface EntryscapeResourcePageProps {
  breadcrumb: BreadcrumbProps;
  title: string;
  intro?: ReactNode;
  main: ReactNode;
  sidebar: ReactNode;
  footer?: ReactNode;
  head?: ReactNode;
  columnsClassName?: string;
  mainClassName?: string;
  sidebarClassName?: string;
}

/**
 * Shared chrome for Entryscape resource pages: container, breadcrumb, title,
 * and a responsive two-column layout. Page components supply main and sidebar
 * content via slots.
 */
export function EntryscapeResourcePage({
  breadcrumb,
  title,
  intro,
  main,
  sidebar,
  footer,
  head,
  columnsClassName,
  mainClassName,
  sidebarClassName,
}: EntryscapeResourcePageProps) {
  return (
    <Container>
      <BreadcrumbSetter {...breadcrumb} />
      {head}
      <main className="space-y-lg md:space-y-xl">
        <div>
          <Heading level={1} size="lg" className="mb-lg md:mb-xl">
            {title}
          </Heading>
          {intro}
        </div>
        <div className={cx("mb-lg gap-2xl md:mb-xl lg:flex", columnsClassName)}>
          <div
            data-attribute="entryscape-page-main"
            className={cx(
              "mb-lg flex w-full flex-shrink-0 max-w-md flex-col gap-lg lg:mb-xl",
              mainClassName,
            )}
          >
            {main}
          </div>
          <div
            data-attribute="entryscape-page-sidebar"
            className={cx(
              "mb-lg w-full max-w-md space-y-xl pt-none lg:mb-none lg:max-w-[26.25rem]",
              sidebarClassName,
            )}
          >
            {sidebar}
          </div>
        </div>
        {footer}
      </main>
    </Container>
  );
}
