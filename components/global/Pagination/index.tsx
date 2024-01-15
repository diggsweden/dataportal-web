import Arrow from "@/assets/icons/chevronRight.svg";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

type Pagination = {
  searchResult: number | any;
  itemsPerPage: number;
  setPageNumber: Function;
};

export const Pagination: React.FC<Pagination> = ({
  searchResult,
  itemsPerPage,
  setPageNumber,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [screenSize, setScreenSize] = useState(false);
  const pageCount: number = Math.ceil(searchResult / itemsPerPage);
  const { t } = useTranslation();
  const { push } = useRouter();
  const pathname = usePathname();
  const pageSpace: string = "...";
  const numbersArray: number[] = Array.from(
    { length: pageCount },
    (_, index) => index + 1,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () =>
        setScreenSize(window.innerWidth > 600 ? false : true),
      );
    }
  }, []);

  const pagination = () => {
    if (screenSize) {
      if (pageCount > 5) {
        return [
          1,
          currentPage === 1 || currentPage === 2 || currentPage === 3
            ? 2
            : pageSpace,
          currentPage === pageCount || currentPage === pageCount - 1
            ? pageCount - 2
            : currentPage === 1 || currentPage === 2
            ? 3
            : currentPage,
          currentPage >= pageCount - 2 ? pageCount - 1 : pageSpace,
          pageCount,
        ];
      } else return numbersArray;
    }
    if (pageCount > 7) {
      if (currentPage >= pageCount - 4) {
        return [1, pageSpace, ...numbersArray.slice(-5)];
      } else {
        return [
          1,
          currentPage === pageCount - 5 ? pageSpace : null,
          currentPage === 1 ? 2 : currentPage,
          currentPage === 1 ? 3 : currentPage + 1,
          currentPage === pageCount - 5 ? currentPage + 2 : pageSpace,
          pageCount - 2,
          pageCount - 1,
          pageCount,
        ].filter((item) => item !== null);
      }
    } else return numbersArray;
  };

  useEffect(() => {
    if (pathname !== "/") {
      setPageNumber(currentPage - 1);
      currentPage !== 1 ? push(`?page=${currentPage}`) : push("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div
      className={`${
        pageCount <= 1 ? "hidden" : "flex"
      }  mt-xl w-full flex-col items-center justify-between gap-md md:flex-row md:gap-none`}
    >
      <span>
        {t("pages|search$page")} {currentPage} {t("common|of")} {pageCount}
      </span>
      <div className="flex items-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === 1 ? "[&_path]:opacity-20" : ""
          }`}
          disabled={currentPage === 1}
        >
          <Arrow className="rotate-180" />
        </button>
        {pagination().map((value: any, idx: number) => (
          <button
            onClick={value === "..." ? () => null : () => setCurrentPage(value)}
            key={idx}
            className={`${
              value === currentPage
                ? "bg-brown-800 text-white"
                : `bg-white ${value !== "..." ? "hover:bg-brown-200" : ""} `
            } flex h-xl w-xl cursor-pointer items-center justify-center`}
          >
            <span>{value}</span>
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`flex h-xl w-xl items-center justify-center !bg-white ${
            currentPage === pageCount ? "[&_path]:opacity-20" : ""
          }`}
          disabled={currentPage === pageCount}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
};
