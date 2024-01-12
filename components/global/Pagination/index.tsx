import Arrow from "@/assets/icons/chevronRight.svg";
import useTranslation from "next-translate/useTranslation";
import { PublicationDataFragment as Publication } from "@/graphql/__generated__/operations";
import { ContainerDataFragment as IContainer } from "@/graphql/__generated__/operations";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

type Pagination = {
  searchResult: Publication[] | IContainer[] | any;
  perPage?: number | any;
  setPageNumber?: Function | any;
  pages?: number | any;
};

export const Pagination: React.FC<Pagination> = ({
  searchResult,
  perPage,
  setPageNumber,
  pages,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(searchResult.length / perPage);
  const { t } = useTranslation();
  const { push } = useRouter();
  const pathname = usePathname();
  const middlePages = ["..."];
  const maxPagesToShow = 7;
  const pagesToShowBeforeAfter = 3;
  const lastIndex = pages ? pages : pageCount;

  let pagination;

  if (pages > maxPagesToShow || pageCount > maxPagesToShow) {
    const firstPages = Array.from(
      { length: Math.min(pagesToShowBeforeAfter, pages ? pages : pageCount) },
      (_, index) => index + (currentPage > 2 ? currentPage - 1 : 1),
    );

    const lastPages = Array.from(
      { length: Math.min(pagesToShowBeforeAfter, pages ? pages : pageCount) },
      (_, index) => (pages ? pages - 3 + index + 1 : pageCount - 3 + index + 1),
    );

    pagination = [...firstPages, ...middlePages, ...lastPages];
  } else {
    pagination = Array.from(
      { length: pages ? pages : pageCount },
      (_, index) => index + 1,
    );
  }

  useEffect(() => {
    if (pathname !== "/") {
      setCurrentPage(currentPage);
      setPageNumber(currentPage - 1);
      currentPage !== 1 ? push(`?page=${currentPage}`) : push("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div
      className={`${
        !pages ? (pageCount === 1 ? "hidden" : "flex") : "flex"
      }  mt-xl w-full flex-col items-center justify-between gap-md md:flex-row md:gap-none`}
    >
      <span>
        {t("pages|search$page")} {currentPage} {t("common|of")}{" "}
        {pages ? pages : pageCount}
      </span>
      <div className="flex items-center">
        <button
          onClick={
            currentPage !== 1
              ? () => setCurrentPage(currentPage - 1)
              : () => null
          }
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === 1 ? "[&_path]:opacity-50" : "hover:bg-brown-200"
          }`}
          disabled={currentPage === 1}
        >
          <Arrow className="rotate-180" />
        </button>
        {pagination.map((value, idx) => (
          <button
            onClick={() => setCurrentPage(value)}
            key={idx}
            className={`${
              value === currentPage
                ? "bg-brown-800 text-white"
                : `bg-white  ${value === "..." ? "" : "hover:bg-brown-200"}`
            } flex h-xl w-xl cursor-pointer items-center justify-center`}
          >
            <span>{value}</span>
          </button>
        ))}
        <button
          onClick={
            currentPage !== lastIndex
              ? () => setCurrentPage(currentPage + 1)
              : () => null
          }
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === lastIndex
              ? "[&_path]:opacity-50"
              : "hover:bg-brown-200"
          }`}
          disabled={currentPage === lastIndex}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
};
