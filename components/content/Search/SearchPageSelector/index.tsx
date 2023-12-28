import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { ButtonLink } from "@/components/global/Button";

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
      <ButtonLink
        variant="secondary"
        href={`${lang}/datasets?q=${query ? query : ""}&f=`}
        className={`text-md ${pathname == "/datasets" ? "active" : ""} `}
        label={t("search$datasets")}
      />
      <ButtonLink
        href={`${lang}/concepts?q=${query ? query : ""}&f=`}
        className={`text-md ${pathname == "/concepts" ? "active" : ""} `}
        label={t("search$concepts")}
      />
      <ButtonLink
        href={`${lang}/specifications?q=${query ? query : ""}&f=`}
        className={`text-md ${pathname == "/specifications" ? "active" : ""} `}
        label={t("search$specifications")}
      />
      <ButtonLink
        variant="secondary"
        href={`${lang}/search?q=${query ? query : ""}&f=`}
        className={`text-md ${pathname == "/datasets" ? "active" : ""} `}
        label={"Sök efter innehåll"}
      />
    </div>
  );
};
