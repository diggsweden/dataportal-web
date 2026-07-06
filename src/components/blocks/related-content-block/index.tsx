import { cx } from "class-variance-authority";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { ButtonLink } from "@/components/button";
import { LinkFragment, Promo } from "@/components/promo";
import { Heading } from "@/components/typography/heading";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";

export const RelatedContentFragment = graphql(`
  fragment RelatedContent on dataportal_Digg_RelatedContent {
    id
    heading
    showMoreLink
    links {
      ...Link
    }
  }
`);

interface RelatedContentProps {
  block: FragmentType<typeof RelatedContentFragment>;
  landingPage?: boolean;
  formPage?: boolean;
}

export const RelatedContentBlock: FC<RelatedContentProps> = ({
  block,
  landingPage,
  formPage,
}) => {
  const { links, heading, showMoreLink } = getFragmentData(
    RelatedContentFragment,
    block,
  );
  const t = useTranslations();

  return (
    <>
      {heading && (
        <div className="flex justify-between gap-sm text-2xl">
          {heading && (
            <Heading level={2} size={"md"}>
              {heading}
            </Heading>
          )}

          {showMoreLink && (
            <ButtonLink
              size="sm"
              href={showMoreLink}
              label={t("pages.news.view-all")}
              aria-label={`${t("pages.news.view-all")} ${
                heading ? `- ${heading}` : ""
              }`}
              variant="secondary"
            />
          )}
        </div>
      )}
      <ul
        className={cx(
          "flex flex-col gap-lg md:grid md:grid-flow-row md:auto-rows-min md:grid-cols-2",
          landingPage ? "lg:grid-cols-3" : "max-w-md",
          heading && "mt-xl",
          formPage && "max-w-xl lg:grid-cols-3",
        )}
      >
        {links.map((link, idx: number) => {
          const { slug, title } = getFragmentData(LinkFragment, link);
          return (
            <li
              key={slug || title || `related-link-${idx}`}
              className="group relative flex h-full flex-col bg-white text-brown-900"
            >
              <Promo link={link} heading={heading} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
