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
  tools?: ToolDataFragment[];
  publications?:
    | PublicationDataFragment[]
    | ContainerData_Dataportal_Digg_Container_Fragment[];
  heading?: string;
  type?: string;
  category?: ContainerData_Dataportal_Digg_Container_Fragment;
  domain?: DiggDomain;
}

export const ListPage: FC<ListPageProps> = ({
  publications,
  tools,
  heading,
  type,
}) => {
  const { trackPageView } = useMatomo();
  const { setBreadcrumb } = useContext(SettingsContext);
  const toolsOrPublications = Array.isArray(tools)
    ? tools
    : Array.isArray(publications)
    ? publications
    : [];
  const pathname = usePathname();
  const router: NextRouter = useRouter();
  const publicationsPerPage = 12;
  const page = parseInt(router.query.page as string) || 1;
  const startIndex = (page - 1) * publicationsPerPage;
  const endIndex = startIndex + publicationsPerPage;
  const publicationsOnPage = toolsOrPublications.slice(startIndex, endIndex);

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
        <GridList
          type={type}
          items={publicationsOnPage}
          heading={`${toolsOrPublications.length} ${heading}`}
        />
        {type === "PublicationList" && toolsOrPublications.length > 12 && (
          <div className="flex justify-center">
            <Pagination
              totalResults={toolsOrPublications.length || 0}
              itemsPerPage={publicationsPerPage}
              pageNumber={parseInt(router.query.page as string)}
              changePage={changePage}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
