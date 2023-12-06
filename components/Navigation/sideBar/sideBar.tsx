import { usePathname } from "next/navigation";
import { sideBarContent } from "./sideBarContent.js";
import Image from "next/image";
import arrowRight from "../../../assets/icons/arrowRight.svg";
import externalLink from "../../../assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link.js";
import { useEffect, useState } from "react";

interface SidebarItem {
  title: string;
  icon?: any;
  external: boolean;
}

interface SidebarProps {
  openSideBar: boolean;
}

const SideBar: React.FC<SidebarProps> = ({ openSideBar }) => {
  const [menues, setMenues] = useState<any>([]);
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (
      pathname === path ||
      (pathname === "/" && path === t(`common|lang-path`))
    ) {
      return " active";
    } else return "";
  };

  useEffect(() => {
    setMenues(sideBarContent);
  }, []);

  return (
    <div className={`menu${openSideBar ? " open" : ""}`}>
      <ul className="menuList">
        {menues.map((menu: any, idx: number) => (
          <li key={idx}>
            {menu.children ? (
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
                  {menu.children.map((subMenu: SidebarItem, idx: number) => (
                    <li
                      key={idx}
                      className={`subMenuItem ${isActive(
                        `/${t(`routes|${subMenu.title}$path`)}`
                      )}`}
                    >
                      <Link href={`/${t(`routes|${subMenu.title}$path`)}`}>
                        {t(`routes|${subMenu.title}$title`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                href={t(`routes|${menu.title}$path`)}
                target={menu.external && "_blank"}
              >
                <div
                  className={`menuitem${isActive(
                    `/${t(`routes|${menu.title}$path`)}`
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
                  {menu.external && (
                    <Image
                      className="svg external"
                      src={externalLink}
                      height={24}
                      width={24}
                      alt="svg-icon"
                      priority
                    />
                  )}
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
