import React, { FC } from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

interface SearchTipsProps {
  showTip: boolean;
}

export const SearchTips: FC<SearchTipsProps> = ({ showTip }) => {
  const { t, lang } = useTranslation();

  return (
    <div className={"search-tip__modal " + (showTip ? "block" : "hidden")}>
      <div className="search-tip__modal-wrapper">
        <div className="text-bold text-lg">
          {t("pages|search$search-tips-search-head")}
        </div>
        <span className="text-base">
          {t("pages|search$search-tips-search-txt")}
        </span>
        <div className="text-bold text-lg">
          {t("pages|search$search-tips-filter-head")}
        </div>
        <span className="text-base">
          {t("pages|search$search-tips-filter-txt")}
        </span>
        <div className="text-bold text-lg">
          {t("pages|search$search-tips-searchfilter-head")}
        </div>
        <span className="text-base">
          {t("pages|search$search-tips-searchfilter-txt")}
        </span>
        <div className="text-bold text-lg">
          {" "}
          {t("pages|search$search-tips-sort-head")}{" "}
        </div>
        <span className="text-base">
          {t("pages|search$search-tips-sort-txt1")}
          {t("pages|search$search-tips-sort-txt2")}
          {t("pages|search$search-tips-sort-txt3")}
          {t("pages|search$search-tips-sort-txt4")}
          {t("pages|search$search-tips-sort-txt5")}
        </span>
        <span className="text-bold text-lg">
          {" "}
          {t("pages|search$search-tips-license-head")}{" "}
        </span>
        <span className="text-base">
          {t("pages|search$search-tips-license-txt")}{" "}
          <Link
            href={`${t("routes|about-us$path")}`}
            locale={lang}
            className="text-base"
          >
            {t("pages|search$search-tips-license-link")}
          </Link>
          .
        </span>
      </div>
    </div>
  );
};
