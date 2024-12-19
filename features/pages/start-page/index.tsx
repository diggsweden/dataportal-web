import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import { BlockList } from "@/components/blocks/block-list";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { StartPageDataFragment } from "@/graphql/__generated__/operations";
import { dataCategories } from "@/utilities/data-categories";

const DynamicStatisticGraph = dynamic(
  () => import("@/features/statistic/statistic-graph"),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbers = dynamic(
  () => import("@/features/statistic/statistic-numbers"),
  {
    ssr: false,
  },
);

const DynamicStatistic = dynamic(() => import("@/features/statistic"), {
  ssr: false,
});

export const StartPage: FC<StartPageDataFragment> = (props) => {
  const { heading, preamble, image, blocks } = props;
  const pathname = usePathname();
  const { t, lang } = useTranslation();

  return (
    <Container>
      <div id="startPage" className="space-y-md lg:space-y-xl">
        {!image && heading && (
          <Heading level={1} size="lg" className="mb-lg md:mb-xl">
            {heading}
          </Heading>
        )}

        {pathname === `/${t("routes|search-api$path")}` ||
        (!image && preamble) ? (
          <Preamble className="max-w-md">{preamble}</Preamble>
        ) : null}

        <div className={"mb-xl"}>
          {blocks && <BlockList blocks={blocks} landingPage={true} />}
        </div>

        <ContentBox heading={t("pages|startpage$datasets_by_category")}>
          <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
            {dataCategories?.map((category, idx: number) => (
              <li key={idx}>
                <ButtonLink
                  className="text-center"
                  aria-label={t("pages|startpage$search_datasets_format", {
                    category: t(`resources|${category.href}`),
                  })}
                  href={`/${t("routes|datasets$path")}?f=${encodeURIComponent(
                    `http://www.w3.org/ns/dcat#theme||${
                      category.href
                    }||FALSE||uri||${t(
                      "resources|http://www.w3.org/ns/dcat#theme",
                    )}||${t("resources|" + category.href)}`,
                  )}`}
                  label={t(`resources|${category.href}`)}
                />
              </li>
            ))}
          </ul>
        </ContentBox>

        <section id="statistics" className="my-xl">
          <div className="mb-2xl flex flex-col justify-between gap-sm md:flex-row md:items-end">
            <Heading level={2} size={"lg"}>
              {t("pages|statistic$statistic-numbers")}
            </Heading>
            <Link
              href={`/${t("routes|statistics$path")}`}
              locale={lang}
              className="statistic-link"
            >
              {t("pages|statistic$statistic-link")}
            </Link>
          </div>

          <div className="mb-2xl flex flex-wrap justify-between">
            <DynamicStatisticGraph />
            <DynamicStatisticNumbers />
          </div>
          <div className="flex flex-col items-start gap-xl md:grid md:grid-cols-2">
            <DynamicStatistic />
          </div>
        </section>
      </div>
    </Container>
  );
};
