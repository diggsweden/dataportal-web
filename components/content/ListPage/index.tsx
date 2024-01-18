import { FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { PublicationListResponse } from "@/utilities";
import { Pagination } from "@/components/global/Pagination";
import { useRouter } from "next/router";

export const ListPage: FC<PublicationListResponse> = ({
  publications,
  heading,
}) => {
  const { trackPageView } = useMatomo();
  const pathname = usePathname();
  const router = useRouter();
  const page: any = router.query.page || 1;
  const publicationsPerPage = 12;
  const articlesVisited = (page - 1) * publicationsPerPage;
  const publicationsOnPage = publications.slice(
    articlesVisited,
    articlesVisited + publicationsPerPage,
  );

  useEffect(() => {
    trackPageView({ documentTitle: heading });
  }, [pathname]);

  return (
    <div id="news-list" className="my-xl">
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
            searchResult={publications.length}
            itemsPerPage={publicationsPerPage}
          />
        </div>
      </Container>
    </div>
  );
};
