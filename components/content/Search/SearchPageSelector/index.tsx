import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { Tab } from "@/components/global/Tab";

interface SearchTabsProps {
  activeLink?: string;
  query?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchPageSelector: React.FC<SearchTabsProps> = ({ query }) => {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  return (
    <div className="flex space-x-md">
      <Tab
        href={`${lang}/datasets?q=${query ? query : ""}&f=`}
        active={pathname === "/datasets"}
      >
        {t("search$datasets")}
      </Tab>
      <Tab
        href={`${lang}/concepts?q=${query ? query : ""}&f=`}
        active={pathname === "/concepts"}
      >
        {t("search$concepts")}
      </Tab>
      <Tab
        href={`${lang}/specifications?q=${query ? query : ""}&f=`}
        active={pathname === "/specifications"}
      >
        {t("search$specifications")}
      </Tab>
      <Tab
        href={`${lang}/search?q=${query ? query : ""}&f=`}
        active={pathname === "/search"}
      >
        {"Sök efter innehåll"}
      </Tab>
    </div>
  );
};
