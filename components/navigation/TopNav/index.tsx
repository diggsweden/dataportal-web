import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { topNav } from "@/utilities/menuData";
import { ButtonLink } from "@/components/global/Button";
import { usePathname } from "next/navigation";

interface TopNavData {
  title: string;
  icon: any;
  href?: string;
}

interface TopNavProps {
  setOpenSideBar: Function;
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
    <div className="flex h-[32px] flex-row items-center justify-end">
      <nav aria-label={t("common|menu-service")}>
        <ul className="flex flex-row space-x-xs">
          {topNav.map((menu: TopNavData, idx: number) => (
            <li key={idx} className="group text-sm">
              {menu.href ? (
                <ButtonLink
                  variant="plain"
                  href={menu.href}
                  icon={menu.icon}
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
