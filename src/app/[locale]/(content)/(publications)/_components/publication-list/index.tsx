import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Teaser } from "@/components/teaser";
import { Heading } from "@/components/typography/heading";
import type {
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
  ToolDataFragment,
} from "@/graphql/gql/graphql";
import { ListFilter } from "./list-filter";
import { ListPagination } from "./list-pagination";

const LIST_ITEMS_PER_PAGE = 12;

interface Keyword {
  value: string;
  id: string;
}

interface PublicationListProps {
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
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function PublicationList({
  listItems,
  heading,
  breadcrumb,
  searchParams,
}: PublicationListProps) {
  const list = Array.isArray(listItems) ? listItems : [];

  const keywords: Keyword[] = [{ value: "Alla", id: "0" }];
  for (const item of list) {
    if (!item.keywords) continue;
    for (const keyword of item.keywords) {
      if (!keywords.some((existing) => existing.id === keyword.id)) {
        keywords.push(keyword);
      }
    }
  }

  const filterParam = searchParams?.filter;
  const activeId = typeof filterParam === "string" ? filterParam : "0";

  const filterList =
    activeId === "0"
      ? list
      : list.filter((item) =>
          item.keywords?.some((keyword) => String(keyword.id) === activeId),
        );

  const pageParam = searchParams?.page;
  const page =
    parseInt(typeof pageParam === "string" ? pageParam : "", 10) || 1;
  const startIndex = (page - 1) * LIST_ITEMS_PER_PAGE;
  const endIndex = startIndex + LIST_ITEMS_PER_PAGE;

  return (
    <div data-test-id="list-page" className="mb-lg md:mb-xl">
      <Container>
        {heading && (
          <Heading data-test-id="list-page-heading" level={2} size={"md"}>
            {`${filterList.length} ${breadcrumb ?? heading}`}
          </Heading>
        )}

        {keywords.length > 1 && (
          <ListFilter keywords={keywords} activeId={activeId} />
        )}

        <GridList
          items={filterList.slice(startIndex, endIndex)}
          renderItem={(item) => <Teaser item={item} />}
          getItemKey={(item) =>
            item.__typename === "dataportal_Digg_Tool" ? item.link : item.slug
          }
        />
        {filterList.length > LIST_ITEMS_PER_PAGE && (
          <div className="flex justify-center">
            <ListPagination
              totalResults={filterList.length}
              itemsPerPage={LIST_ITEMS_PER_PAGE}
              pageNumber={page}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
