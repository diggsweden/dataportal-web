import { FC, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Container } from "@/components/layout/Container";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { linkBase, PublicationListResponse } from "@/utilities";
import { Pagination } from "@/components/global/Pagination";
import { useRouter, NextRouter } from "next/router";
import { SettingsContext } from "@/providers/SettingsProvider";

export const ListPage: FC<PublicationListResponse> = ({
  publications,
  heading,
}) => {
  const { trackPageView } = useMatomo();
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const router: NextRouter = useRouter();
  const publicationsPerPage = 12;
  const page = parseInt(router.query.page as string) || 1;
  const startIndex = (page - 1) * publicationsPerPage;
  const endIndex = startIndex + publicationsPerPage;
  const publicationsOnPage = publications.slice(startIndex, endIndex);

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
        <PublicationList
          publications={publicationsOnPage}
          heading={`${publications.length} ${heading}`}
        />
        {publications.length > 12 && (
          <div className="flex justify-center">
            <Pagination
              totalResults={publications.length || 0}
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
