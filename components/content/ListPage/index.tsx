import { FC, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Container } from "@/components/layout/Container";
import { GridList } from "@/components/content/GridList";
import { linkBase } from "@/utilities";
import { Pagination } from "@/components/global/Pagination";
import { useRouter, NextRouter } from "next/router";
import { SettingsContext } from "@/providers/SettingsProvider";
import {
  PublicationDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";

interface ListPageProps {
  listItems?: ToolDataFragment[] | PublicationDataFragment[];
  heading: string;
}
interface Keyword {
  value: string;
  id: string;
}

export const ListPage: FC<ListPageProps> = ({ listItems, heading }) => {
  const { trackPageView } = useMatomo();
  const { setBreadcrumb } = useContext(SettingsContext);
  const list = Array.isArray(listItems) ? listItems : [];
  const pathname = usePathname();
  const router: NextRouter = useRouter();
  const listItemsPerPage = 12;
  const page = parseInt(router.query.page as string) || 1;
  const startIndex = (page - 1) * listItemsPerPage;
  const endIndex = startIndex + listItemsPerPage;
  const itemsOnPage = list.slice(startIndex, endIndex);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: heading,
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });

    trackPageView({ documentTitle: heading });
  }, [pathname]);

  const changePage = (page: number) => {
    page !== 1 ? router.push(`?page=${page}`) : router.push("");
  };

  const [activeFilter, setActiveFilter] = useState<Keyword>({
    value: "Alla",
    id: "0",
  });

  const listType = listItems && listItems[0]?.__typename;

  function getKeywords(items: ToolDataFragment[]) {
    const keywords: Keyword[] = [{ value: "Alla", id: "0" }];
    items.forEach((item) => {
      if (item.keywords) {
        item.keywords.forEach((keyword: Keyword) => {
          !keywords.some((i) => i.id === keyword.id) && keywords.push(keyword);
        });
      }
    });
    return keywords;
  }

  function filteredItems() {
    if (activeFilter.id === "0" || listType !== "dataportal_Digg_Tool") {
      return itemsOnPage;
    } else {
      return (itemsOnPage as ToolDataFragment[]).filter((item) => {
        return item.keywords.some(
          (keywordObj) => String(keywordObj.id) === activeFilter.id,
        );
      });
    }
  }

  return (
    <div id="news-list" className="mb-lg md:mb-xl">
      <Container>
        {heading && (
          <Heading level={2} size={"md"}>
            {`${list.length} ${heading}`}
          </Heading>
        )}
        {listType === "dataportal_Digg_Tool" && (
          <div className="mt-xl flex flex-wrap gap-md">
            {getKeywords(listItems as ToolDataFragment[]).map(
              (keyword, idx) => (
                <Button
                  variant="plain"
                  key={idx}
                  onClick={() => setActiveFilter(keyword)}
                  label={keyword.value}
                  className={`${
                    keyword.id === activeFilter.id &&
                    "hover-none bg-pink-200 font-strong text-blackOpaque3 hover:bg-pink-200"
                  }`}
                />
              ),
            )}
          </div>
        )}
        <GridList items={filteredItems()} />
        {list.length > 12 && (
          <div className="flex justify-center">
            <Pagination
              totalResults={list.length || 0}
              itemsPerPage={listItemsPerPage}
              pageNumber={parseInt(router.query.page as string)}
              changePage={changePage}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
