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

interface PublicationListProps {
  items:
    | PublicationDataFragment[]
    | ContainerDataFragment[]
    | ToolDataFragment[];
  heading?: string;
  type?: string;
  showMoreLink?: {
    slug: string;
    title: string;
  };
}

export const GridList: FC<PublicationListProps> = ({
  items,
  heading,
  showMoreLink,
}) => {
  const { t } = useTranslation();

  const itemType = (
    item: PublicationDataFragment | ContainerDataFragment | ToolDataFragment,
  ) => {
    switch (item.__typename) {
      case "dataportal_Digg_Publication":
        return (
          <PublicationTeaser publication={item as PublicationDataFragment} />
        );
        break;
      case "dataportal_Digg_Tool":
        return <Toolteaser tools={item as ToolDataFragment} />;
        break;
      default:
        break;
    }
  };

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
            <li key={idx}>{itemType(item)}</li>
          ))}
        </ul>
      ) : (
        <span>{t("pages|listpage$no-articles")}</span>
      )}
    </div>
  );
};
