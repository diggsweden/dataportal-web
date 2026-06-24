"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FC, useContext, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/pagination";
import { Heading } from "@/components/typography/heading";
import type {
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

interface ListPageProps {
  listItems: (
    | ToolDataFragment
    | NewsBlockItemFragment
    | GoodExampleBlockItemFragment
    | NewsItemDataFragment
    | GoodExampleDataFragment
  )[];
  heading: string;
  type: string;
  breadcrumb?: string;
}
interface Keyword {
  value: string;
  id: string;
}

export const ListPage: FC<ListPageProps> = ({
  listItems,
  heading,
  breadcrumb,
}) => {
  const { setBreadcrumb } = useContext(SettingsContext);
  const list = Array.isArray(listItems) ? listItems : [];
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listItemsPerPage = 12;
  const page = parseInt(searchParams?.get("page") ?? "", 10) || 1;
  const startIndex = (page - 1) * listItemsPerPage;
  const endIndex = startIndex + listItemsPerPage;
  const [filterList, setFilterList] =
    useState<ListPageProps["listItems"]>(listItems);
  const [keywordList, setKeywordList] = useState<Keyword[]>([]);
  const [activeFilter, setActiveFilter] = useState<Keyword>({
    value: "Alla",
    id: "0",
  });

  useEffect(() => {
    setBreadcrumb?.({
      name: breadcrumb ?? heading,
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname]);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newPage !== 1) {
      params.set("page", String(newPage));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : (pathname ?? "/"));
  };

  useEffect(() => {
    const keywords = [{ value: "Alla", id: "0" }];
    for (const item of list) {
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (!keywords.some((i) => i.id === keyword.id)) {
            keywords.push(keyword);
          }
        }
      }
    }

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
      // Reset to first page when filtering
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (params.has("page")) {
        params.delete("page");
        router.replace(pathname ?? "/");
      }
    }
  }, [setActiveFilter, activeFilter, pathname, listItems]);

  useEffect(() => {
    setActiveFilter({
      value: "Alla",
      id: "0",
    });
  }, [heading]);

  return (
    <div data-test-id="list-page" className="mb-lg md:mb-xl">
      <Container>
        {heading && (
          <Heading data-test-id="list-page-heading" level={2} size={"md"}>
            {`${filterList.length} ${breadcrumb ?? heading}`}
          </Heading>
        )}

        {keywordList.length > 1 && (
          <div
            data-test-id="list-filters"
            className="mt-xl flex flex-wrap gap-md"
          >
            {keywordList.map((keyword) => (
              <Button
                variant="plain"
                key={keyword.id}
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
              pageNumber={page}
              changePage={changePage}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
