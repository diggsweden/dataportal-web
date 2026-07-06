import type { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { MenuLinkFragment } from "@/graphql/fragments";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { isExternalLink } from "@/utilities";

export const CtaCardBlockFragment = graphql(`
  fragment CtaCardBlock on dataportal_Digg_CTACardBlock {
    heading
    description
    ctaLinks {
      ...MenuLink
    }
  }
`);

export const CtaCardBlock: FC<{
  block: FragmentType<typeof CtaCardBlockFragment>;
}> = ({ block }) => {
  const { heading, description, ctaLinks } = getFragmentData(
    CtaCardBlockFragment,
    block,
  );

  return (
    <ContentBox heading={heading || ""} description={description || ""}>
      <div className="flex flex-wrap justify-center gap-md lg:gap-xl">
        {ctaLinks?.map((maskedLink) => {
          const link = getFragmentData(MenuLinkFragment, maskedLink);
          return (
            link && (
              <ButtonLink
                key={link.name}
                href={link.link}
                label={link.name}
                icon={
                  isExternalLink(link.link) ? ExternalLinkIcon : ArrowRightIcon
                }
                iconPosition="right"
                data-tracking-name="cta-link"
              />
            )
          );
        })}
      </div>
    </ContentBox>
  );
};
