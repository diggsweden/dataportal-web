import { FC } from "react";
import { PromoProps, Promo } from "@/components/content/Promo";
import { ButtonLink } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import useTranslation from "next-translate/useTranslation";
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
        className={`grid grid-flow-row gap-lg md:auto-rows-min md:grid-cols-2 ${
          landingPage ? "lg:grid-cols-3" : "max-w-md"
        } ${heading ? "mt-xl" : ""}`}
      >
        {links.map((link: PromoProps, idx: number) => {
          return (
            <li key={idx}>
              <Promo {...link} heading={heading} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
