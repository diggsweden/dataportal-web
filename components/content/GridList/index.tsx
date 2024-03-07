import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { PublicationTeaser } from "@/components/content/Publication/PublicationTeaser";
import { ButtonLink } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import {
  GoodExampleDataFragment,
  NewsItemDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { Toolteaser } from "../Tool";

interface ListProps {
  items:
    | NewsItemDataFragment[]
    | GoodExampleDataFragment[]
    | ToolDataFragment[];
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
    <div className={`mb-lg md:mb-xl ${className ? className : ""}`}>
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
            variant="secondary"
          />
        )}
      </div>

      {items.length > 0 ? (
        <ul className="gap-4 grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <li key={idx}>
              {(() => {
                switch (item.__typename) {
                  case "dataportal_Digg_Tool":
                    return <Toolteaser tools={item} />;
                  default:
                    return <PublicationTeaser publication={item} />;
                }
              })()}
            </li>
          ))}
        </ul>
      ) : (
        <span>{t("pages|listpage$no-content")}</span>
      )}
    </div>
  );
};
