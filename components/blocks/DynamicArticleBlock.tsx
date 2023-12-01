import { css, space, Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import dynamic from "next/dynamic";

export const DynamicArticleBlock: React.FC<any> = ({ publications, tag }) => {
  const { t } = useTranslation("pages");
  const newOrExamples = tag === "Nyhet";
  const DynamicArticleBlock = dynamic(
    () => import("./Article").then((c) => c.ArticleBlock),
    {
      ssr: false,
    }
  );
  // I´ll be back for this
  const articles = publications.filter((e: any) => e.tags[0].value === tag);

  return (
    <>
      <div className="domain-page__show_more--link">
        <Heading
          level={2}
          size="xl"
          color="white"
          css={css`
            ${space({ pt: 4 })}
          `}
        >
          {newOrExamples
            ? t("pages|startpage$news")
            : t("pages|startpage$good-examples")}
        </Heading>
        <Link
          href={
            newOrExamples
              ? t("routes|news$path")
              : t("routes|good-examples$path")
          }
          className="text-base"
        >
          {newOrExamples
            ? t("pages|news$view-all")
            : t("pages|good-examples$view-all")}
        </Link>
      </div>
      <DynamicArticleBlock articles={articles} />
    </>
  );
};
