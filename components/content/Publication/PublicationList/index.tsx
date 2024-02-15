import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { PublicationTeaser } from "@/components/content/Publication/PublicationTeaser";
import { ButtonLink } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import {
  ContainerDataFragment,
  PublicationDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { Toolteaser } from "../ToolTeaser";

interface PublicationListProps {
  publications:
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

export const PublicationList: FC<PublicationListProps> = ({
  publications,
  heading,
  showMoreLink,
  type,
}) => {
  const { t } = useTranslation();
  const listType = type === "PublicationList";
  return (
    <div className="my-lg md:my-xl">
      <div
        className={`mb-lg flex items-center md:mb-xl ${
          publications.length <= 3 ? "justify-between" : "gap-sm"
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
      {publications.length > 0 ? (
        <ul className="gap-4 grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication, idx) => (
            <li key={idx}>
              {listType ? (
                <PublicationTeaser
                  publication={publication as PublicationDataFragment}
                />
              ) : (
                <Toolteaser tools={publication as ToolDataFragment} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <span>{t("pages|listpage$no-articles")}</span>
      )}
    </div>
  );
};
