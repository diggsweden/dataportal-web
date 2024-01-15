import Arrow from "@/assets/icons/chevronRight.svg";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, Dispatch } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Pagination = {
  searchResult: number | any;
  itemsPerPage: number;
  setPageNumber: Dispatch<React.SetStateAction<number>>;
};

export const Pagination: React.FC<Pagination> = ({
  searchResult,
  itemsPerPage,
  setPageNumber,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [screenSize, setScreenSize] = useState(false);
  const totalPages: number = Math.ceil(searchResult / itemsPerPage);
  const firstOnCurrentPage =
    currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage;
  const lastOnCurrentPage =
    currentPage === totalPages ? searchResult : itemsPerPage * currentPage;
  const { t } = useTranslation();
  const { push } = useRouter();
  const pathname = usePathname();
  const pageSpace: string = "...";
  const numbersArray: number[] = Array.from(
    { length: totalPages },
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
      if (totalPages > 5) {
        if (currentPage > 2 && currentPage <= totalPages - 2) {
          return [1, pageSpace, currentPage, pageSpace, totalPages];
        }
        if (currentPage >= totalPages - 3) {
          return [1, pageSpace, ...numbersArray.slice(-3)];
        }
        return [...numbersArray.slice(0, 3), pageSpace, totalPages];
      } else return numbersArray;
    }
    if (totalPages > 7) {
      if (currentPage > 3 && currentPage < totalPages - 3) {
        return [
          1,
          pageSpace,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          pageSpace,
          totalPages,
        ];
      }
      if (currentPage >= totalPages - 4) {
        return [1, pageSpace, ...numbersArray.slice(-5)];
      } else {
        return [...numbersArray.slice(0, 5), pageSpace, totalPages];
      }
    } else return numbersArray;
  };

  useEffect(() => {
    if (pathname !== "/") {
      setPageNumber(currentPage - 1);
      currentPage !== 1
        ? push(`?page=${currentPage}`, { scroll: false })
        : push("", { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div
      className={`${
        totalPages <= 1 ? "hidden" : "flex"
      }  mt-xl w-full flex-col items-center justify-between gap-md md:flex-row md:gap-none`}
    >
      <span>
        {t("pages|search$showing")}
        <span className="font-strong"> {firstOnCurrentPage} </span>
        {t("common|to")}
        <span className="font-strong"> {lastOnCurrentPage} </span>
        {t("common|of")} <span className="font-strong"> {searchResult} </span>
        {t("pages|search$results")}
      </span>
      <div className="flex items-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === 1
              ? "cursor-not-allowed [&_path]:opacity-20"
              : "hover:bg-brown-200"
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
                ? "cursor-auto bg-brown-800 text-white"
                : `bg-white ${
                    value !== "..." ? "hover:bg-brown-200" : "cursor-auto"
                  } `
            } flex h-xl w-xl cursor-pointer items-center justify-center`}
          >
            <span>{value}</span>
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === totalPages
              ? "cursor-not-allowed [&_path]:opacity-20"
              : "hover:bg-brown-200"
          }`}
          disabled={currentPage === totalPages}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
};
