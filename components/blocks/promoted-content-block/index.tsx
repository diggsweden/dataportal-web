import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { ButtonLink } from "@/components/button";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import { PromotedContentFragment } from "@/graphql/__generated__/operations";

export const PromotedContentBlock: FC<PromotedContentFragment> = ({
  heading,
  externalLink,
  buttonText,
  image,
  preamble,
  container,
}) => {
  const { t } = useTranslation("common");
  const link = externalLink || container?.slug;
  const title = heading || container?.title;
  const btnText = buttonText ? buttonText : t("read-more");
  const img = image || container?.image;

  return (
    <div className="bg-white p-lg md:flex">
      {img && (
        <CustomImage
          className="h-full max-h-[21.25rem] object-cover md:w-[45%]"
          image={img}
        />
      )}
      <div className="mt-md flex flex-col justify-between md:ml-xl md:mt-none">
        <div className="mb-xl flex flex-col gap-md md:mb-none md:gap-none">
          <Heading className="md:mb-md" level={2}>
            {title}
          </Heading>
          <p className="line-clamp-4 md:line-clamp-6">
            {preamble || container?.preamble}
          </p>
        </div>
        {link && (
          <ButtonLink
            className="md:mt-lg"
            size="lg"
            label={btnText}
            href={link}
            iconPosition="right"
            icon={ArrowRightIcon}
            data-tracking-name="promoted-content-block"
          />
        )}
      </div>
    </div>
  );
};
