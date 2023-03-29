import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface SearchHeaderProps {
  activeLink?: string;
  query?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchHeader: React.FC<SearchHeaderProps> = ({ query }) => {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  return (
    <div className="search-head">
      <div>
        <Link
          href={`${lang}/datasets?q=${query ? query : ""}&f=`}
          className={`text-md ${pathname == "/datasets" ? "active" : ""} `}
        >
          {t("search$datasets")}
        </Link>
      </div>
      <div>
        <Link
          href={`${lang}/concepts?q=${query ? query : ""}&f=`}
          className={`text-md ${pathname == "/concepts" ? "active" : ""} `}
        >
          {t("search$concepts")}
        </Link>
      </div>
      <div>
        <Link
          href={`${lang}/specifications?q=${query ? query : ""}&f=`}
          className={`text-md ${
            pathname == "/specifications" ? "active" : ""
          } `}
        >
          {t("search$specifications")}
        </Link>
      </div>
    </div>
  );
};
