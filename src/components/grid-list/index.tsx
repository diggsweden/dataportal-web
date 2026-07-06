import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/button";
import { Heading } from "@/components/typography/heading";

const columnClasses = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
} as const;

interface GridListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T, index: number) => string | number;
  columns?: keyof typeof columnClasses;
  heading?: string;
  showMoreLink?: {
    slug: string;
    title: string;
  };
  className?: string;
}

/**
 * Responsive grid layout for teaser cards. Layout-only: the caller decides
 * which component to render per item via `renderItem`, so `GridList` stays
 * decoupled from any specific fragment/teaser type.
 */
export function GridList<T>({
  items,
  renderItem,
  getItemKey,
  columns = 3,
  heading,
  showMoreLink,
  className,
}: GridListProps<T>) {
  const t = useTranslations();

  return (
    <div
      data-test-id="grid-list-container"
      className={`mb-lg md:mb-xl ${className ? className : ""}`}
    >
      <div
        className={`mb-lg flex items-center md:mb-xl ${
          items.length <= 3 ? "justify-between" : "gap-sm"
        } text-2xl`}
      >
        {heading && (
          <Heading level={2} size={"md"}>
            {heading}
          </Heading>
        )}
        {showMoreLink?.slug && (
          <ButtonLink
            size="sm"
            href={showMoreLink.slug}
            label={showMoreLink.title}
            aria-label={`${showMoreLink.title} ${
              heading ? `- ${heading}` : ""
            }`}
            variant="secondary"
          />
        )}
      </div>

      {items.length > 0 ? (
        <ul
          data-test-id="grid-list"
          className={`gap-4 grid gap-xl ${columnClasses[columns]}`}
        >
          {items.map((item, index) => (
            <li
              key={getItemKey(item, index)}
              className="group relative flex h-full flex-col justify-between no-underline"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <span data-test-id="grid-list-empty">
          {t("pages.listpage.no-content")}
        </span>
      )}
    </div>
  );
}
