import { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { BlockData_Dataportal_Digg_CtaCardBlock_Fragment } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";

export const CtaCardBlock: FC<
  BlockData_Dataportal_Digg_CtaCardBlock_Fragment
> = (props) => {
  return (
    <ContentBox
      heading={props.heading || ""}
      description={props.description || ""}
    >
      <div className="flex flex-wrap justify-center gap-md lg:gap-xl">
        {props.ctaLinks &&
          props.ctaLinks.length > 0 &&
          props.ctaLinks.map(
            (link, idx: number) =>
              link && (
                <ButtonLink
                  key={idx}
                  href={link.link}
                  label={link.name}
                  icon={
                    isExternalLink(link.link)
                      ? ExternalLinkIcon
                      : ArrowRightIcon
                  }
                  iconPosition="right"
                  data-tracking-name="cta-link"
                />
              ),
          )}
      </div>
    </ContentBox>
  );
};
