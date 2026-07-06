"use client";

import { useLocale, useTranslations } from "next-intl";
import { type FC, Fragment, useEffect, useState } from "react";

import GlobeIcon from "@/assets/icons/globe.svg";
import { Button, ButtonLink } from "@/components/button";
import type { MenuLinkIconFragment } from "@/graphql/gql/graphql";
import { usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useSwitchLocale } from "@/i18n/use-switch-locale";

interface TopNavProps {
  setOpenSideBar: (_param: boolean) => void;
  serviceMenu: MenuLinkIconFragment[];
}

const TopNav: FC<TopNavProps> = ({ setOpenSideBar, serviceMenu }) => {
  const pathname = usePathname();
  const switchLocale = useSwitchLocale();
  const t = useTranslations();
  const lang = useLocale();
  const alternateLocale: AppLocale = lang === "sv" ? "en" : "sv";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const switchLanguage = () => {
    switchLocale(alternateLocale);
    setOpenSideBar(false);
  };

  const languageSwitch = (
    <Button
      aria-label={t("routes.language.title")}
      variant="plain"
      icon={GlobeIcon}
      onClick={switchLanguage}
      iconPosition="left"
      label={t("routes.language.title")}
      size="sm"
    />
  );

  return (
    <div className="flex flex-row items-center justify-end">
      <nav aria-label={t("common.menu-service")}>
        <ul className="flex flex-row items-center space-x-xs">
          {serviceMenu?.length > 0
            ? serviceMenu.map((menu: MenuLinkIconFragment, idx: number) => (
                <Fragment key={menu.link}>
                  <li className="group text-sm">
                    <ButtonLink
                      aria-label={menu.name}
                      variant="plain"
                      href={menu.link}
                      onClick={() => setOpenSideBar(false)}
                      hrefLang={alternateLocale}
                      size={"sm"}
                      className={pathname === menu.link ? " active" : ""}
                    >
                      <span
                        className="inline-flex"
                        dangerouslySetInnerHTML={{ __html: menu.icon }}
                        aria-hidden="true"
                      />
                      <span className="hidden md:block">{menu.name}</span>
                    </ButtonLink>
                  </li>
                  {serviceMenu.length === idx + 1 && <li>{languageSwitch}</li>}
                </Fragment>
              ))
            : languageSwitch}
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
