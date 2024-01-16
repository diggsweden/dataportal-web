import { FC } from "react";

/* eslint-disable no-unused-vars */
type Props = {
  page: number;
  totalPages: number;
};
/* eslint-enable no-unused-vars */

export const ProgressBar: FC<Props> = ({ page, totalPages }) => {
  return (
    <div
      className="mb-lg flex w-full overflow-hidden border border-brown-600 bg-white"
      role="progressbar"
      aria-valuenow={page}
      aria-valuemin={1}
      aria-valuemax={totalPages}
    >
      <div
        className="overflow-hidden whitespace-nowrap bg-pink-600 text-center text-white"
        style={{ width: `${(page / totalPages) * 100}%` }}
      >
        {page + "/" + totalPages}
      </div>
    </div>
  );
};
