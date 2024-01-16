import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isExternalLink } from "@/utilities";

export interface PromoProps {
  title: string;
  slug: string;
  description?: string;
  linktype?: string;
  __typename?: string;
}

export const Promo: FC<{
  link: PromoProps;
  icon?: any;
  inline?: boolean;
}> = ({ link, icon, inline }) => {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const Icon = icon;

  return (
    <Link
      href={
        isExternalLink(link.slug)
          ? link.slug
          : pathname === "/" || pathname === "/data"
          ? `${link.slug}`
          : `${pathname}${link.slug}`
      }
      className="group flex h-full flex-col bg-white text-brown-900 no-underline"
    >
      {icon && (
        <div className="flex justify-center bg-pink-600">
          <Icon />
        </div>
      )}
      <div className="flex h-full flex-col p-lg">
        <Heading
          level={3}
          size="sm"
          className={link.description && !inline ? "" : "pb-lg"}
        >
          {link.title}
        </Heading>
        {link.description && !inline && (
          <p className="pb-lg pt-sm text-brown-600">{link.description}</p>
        )}
        <span className="button button--small button--primary mt-auto">
          {t("read-more")}
          <ArrowRightIcon height={16} width={16} viewBox="0 0 24 24" />
        </span>
      </div>
    </Link>
  );
};