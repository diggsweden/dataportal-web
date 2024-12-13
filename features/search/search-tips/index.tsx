import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

interface SearchTipsProps {
  pageType: "datasets" | "organisations";
}

export const SearchTips: FC<SearchTipsProps> = ({ pageType }) => {
  const { t } = useTranslation();
  if (pageType === "datasets") {
    return (
      <div>
        <ul className="ml-lg list-disc space-y-xs">
          <li>
            <p>{t(`pages|search$search-${pageType}-tips-1`)}</p>
          </li>
          <li>
            <p>{t(`pages|search$search-${pageType}-tips-2`)}</p>
          </li>
          <li>
            <p>{t(`pages|search$search-${pageType}-tips-3`)}</p>
          </li>
          <li>
            <p>{t(`pages|search$search-${pageType}-tips-4`)}</p>
          </li>
          <li>
            <p>{t(`pages|search$search-${pageType}-tips-5`)}</p>
          </li>
        </ul>
        <p className={`pb-lg pt-lg text-lg text-brown-600`}>
          {t(`pages|search$search-tips-filter-head`)}
        </p>
        <ul className="ml-lg list-disc space-y-xs">
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-1.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-1.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-2.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-2.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-3.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-3.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-4.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-4.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-5.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-5.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-6.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-6.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-7.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-7.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-8.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-8.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>{t(`pages|search$search-${pageType}-filter-9.1`)}</strong>
              {t(`pages|search$search-${pageType}-filter-9.2`)}
            </p>
          </li>
          <li>
            <p>
              <strong>
                {t(`pages|search$search-${pageType}-filter-10.1`)}
              </strong>
              {t(`pages|search$search-${pageType}-filter-10.2`)}
            </p>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul className="ml-lg list-disc space-y-xs">
        <li>
          <p>
            <strong>{t(`pages|search$search-${pageType}-filter-1.1`)}</strong>
            {t(`pages|search$search-${pageType}-filter-1.2`)}
          </p>
        </li>
      </ul>
    </div>
  );
};
