import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import { ButtonLink } from "@/components/button";
import { Heading } from "@/components/typography/heading";
import { PublicationTeaser } from "@/features/publication/publication-teaser";
import { Toolteaser } from "@/features/tool";
import {
  GoodExampleBlockItemFragment,
  NewsBlockItemFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";

interface ListProps {
  items: (
    | ToolDataFragment
    | GoodExampleBlockItemFragment
    | NewsBlockItemFragment
  )[];
  heading?: string;
  showMoreLink?: {
    slug: string;
    title: string;
  };
  className?: string;
}

export const GridList: FC<ListProps> = ({
  items,
  heading,
  showMoreLink,
  className,
}) => {
  const { t } = useTranslation();

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
        {showMoreLink && showMoreLink.slug && (
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
          className="gap-4 grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              className="group relative flex h-full flex-col justify-between no-underline"
            >
              {item.__typename === "dataportal_Digg_Tool" ? (
                <Toolteaser tools={item as ToolDataFragment} />
              ) : (
                <PublicationTeaser publication={item} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span data-test-id="grid-list-empty">
          {t("pages|listpage$no-content")}
        </span>
      )}
    </div>
  );
};
