import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";

export const entryscapeResourcePageColumnsVariants = cva([], {
  variants: {
    layout: {
      default: "mb-lg gap-2xl md:mb-xl lg:flex",
      compact: "gap-2xl lg:flex",
      row: "flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl",
      rowSpaced: "mb-lg flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const entryscapeResourcePageMainVariants = cva([], {
  variants: {
    layout: {
      default: "mb-lg flex w-full max-w-md flex-col gap-lg lg:mb-xl",
      compact: "flex flex-col gap-lg",
      content: "flex w-full max-w-md flex-col",
      organisation: "mb-xl flex w-full max-w-md flex-shrink-0 flex-col gap-xl",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const entryscapeResourcePageSidebarVariants = cva([], {
  variants: {
    layout: {
      panels:
        "mb-lg w-full max-w-md space-y-lg pt-none lg:mb-none lg:max-w-[18.5rem]",
      panelsWide:
        "mb-lg w-full max-w-md space-y-lg pt-none lg:mb-none lg:max-w-[26.25rem]",
      panel:
        "mb-lg box-border h-fit w-full max-w-md flex-shrink-0 bg-white p-md lg:mb-none lg:max-w-[296px]",
      panelRaised:
        "mb-lg h-fit w-full max-w-md bg-white p-md lg:mb-none lg:max-w-[296px]",
      panelFlush: "h-fit w-full max-w-md bg-white p-md lg:max-w-[296px]",
    },
  },
  defaultVariants: {
    layout: "panels",
  },
});

type ColumnsLayout = VariantProps<
  typeof entryscapeResourcePageColumnsVariants
>["layout"];
type MainLayout = VariantProps<
  typeof entryscapeResourcePageMainVariants
>["layout"];
type SidebarLayout = VariantProps<
  typeof entryscapeResourcePageSidebarVariants
>["layout"];

interface EntryscapeResourcePageProps {
  breadcrumb: BreadcrumbProps;
  title: string;
  main: ReactNode;
  sidebar: ReactNode;
  footer?: ReactNode;
  head?: ReactNode;
  columnsLayout?: ColumnsLayout;
  mainLayout?: MainLayout;
  sidebarLayout?: SidebarLayout;
  columnsClassName?: string;
  mainClassName?: string;
  sidebarClassName?: string;
  sidebarTestId?: string;
}

/**
 * Shared chrome for Entryscape resource pages: container, breadcrumb, title,
 * and a responsive two-column layout. Page components supply main and sidebar
 * content via slots.
 */
export function EntryscapeResourcePage({
  breadcrumb,
  title,
  main,
  sidebar,
  footer,
  head,
  columnsLayout,
  mainLayout,
  sidebarLayout,
  columnsClassName,
  mainClassName,
  sidebarClassName,
  sidebarTestId,
}: EntryscapeResourcePageProps) {
  return (
    <Container>
      <BreadcrumbSetter {...breadcrumb} />
      {head}
      <main>
        <Heading level={1} size="lg" className="mb-lg md:mb-xl">
          {title}
        </Heading>
        <div
          className={entryscapeResourcePageColumnsVariants({
            layout: columnsLayout,
            className: columnsClassName,
          })}
        >
          <div
            data-attribute="entryscape-page-main"
            className={entryscapeResourcePageMainVariants({
              layout: mainLayout,
              className: mainClassName,
            })}
          >
            {main}
          </div>
          <div
            data-attribute="entryscape-page-sidebar"
            className={entryscapeResourcePageSidebarVariants({
              layout: sidebarLayout,
              className: sidebarClassName,
            })}
            {...(sidebarTestId ? { "data-test-id": sidebarTestId } : {})}
          >
            {sidebar}
          </div>
        </div>
        {footer}
      </main>
    </Container>
  );
}
