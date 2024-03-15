import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { ButtonLink } from "@/components/global/Button";

interface SearchTabsProps {
  query?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchPageSelector: React.FC<SearchTabsProps> = ({ query }) => {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  return (
    <div className="mb-lg flex  gap-md overflow-x-scroll md:overflow-x-visible">
      <ButtonLink
        variant={"plain"}
        href={`/datasets?q=${query ? query : ""}&f=`}
        label={t("search$datasets")}
        locale={lang}
        className={`${
          pathname === "/datasets"
            ? "bg-pink-200 font-strong text-textPrimary"
            : ""
        }`}
      />

      <ButtonLink
        variant={"plain"}
        href={`/concepts?q=${query ? query : ""}&f=`}
        label={t("search$concepts")}
        locale={lang}
        className={`${
          pathname === "/concepts"
            ? "bg-pink-200 font-strong text-textPrimary"
            : ""
        }`}
      />

      <ButtonLink
        variant={"plain"}
        href={`/specifications?q=${query ? query : ""}&f=`}
        label={t("search$specifications")}
        locale={lang}
        className={`${
          pathname === "/specifications"
            ? "bg-pink-200 font-strong text-textPrimary"
            : ""
        }`}
      />

      <ButtonLink
        variant={"plain"}
        href={`/search?q=${query ? query : ""}&f=`}
        label={t("search$content")}
        locale={lang}
        className={`${
          pathname === "/search"
            ? "bg-pink-200 font-strong text-textPrimary"
            : ""
        }`}
      />
    </div>
  );
};
