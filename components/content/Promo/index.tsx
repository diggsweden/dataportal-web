import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { isExternalLink } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { ImageFragment } from "@/graphql/__generated__/operations";
export interface PromoProps {
  title: string;
  slug: string;
  description?: string;
  preamble?: string;
  showPreamble: boolean;
  linktype?: string;
  __typename?: string;
  image?: ImageFragment;
}

export const Promo: FC<{
  link: PromoProps;
  inline?: boolean;
  icon?: any;
}> = ({ link, icon, inline }) => {
  const { t } = useTranslation("common");
  const Icon = icon;
  const description = link.showPreamble
    ? link.preamble
      ? link.preamble
      : link.description
    : null;

  return (
    <Link
      href={link.slug}
      className="group flex h-full flex-col bg-white text-brown-900 no-underline"
    >
      {icon ? (
        <div className="flex justify-center bg-pink-600">
          <Icon />
        </div>
      ) : (
        link.image && (
          <div className="flex justify-center bg-pink-600">
            {icon ? <Icon /> : <CustomImage image={link.image} />}
          </div>
        )
      )}
      <div className="flex h-full flex-col p-lg">
        <Heading
          level={!inline ? 2 : 3}
          size="sm"
          className={description ? "" : "pb-lg"}
        >
          {link.title}
        </Heading>
        {description && (
          <p className="pb-lg pt-sm text-brown-600">{description}</p>
        )}
        <span className="button button--small button--primary focus--none mt-auto">
          {t("read-more")}
          {isExternalLink(link.slug) ? (
            <ExternalLinkIcon height={16} width={16} viewBox="0 0 24 24" />
          ) : (
            <ArrowRightIcon height={16} width={16} viewBox="0 0 24 24" />
          )}
        </span>
      </div>
    </Link>
  );
};
