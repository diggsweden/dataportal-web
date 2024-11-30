import { usePathname } from "next/navigation";
import { useRouter, NextRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/pagination";
import { Heading } from "@/components/typography/heading";
import {
  GoodExampleDataFragment,
  NewsItemDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

interface ListPageProps {
  listItems: (
    | ToolDataFragment
    | NewsItemDataFragment
    | GoodExampleDataFragment
  )[];
  heading: string;
  type: string;
}
interface Keyword {
  value: string;
  id: string;
}

export const ListPage: FC<ListPageProps> = ({ listItems, heading }) => {
  const { setBreadcrumb } = useContext(SettingsContext);
  const list = Array.isArray(listItems) ? listItems : [];
  const pathname = usePathname();
  const router: NextRouter = useRouter();
  const listItemsPerPage = 12;
  const page = parseInt(router.query.page as string) || 1;
  const startIndex = (page - 1) * listItemsPerPage;
  const endIndex = startIndex + listItemsPerPage;
  const [filterList, setFilterList] =
    useState<
      (ToolDataFragment | NewsItemDataFragment | GoodExampleDataFragment)[]
    >(listItems);
  const [keywordList, setKeywordList] = useState<Keyword[]>([]);
  const [activeFilter, setActiveFilter] = useState<Keyword>({
    value: "Alla",
    id: "0",
  });

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: heading,
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });
  }, [pathname]);

  const changePage = (page: number) => {
    page !== 1 ? router.replace(`?page=${page}`) : router.replace("");
  };

  useEffect(() => {
    const keywords = [{ value: "Alla", id: "0" }];
    list.map((item) => {
      if (item.keywords) {
        item.keywords.map((keyword: Keyword) => {
          !keywords.some((i) => i.id === keyword.id) && keywords.push(keyword);
        });
      }
    });

    setKeywordList(keywords);
  }, [listItems]);

  useEffect(() => {
    if (activeFilter.id === "0") {
      setFilterList(listItems);
    } else {
      setFilterList(
        listItems.filter((item) => {
          if (!item.keywords) return false;
          return item.keywords.some(
            (keywordObj) => String(keywordObj.id) === activeFilter.id,
          );
        }),
      );
      router.query.page && router.replace("");
    }
  }, [setActiveFilter, activeFilter, pathname, listItems]);

  useEffect(() => {
    setActiveFilter({
      value: "Alla",
      id: "0",
    });

    router.query.page = "1";
  }, [heading]);

  return (
    <div id="news-list" className="mb-lg md:mb-xl">
      <Container>
        {heading && (
          <Heading level={2} size={"md"}>
            {`${filterList.length} ${heading}`}
          </Heading>
        )}

        {keywordList.length > 1 && (
          <div className="mt-xl flex flex-wrap gap-md">
            {keywordList.map((keyword, idx) => (
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
            ))}
          </div>
        )}
        <GridList items={filterList.slice(startIndex, endIndex)} />
        {filterList.length > listItemsPerPage && (
          <div className="flex justify-center">
            <Pagination
              totalResults={filterList.length || 0}
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
