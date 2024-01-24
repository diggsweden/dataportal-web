import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { checkLang } from "@/utilities";
import { FC } from "react";
import HomeIcon from "@/assets/icons/home.svg";
import { Container } from "@/components/layout/Container";
import BreadcrumbDividerIcon from "@/assets/icons/breadcrumbDivider.svg";

export interface BreadcrumbProps {
  name: string;
  crumbs: Breadcrumb[];
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ crumbs, name }) => {
  const { lang } = useTranslation();

  return (
    <Container className="mb-lg py-md md:mb-xl">
      {crumbs.length > 0 && (
        <ul className="flex flex-wrap items-center gap-md">
          {crumbs.map((crumb, index) => {
            return (
              <li
                key={index}
                className="flex items-center gap-md text-sm text-textSecondary hover:text-textPrimary"
              >
                <Link
                  href={`${crumb.link.link}`}
                  locale={lang}
                  className="no-underline"
                >
                  {crumb.name === "start" ? (
                    <HomeIcon className="[&_path]:hover:fill-brown-900" />
                  ) : (
                    checkLang(crumb.name)
                  )}
                </Link>
                {index !== crumbs.length && (
                  <BreadcrumbDividerIcon className="" />
                )}
              </li>
            );
          })}
          <li
            key={"inactive-breadcrumb"}
            className="breadcrumb__list--item text-xs font-strong antialiased"
          >
            {checkLang(name)}
          </li>
        </ul>
      )}
    </Container>
  );
};
