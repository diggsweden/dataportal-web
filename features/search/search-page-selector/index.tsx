import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ButtonLink } from "@/components/button";

interface SearchTabsProps {
  query?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchPageSelector: React.FC<SearchTabsProps> = ({ query }) => {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  return (
    <nav aria-label={t("search$search-type-navigation")}>
      <div
        className="mb-lg flex  gap-md overflow-x-scroll md:overflow-x-visible"
        role="tablist"
        aria-label={t("search$search-tabs")}
      >
        <ButtonLink
          variant={"plain"}
          href={`/datasets?q=${query ? query : ""}&f=`}
          label={t("search$datasets")}
          locale={lang}
          className={`focus--in whitespace-nowrap ${
            pathname === "/datasets"
              ? "bg-pink-200 font-strong text-textPrimary"
              : ""
          }`}
          role="tab"
          aria-selected={pathname === "/datasets"}
        />

        <ButtonLink
          variant={"plain"}
          href={`/concepts?q=${query ? query : ""}&f=`}
          label={t("search$concepts")}
          locale={lang}
          className={`focus--in whitespace-nowrap ${
            pathname === "/concepts"
              ? "bg-pink-200 font-strong text-textPrimary"
              : ""
          }`}
          role="tab"
          aria-selected={pathname === "/concepts"}
        />

        <ButtonLink
          variant={"plain"}
          href={`/specifications?q=${query ? query : ""}&f=`}
          label={t("search$specifications")}
          locale={lang}
          className={`focus--in whitespace-nowrap ${
            pathname === "/specifications"
              ? "bg-pink-200 font-strong text-textPrimary"
              : ""
          }`}
          role="tab"
          aria-selected={pathname === "/specifications"}
        />

        <ButtonLink
          variant={"plain"}
          href={`/search?q=${query ? query : ""}&f=`}
          label={t("search$content")}
          locale={lang}
          className={`focus--in whitespace-nowrap ${
            pathname === "/search"
              ? "bg-pink-200 font-strong text-textPrimary"
              : ""
          }`}
          role="tab"
          aria-selected={pathname === "/search"}
        />
      </div>
    </nav>
  );
};
