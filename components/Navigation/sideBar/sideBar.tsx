import { usePathname } from "next/navigation";
import { sideBarContent } from "./sideBarContent.js";
import Image from "next/image";
import arrowRight from "../../../assets/icons/arrowRight.svg";
import externalLink from "../../../assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link.js";

interface SidebarItem {
  title: string;
  icon?: any;
  external: boolean;
}

interface SidebarProps {
  openSideBar: boolean;
}

const SideBar: React.FC<SidebarProps> = ({ openSideBar }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    console.log(path);
    if (
      pathname === path ||
      (pathname === "/" && path === t(`common|lang-path`))
    ) {
      return true;
    } else return false;
  };

  return (
    <div className={`menu${openSideBar ? " open" : ""}`}>
      <ul className="menuList">
        {sideBarContent.map((menu: any, idx: number) => (
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
                      className={`subMenuItem ${
                        isActive(`/${t(`routes|${subMenu.title}$path`)}`)
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link href={`/${t(`routes|${subMenu.title}$path`)}`}>
                        {t(`routes|${subMenu.title}$title`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link href={t(`routes|${menu.title}$path`)} legacyBehavior>
                <a
                  className={`menuitem${
                    isActive(`/${t(`routes|${menu.title}$path`)}`)
                      ? " active"
                      : ""
                  }`}
                  target={menu.external && "_blank"}
                >
                  <Image
                    className={
                      isActive(`/${t(`routes|${menu.title}$path`)}`)
                        ? ""
                        : "svg"
                    }
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
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SideBar;
