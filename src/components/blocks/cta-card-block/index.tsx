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
        {ctaLinks?.map((maskedLink, index) => {
          const link = getFragmentData(MenuLinkFragment, maskedLink);
          return (
            link && (
              <ButtonLink
                // biome-ignore lint/suspicious/noArrayIndexKey: cta links can share the same name and url, so the index guarantees a unique key
                key={`${link.name}-${link.link}-${index}`}
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
