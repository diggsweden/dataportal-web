import { usePathname } from "next/navigation";
import { mainMenu } from "./menu-data";
import Image from "next/image";
import arrowRight from "../../../assets/icons/arrowRight.svg";
import externalLink from "../../../assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link.js";
import { useEffect, useState } from "react";

interface MenuItem {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  openSideBar: boolean;
  setOpenSidebar: Function;
}

const SideBar: React.FC<SidebarProps> = ({ openSideBar, setOpenSidebar }) => {
  const [menues, setMenues] = useState<any>([]);
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

  const isActive = (path: string) => {
    if (
      pathname === path ||
      (pathname === "/" && path === t(`common|lang-path`))
    ) {
      return " active";
    } else return "";
  };

  useEffect(() => {
    if (isEn) {
      const enMenu = mainMenu
        .filter(
          (menu) =>
            menu.inEn ||
            (menu.children && menu.children.some((subMennu) => subMennu.inEn)),
        )
        .map((menu) => ({
          ...menu,
          children: menu.children?.filter((subMenu) => subMenu.inEn),
        }));

      setMenues(enMenu);
    } else {
      setMenues(mainMenu);
    }
  }, [isEn]);

  return (
    <div className={`menu${openSideBar ? " open" : ""}`}>
      <ul className="menuList">
        {menues.map((menu: MenuItem, idx: number) => (
          <li key={idx}>
            {menu.href ? (
              <Link href={menu.href} target="_blank">
                <div className="menuitem">
                  <Image
                    className={"svg"}
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  {t(`common|${menu.title}`)}
                  <Image
                    className="svg external"
                    src={externalLink}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                </div>
              </Link>
            ) : menu.children ? (
              <details className="menuDetails">
                <summary className="menuitem">
                  <Image
                    className="svg"
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  <span>{t(`routes|${menu.title}$title`)}</span>
                  <Image
                    className="detailsArrow"
                    src={arrowRight}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                </summary>
                <ul className="subMenu">
                  {menu.children.map((subMenu, idx: number) => (
                    <li
                      key={idx}
                      className={`subMenuItem ${isActive(
                        `/${t(`routes|${subMenu.title}$path`)}`,
                      )}`}
                    >
                      <Link
                        href={`/${t(`routes|${subMenu.title}$path`)}`}
                        onClick={() => setOpenSidebar(false)}
                      >
                        {t(`routes|${subMenu.title}$title`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                href={t(`routes|${menu.title}$path`)}
                onClick={() => setOpenSidebar(false)}
              >
                <div
                  className={`menuitem${isActive(
                    `/${t(`routes|${menu.title}$path`)}`,
                  )}`}
                >
                  <Image
                    className={"svg"}
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  {t(`routes|${menu.title}$title`)}
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SideBar;
