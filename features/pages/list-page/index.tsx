import { getTranslations } from "next-intl/server";

import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import type {
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";

import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { ListFilters } from "./list-filters";
import { ListPagination } from "./list-pagination";

const ITEMS_PER_PAGE = 12;

type ListItem =
  | ToolDataFragment
  | NewsBlockItemFragment
  | GoodExampleBlockItemFragment
  | NewsItemDataFragment
  | GoodExampleDataFragment;

interface Keyword {
  value: string;
  id: string;
}

interface ListPageProps {
  listItems: ListItem[];
  heading: string;
  type: string;
  breadcrumb?: string;
  searchParams?: { page?: string; filter?: string };
}

function extractKeywords(items: ListItem[]): Keyword[] {
  const keywords: Keyword[] = [{ value: "Alla", id: "0" }];
  for (const item of items) {
    if (item.keywords) {
      for (const keyword of item.keywords as Keyword[]) {
        if (!keywords.some((k) => k.id === keyword.id)) {
          keywords.push(keyword);
        }
      }
    }
  }
  return keywords;
}

export async function ListPage({
  listItems,
  heading,
  breadcrumb,
  searchParams,
}: ListPageProps) {
  const t = await getTranslations();
  const list = Array.isArray(listItems) ? listItems : [];

  const page = parseInt(searchParams?.page ?? "", 10) || 1;
  const activeFilterId = searchParams?.filter ?? "0";

  const keywords = extractKeywords(list);

  const filtered =
    activeFilterId === "0"
      ? list
      : list.filter((item) =>
          (item.keywords as Keyword[] | undefined)?.some(
            (k) => String(k.id) === activeFilterId,
          ),
        );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div data-test-id="list-page" className="mb-lg md:mb-xl">
      <BreadcrumbSetter name={breadcrumb ?? heading} />
      <Container>
        {heading && (
          <Heading data-test-id="list-page-heading" level={2} size={"md"}>
            {`${filtered.length} ${breadcrumb ?? heading}`}
          </Heading>
        )}

        {keywords.length > 1 && (
          <ListFilters keywords={keywords} activeFilterId={activeFilterId} />
        )}
        <GridList
          items={pageItems}
          emptyMessage={t("pages.listpage.no-content")}
        />
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center">
            <ListPagination
              totalResults={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
              pageNumber={page}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
