import { FC, useEffect, useState } from "react";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Container from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { PublicationListResponse } from "@/utilities";
import { Pagination } from "@/components/global/Pagination";

export const ListPage: FC<PublicationListResponse> = ({
  publications,
  seo,
  heading,
}) => {
  const { trackPageView } = useMatomo();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const { push } = useRouter();
  const pathname = usePathname();
  const publicationsPerPage = 12;
  const articlesVisited = pageNumber * publicationsPerPage;
  const publicationsOnPage = publications.slice(
    articlesVisited,
    articlesVisited + publicationsPerPage,
  );
  const { title, description } = seo || {};

  useEffect(() => {
    trackPageView({ documentTitle: heading });
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setCurrentPage(currentPage);
      setPageNumber(currentPage - 1);
      push(`?page=${currentPage}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div id="news-list" className="my-xl">
      <Head>
        <title>{title}</title>
        {title && <meta property="og:title" content={title} />}
        {description && (
          <>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
            <meta name="twitter:description" content={description} />
          </>
        )}
      </Head>

      <Container>
        <Heading level={1} size={"lg"} className="mb-xl">
          {heading}
        </Heading>
      </Container>

      <Container>
        <PublicationList
          publications={publicationsOnPage}
          heading={`${publicationsOnPage.length} ${heading}`}
        />

        <div className="flex justify-center">
          <Pagination
            publications={publications}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Container>
    </div>
  );
};
