import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import { ButtonLink } from "@/components/button";
import { PromoProps, Promo } from "@/components/promo";
import { Heading } from "@/components/typography/heading";
import { RelatedContentFragment } from "@/graphql/__generated__/operations";

interface RelatedContentProps extends RelatedContentFragment {
  landingPage?: boolean;
}

export const RelatedContentBlock: FC<RelatedContentProps> = ({
  links,
  heading,
  showMoreLink,
  landingPage,
}) => {
  const { t } = useTranslation("pages");

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
              label={t("news$view-all")}
              aria-label={`${t("news$view-all")} ${
                heading ? `- ${heading}` : ""
              }`}
              variant="secondary"
            />
          )}
        </div>
      )}
      <ul
        className={`flex flex-col gap-lg md:grid md:grid-flow-row md:auto-rows-min md:grid-cols-2 ${
          landingPage ? "lg:grid-cols-3" : "max-w-md"
        } ${heading ? "mt-xl" : ""}`}
      >
        {links.map((link: PromoProps, idx: number) => {
          return (
            <li
              key={idx}
              className="group relative flex h-full flex-col bg-white text-brown-900"
            >
              <Promo {...link} heading={heading} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
