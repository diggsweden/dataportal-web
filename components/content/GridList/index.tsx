import { FC, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { PublicationTeaser } from "@/components/content/Publication/PublicationTeaser";
import { Button, ButtonLink } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import {
  PublicationDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { Toolteaser } from "../Tool";

interface ListProps {
  items: PublicationDataFragment[] | ToolDataFragment[];
  heading?: string;
  showMoreLink?: {
    slug: string;
    title: string;
  };
}
interface ItemWithKeywords {
  value: string;
  id: string;
}

export const GridList: FC<ListProps> = ({ items, heading, showMoreLink }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ItemWithKeywords>({
    value: "Alla",
    id: "0",
  });

  const listType = items && items[0]?.__typename;

  function getKeywords(items: ToolDataFragment[]) {
    const keywords: ItemWithKeywords[] = [{ value: "Alla", id: "0" }];
    items.forEach((item) => {
      if (item.keywords) {
        item.keywords.forEach((keyword: ItemWithKeywords) => {
          !keywords.some((i) => i.id === keyword.id) && keywords.push(keyword);
        });
      }
    });
    return keywords;
  }

  function filteredItems() {
    if (activeFilter.id === "0" || listType !== "dataportal_Digg_Tool") {
      return items;
    } else {
      return (items as ToolDataFragment[]).filter((item) => {
        return item.keywords.some(
          (keywordObj) => String(keywordObj.id) === activeFilter.id,
        );
      });
    }
  }

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
      {listType === "dataportal_Digg_Tool" && (
        <div className="mb-xl flex flex-wrap gap-md">
          {getKeywords(items as ToolDataFragment[]).map((keyword, idx) => (
            <Button
              variant="plain"
              key={idx}
              onClick={() => setActiveFilter(keyword)}
              label={keyword.value}
              className={`${
                keyword.id === activeFilter.id
                  ? "hover-none bg-pink-200 text-blackOpaque3 hover:bg-pink-200"
                  : ""
              }`}
            />
          ))}
        </div>
      )}

      {filteredItems().length > 0 ? (
        <ul className="gap-4 grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-3">
          {filteredItems().map((item, idx) => (
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
