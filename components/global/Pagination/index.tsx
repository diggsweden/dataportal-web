import Arrow from "@/assets/icons/chevronRight.svg";
import useTranslation from "next-translate/useTranslation";
import { PublicationDataFragment as Publication } from "@/graphql/__generated__/operations";
import { ContainerDataFragment as IContainer } from "@/graphql/__generated__/operations";

type Pagination = {
  publications: Publication[] | IContainer[];
  currentPage: number;
  setCurrentPage: Function;
};

export const Pagination: React.FC<Pagination> = ({
  publications,
  currentPage,
  setCurrentPage,
}) => {
  const pageCount = Math.ceil(publications.length / 12);
  const pagination = Array.from({ length: pageCount }, (_, index) => index + 1);
  const lastIndex = pagination[pagination.length - 1];
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-between">
      <span>
        {t("pages|search$page")} {currentPage} {t("common|of")} {pageCount}
      </span>
      <div className="flex items-center">
        <button
          onClick={
            currentPage !== 1
              ? () => setCurrentPage(currentPage - 1)
              : () => null
          }
          className={`flex h-xl w-xl items-center justify-center bg-white ${
            currentPage === 1 ? "[&_path]:opacity-50" : ""
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
                : "bg-white hover:bg-brown-200"
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
            currentPage === lastIndex ? "[&_path]:opacity-50" : ""
          }`}
          disabled={currentPage === lastIndex}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
};
