import { topNav } from "./navData";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components";
import DiggSmall from "@/assets/logos/diggSmall.svg";

interface TopMenuData {
  title: string;
  icon: any;
  href?: string;
}

interface SidebarProps {
  setOpenSidebar: Function;
}

const NavTop: React.FC<SidebarProps> = ({ setOpenSidebar }) => {
  const { t, lang } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex h-[32px] flex-row items-center justify-between">
      <Link href={"https://digg.se/"} target="_blank">
        <DiggSmall />
      </Link>
      <nav>
        <ul className="flex flex-row">
          {topNav.map((menu: TopMenuData, idx: number) => (
            <li key={idx} className="group text-sm">
              {menu.href ? (
                <>
                  <ButtonLink
                    href={menu.href}
                    icon={menu.icon}
                    iconPosition="left"
                    label={t(`common|${menu.title}`)}
                    size={"sm"}
                    className="[&_span]:hidden md:[&_span]:block"
                  />
                </>
              ) : (
                <ButtonLink
                  href={`/${t(`routes|${menu.title}$path`)}`}
                  locale={`${menu.title === "language" ? "" : lang}`}
                  onClick={() => setOpenSidebar(false)}
                  icon={menu.icon}
                  iconPosition="left"
                  label={t(`routes|${menu.title}$title`)}
                  size={"sm"}
                  className={`${
                    menu.title !== "language" &&
                    "[&_span]:hidden md:[&_span]:block"
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

export default NavTop;
