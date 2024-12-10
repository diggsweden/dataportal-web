import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

interface SearchTipsProps {
  showTip: boolean;
}

export const SearchTips: FC<SearchTipsProps> = ({ showTip }) => {
  const { t, lang } = useTranslation();

  return (
    <div className={showTip ? "block" : "hidden"}>
      <div className="my-lg max-w-md bg-white p-lg">
        <div className="mb-xs text-lg">
          {t("pages|search$search-tips-search-head")}
        </div>
        <span>{t("pages|search$search-tips-search-txt")}</span>
        <div className="my-xs text-lg">
          {t("pages|search$search-tips-filter-head")}
        </div>
        <span>{t("pages|search$search-tips-filter-txt")}</span>
        <div className="my-xs text-lg">
          {t("pages|search$search-tips-searchfilter-head")}
        </div>
        <span>{t("pages|search$search-tips-searchfilter-txt")}</span>
        <div className="my-xs text-lg">
          {" "}
          {t("pages|search$search-tips-sort-head")}{" "}
        </div>
        <span>
          {t("pages|search$search-tips-sort-txt1")}
          {t("pages|search$search-tips-sort-txt2")}
          {t("pages|search$search-tips-sort-txt3")}
          {t("pages|search$search-tips-sort-txt4")}
          {t("pages|search$search-tips-sort-txt5")}
        </span>
        <div className="my-xs text-lg">
          {t("pages|search$search-tips-license-head")}{" "}
        </div>
        <div>
          {t("pages|search$search-tips-license-txt")}{" "}
          <Link
            href={`${t("routes|about-us$path")}`}
            locale={lang}
            className="text-md"
          >
            {t("pages|search$search-tips-license-link")}
          </Link>
          .
        </div>
      </div>
    </div>
  );
};
