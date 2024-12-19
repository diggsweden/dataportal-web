import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, Fragment, useEffect, useState } from "react";

import GlobeIcon from "@/assets/icons/globe.svg";
import { ButtonLink } from "@/components/button";
import { MenuLinkIconFragment } from "@/graphql/__generated__/operations";

interface TopNavProps {
  setOpenSideBar: (_param: boolean) => void;
  serviceMenu: MenuLinkIconFragment[];
}

const TopNav: FC<TopNavProps> = ({ setOpenSideBar, serviceMenu }) => {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-end">
      <nav aria-label={t("common|menu-service")}>
        <ul className="flex flex-row items-center space-x-xs">
          {serviceMenu?.length > 0 ? (
            serviceMenu.map((menu: MenuLinkIconFragment, idx: number) => (
              <Fragment key={idx}>
                <li className="group text-sm">
                  <ButtonLink
                    variant="plain"
                    href={menu.link}
                    locale={lang}
                    onClick={() => setOpenSideBar(false)}
                    hrefLang={lang === "sv" ? "en" : "sv"}
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
                {serviceMenu.length === idx + 1 && (
                  <li>
                    <ButtonLink
                      variant="plain"
                      href={`/${t(`routes|language$path`)}`}
                      icon={GlobeIcon}
                      locale={""}
                      onClick={() => setOpenSideBar(false)}
                      hrefLang={lang === "sv" ? "en" : "sv"}
                      iconPosition="left"
                      label={t(`routes|language$title`)}
                      size={"sm"}
                    />
                  </li>
                )}
              </Fragment>
            ))
          ) : (
            <ButtonLink
              variant="plain"
              href={`/${t(`routes|language$path`)}`}
              icon={GlobeIcon}
              locale={""}
              onClick={() => setOpenSideBar(false)}
              hrefLang={lang === "sv" ? "en" : "sv"}
              iconPosition="left"
              label={t(`routes|language$title`)}
              size={"sm"}
            />
          )}
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
