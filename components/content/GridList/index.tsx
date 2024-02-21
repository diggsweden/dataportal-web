import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { PublicationTeaser } from "@/components/content/Publication/PublicationBlock";
import { ButtonLink } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import {
  ContainerDataFragment,
  PublicationDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { Toolteaser } from "../Tool";

interface ListProps {
  items:
    | PublicationDataFragment[]
    | ContainerDataFragment[]
    | ToolDataFragment[];
  heading?: string;
  showMoreLink?: {
    slug: string;
    title: string;
  };
}

export const GridList: FC<ListProps> = ({ items, heading, showMoreLink }) => {
  const { t } = useTranslation();

  return (
    <div className="my-lg md:my-xl">
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
                  case "dataportal_Digg_Publication":
                    return <PublicationTeaser publication={item} />;
                  case "dataportal_Digg_Tool":
                    return <Toolteaser tools={item} />;
                  default:
                    return null;
                }
              })()}
            </li>
          ))}
        </ul>
      ) : (
        <span>{t("pages|listpage$no-articles")}</span>
      )}
    </div>
  );
};
