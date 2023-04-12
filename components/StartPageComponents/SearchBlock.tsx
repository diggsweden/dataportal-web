import { SearchIcon, colorPalette, Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { TopImageStartpage } from "../Illustrations";

//Search head
export const SearchBlock: React.FC = () => {
  const { t, lang } = useTranslation("pages");
  return (
    <div className="main-search-container">
      <div id="TopImageStart-container">
        <TopImageStartpage />
      </div>
      <div className="startpage-top">
        <div className="startpage-search">
          <Heading size="2xl">{t("startpage$search_title_1")}</Heading>
          <form className="startpage-form" method="GET" action={`/datasets`}>
            <label className="screen-reader" htmlFor="start-search">
              {t("startpage$search_placeholder")}
            </label>
            <input
              id="start-search"
              type="text"
              placeholder={t("startpage$search_placeholder")}
              name="q"
              autoComplete="off"
            ></input>
            <button
              className="startpage-searchbtn"
              type="submit"
              aria-label={t("startpage$search_placeholder")}
            >
              <SearchIcon color={colorPalette.white} width={[32]} />
            </button>
          </form>
        </div>

        <div className="search__box">
          <div className="search__box--link">
            <Link
              aria-label={t("search$datasets")}
              href={`${lang}/datasets?p=1&q=&f=`}
              locale={lang}
              className="text-md font-bold"
            >
              {t("search$datasets")}
            </Link>
            <span className="text-base">{t("startpage$explore_datasets")}</span>
          </div>

          <div className="search__box--link">
            <span className="row">
              <Link
                aria-label={t("search$concepts")}
                href={`${lang}/concepts?p=1&q=&f=`}
                locale={lang}
                className="text-md font-bold"
              >
                {t("search$concepts")}
              </Link>
            </span>

            <span className="text-base">{t("startpage$explore_concepts")}</span>
          </div>

          <div className="search__box--link">
            <span className="row">
              <Link
                aria-label={t("search$specifications")}
                href={`/specifications?p=1&q=&f=`}
                locale={lang}
                className="text-md font-bold"
              >
                {t("search$specifications")}
              </Link>
            </span>

            <span className="text-base">{t("startpage$explore_specs")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
