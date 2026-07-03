import { useTranslations } from "next-intl";
import { StatisticListItem } from "@/components/statistic/statistic-list-item";
import { Heading } from "@/components/typography/heading";
import type { StatisticTopList } from "@/lib/statistic";

interface StatisticProps {
  organisations: StatisticTopList;
  categories: StatisticTopList;
  topItemsToShow?: number;
}

export function Statistic({
  organisations,
  categories,
  topItemsToShow = 5,
}: StatisticProps) {
  const t = useTranslations();

  return (
    <>
      <section
        className="focus--primary block bg-white p-xl"
        aria-label={t("pages.statistic.top-organisations")}
      >
        <Heading level={3} size="sm" className="mb-lg">
          {t("pages.statistic.top-organisations")}
        </Heading>

        <ol key="toplist-organisation" className="list-decimal pl-lg">
          {organisations.series.slice(0, topItemsToShow).map((count, index) => (
            <StatisticListItem
              key={organisations.values[index] ?? `org-${index}`}
              listText={organisations.labels[index]}
              listNumber={count}
              translation={t("pages.datasets.datasets")}
              listUrl={`/datasets?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${
                organisations.values[index]
                  ? encodeURIComponent(organisations.values[index])
                  : ""
              }%7C%7Cfalse%7C%7Curi%7C%7COrganisationer%7C%7C${
                organisations.labels[index]
              }`}
            />
          ))}
        </ol>
      </section>

      <section
        className="focus--primary block bg-white p-xl"
        aria-label={t("pages.statistic.top-categories")}
      >
        <Heading level={3} size="sm" className="mb-lg">
          {t("pages.statistic.top-categories")}
        </Heading>

        <ol className="list-decimal pl-lg">
          {categories.series.slice(0, topItemsToShow).map((count, index) => (
            <StatisticListItem
              key={categories.values[index] ?? `cat-${index}`}
              listText={categories.labels[index]}
              listNumber={count}
              translation={t("pages.datasets.datasets")}
              listUrl={`/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7C${
                categories.values[index]
                  ? encodeURIComponent(categories.values[index])
                  : ""
              }%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7C${
                categories.labels[index]
              }`}
            />
          ))}
        </ol>
      </section>
    </>
  );
}
