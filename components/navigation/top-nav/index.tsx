import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useEffect, useState } from "react";

import { ButtonLink } from "@/components/button";
import { AddIcon } from "@/types/global";
import { topNav } from "@/utilities/menu-data";

interface TopNavData {
  title: string;
  icon: AddIcon;
  href?: string;
}

interface TopNavProps {
  setOpenSideBar: (_param: boolean) => void;
}

const TopNav: FC<TopNavProps> = ({ setOpenSideBar }) => {
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
        <ul className="flex flex-row space-x-xs">
          {topNav.map((menu: TopNavData, idx: number) => (
            <li key={idx} className="group text-sm">
              {menu.href ? (
                <ButtonLink
                  variant="plain"
                  href={menu.href}
                  icon={menu.icon ? menu.icon : undefined}
                  iconPosition="left"
                  label={t(`common|${menu.title}`)}
                  size={"sm"}
                  className="[&_span]:hidden md:[&_span]:block"
                />
              ) : (
                <ButtonLink
                  variant="plain"
                  href={`/${t(`routes|${menu.title}$path`)}`}
                  locale={`${menu.title === "language" ? "" : lang}`}
                  onClick={() => setOpenSideBar(false)}
                  icon={menu.icon}
                  hrefLang={lang === "sv" ? "en" : "sv"}
                  iconPosition="left"
                  label={t(`routes|${menu.title}$title`)}
                  size={"sm"}
                  className={`${
                    menu.title !== "language" &&
                    "[&_span]:hidden md:[&_span]:block"
                  } ${
                    pathname === `/${t(`routes|${menu.title}$path`)}` &&
                    menu.title !== "language"
                      ? " active"
                      : ""
                  }`}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
