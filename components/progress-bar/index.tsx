import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

/* eslint-disable no-unused-vars */
type Props = {
  page: number;
  totalPages: number;
};
/* eslint-enable no-unused-vars */

export const ProgressBar: FC<Props> = ({ page, totalPages }) => {
  const { t } = useTranslation();
  const percentage = (page / totalPages) * 100;

  return (
    <div
      className="mb-lg mt-xl flex w-full overflow-hidden border border-brown-600 bg-white"
      role="progressbar"
      aria-valuenow={page}
      aria-valuemin={1}
      aria-valuemax={totalPages}
      aria-label={`${t("common|menu-form")} ${page} ${t(
        "common|of",
      )} ${totalPages}`}
    >
      <div
        className="overflow-hidden whitespace-nowrap bg-brown-600 text-center text-white"
        style={{ width: `${percentage}%` }}
        aria-hidden="true"
      >
        {page + "/" + totalPages}
      </div>
    </div>
  );
};
