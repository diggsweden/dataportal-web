import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import { LinkFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { isExternalLink } from "@/utilities";

export interface PromoProps extends LinkFragment {
  heading?: string | null;
}

export const Promo: FC<PromoProps> = ({
  slug,
  title,
  customPreamble,
  image,
  description,
  showPreamble,
  heading,
}) => {
  const { t } = useTranslation("common");
  const { iconSize } = useContext(SettingsContext);

  const ingress = showPreamble
    ? customPreamble
      ? customPreamble
      : description
    : null;

  return (
    <>
      {image && (
        <CustomImage
          image={image}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-full max-h-[9.5rem] w-full object-cover"
        />
      )}
      <div className="flex h-full flex-col p-lg">
        <Link
          href={slug}
          className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
        >
          <Heading
            level={heading ? 3 : 2}
            size="sm"
            className={ingress ? "mb-sm" : "mb-lg"}
          >
            {title}
          </Heading>
        </Link>
        {ingress && (
          <p className="mb-lg line-clamp-3 text-brown-600">{ingress}</p>
        )}
        <span className="button button--small button--primary focus--none mt-auto group-focus-within:bg-brown-800">
          {t("read-more")}
          {isExternalLink(slug) ? (
            <>
              <ExternalLinkIcon
                height={iconSize}
                width={iconSize}
                viewBox="0 0 24 24"
                className="flex-shrink-0"
              />
              <span className="sr-only">{t("common|open-in-new-tab")}</span>
            </>
          ) : (
            <ArrowRightIcon
              height={iconSize}
              width={iconSize}
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            />
          )}
        </span>
      </div>
    </>
  );
};
