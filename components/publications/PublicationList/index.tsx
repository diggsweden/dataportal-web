import { useMatomo } from "@datapunt/matomo-tracker-react";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PublicationListResponse } from "@/utilities";
import { PublicationTeaser } from "../PublicationTeaser";
import { Pagination } from "@/components/global/Pagination";
import { ButtonLink } from "@/components/global/Button";
import Heading from "@/components/global/Typography/Heading";
export const PublicationList: React.FC<PublicationListResponse> = ({
  publications,
  category,
  seo,
  heading,
  showMoreLink,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const { t } = useTranslation();
  const { push } = useRouter();
  const pathname = usePathname();
  const { trackPageView } = useMatomo();
  const { title, description } = seo || {};
  const publicationsPerPage = 12;
  const articlesVisited = pageNumber * publicationsPerPage;
  const publicationsOnPage = publications.slice(
    articlesVisited,
    articlesVisited + publicationsPerPage,
  );
  const pageCount = Math.ceil(publications.length / 12);
  const publicationCount = publicationsOnPage.length;
  const metaTitle =
    title ||
    (category
      ? `${category.name} - Sveriges dataportal`
      : `${t("pages|publications$social_meta_title")}`);

  useEffect(() => {
    if (pathname !== "/") {
      setCurrentPage(currentPage);
      setPageNumber(currentPage - 1);
      push(`?page=${currentPage}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    trackPageView({ documentTitle: "Nyheter" });
  }, [pathname]);

  return (
    <div>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
          </>
        )}
      </Head>
      <div className={`${pathname === "/" ? "py-xl" : "pt-xl"}`}>
        <div
          className={`flex items-center ${
            publicationCount <= 3 ? "justify-between" : "gap-sm"
          } text-2xl`}
        >
          <Heading level={2} size={"md"}>
            {!showMoreLink && <span className="pr-sm">{publicationCount}</span>}
            {heading}
          </Heading>
          {showMoreLink && (
            <ButtonLink
              size="sm"
              href={showMoreLink.slug}
              label={showMoreLink.title}
              variant="secondary"
            />
          )}
        </div>
        {publicationsOnPage.length > 0 ? (
          <ul className="gap-4 grid grid-cols-1 gap-xl pt-xl md:grid-cols-2 lg:grid-cols-3">
            {publicationsOnPage.map((publication, idx) => (
              <li key={idx}>
                <PublicationTeaser publication={publication} />
              </li>
            ))}
          </ul>
        ) : (
          <span className="pt-xl">{t("pages|listpage$no-articles")}</span>
        )}
        {!showMoreLink && pageCount > 1 && (
          <div className="flex justify-center">
            <Pagination
              publications={publications}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
