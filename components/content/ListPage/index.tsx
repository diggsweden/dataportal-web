import { FC, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Container } from "@/components/layout/Container";
import { GridList } from "@/components/content/GridList";
import { linkBase } from "@/utilities";
import { Pagination } from "@/components/global/Pagination";
import { useRouter, NextRouter } from "next/router";
import { SettingsContext } from "@/providers/SettingsProvider";
import {
  ContainerData_Dataportal_Digg_Container_Fragment,
  PublicationDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";

interface ListPageProps {
  listItems?:
    | ToolDataFragment[]
    | PublicationDataFragment[]
    | ContainerData_Dataportal_Digg_Container_Fragment[];
  heading?: string;
  category?: ContainerData_Dataportal_Digg_Container_Fragment;
  domain?: DiggDomain;
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
        name: heading!,
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });

    trackPageView({ documentTitle: heading });
  }, [pathname]);

  const changePage = (page: number) => {
    page !== 1 ? router.push(`?page=${page}`) : router.push("");
  };

  return (
    <div id="news-list" className="my-lg md:my-xl">
      <Container>
        <GridList items={itemsOnPage} heading={`${list.length} ${heading}`} />
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
