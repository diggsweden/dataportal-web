import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

import BreadcrumbDividerIcon from "@/assets/icons/breadcrumbDivider.svg";
import HomeIcon from "@/assets/icons/home.svg";
import { Container } from "@/components/layout/container";
import type { Breadcrumb } from "@/types/global";
import { checkLang } from "@/utilities";

export interface BreadcrumbProps {
  name: string;
  crumbs: Breadcrumb[];
}

export const Breadcrumbs: FC<BreadcrumbProps> = ({ crumbs, name }) => {
  const { t, lang } = useTranslation();

  return (
    <Container>
      <nav className="mb-lg py-md md:mb-xl" aria-label={t("common|breadcrumb")}>
        {crumbs.length > 0 && (
          <ul className="flex flex-wrap items-center gap-md">
            {crumbs.map((crumb, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center gap-md text-sm text-textSecondary hover:text-textPrimary"
                >
                  <Link
                    aria-label={crumb.name}
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
      </nav>
    </Container>
  );
};
