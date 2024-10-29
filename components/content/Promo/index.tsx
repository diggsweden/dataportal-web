import { FC, useContext } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { isExternalLink } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { LinkFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/SettingsProvider";
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
    <Link
      href={slug}
      className="group flex h-full flex-col bg-white text-brown-900 no-underline"
    >
      {image && (
        <CustomImage
          image={image}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-[152px] w-full object-cover"
        />
      )}
      <div className="flex h-full flex-col p-lg">
        <Heading
          level={heading ? 3 : 2}
          size="sm"
          className={ingress ? "mb-sm" : "mb-lg"}
        >
          {title}
        </Heading>
        {ingress && (
          <p className="mb-lg line-clamp-3 text-brown-600">{ingress}</p>
        )}
        <span className="button button--small button--primary focus--none mt-auto">
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
    </Link>
  );
};
