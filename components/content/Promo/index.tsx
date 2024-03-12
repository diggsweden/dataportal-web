import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { isExternalLink } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { LinkFragment } from "@/graphql/__generated__/operations";
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
        <CustomImage image={image} className="h-[152px] w-full object-cover" />
      )}
      <div className="flex h-full flex-col p-lg">
        <Heading
          level={heading ? 3 : 2}
          size="sm"
          className={ingress ? "" : "pb-lg"}
        >
          {title}
        </Heading>
        {ingress && (
          <p className="mb-lg line-clamp-3 pt-sm text-brown-600">{ingress}</p>
        )}
        <span className="button button--small button--primary focus--none mt-auto">
          {t("read-more")}
          {isExternalLink(slug) ? (
            <ExternalLinkIcon height={16} width={16} viewBox="0 0 24 24" />
          ) : (
            <ArrowRightIcon height={16} width={16} viewBox="0 0 24 24" />
          )}
        </span>
      </div>
    </Link>
  );
};
