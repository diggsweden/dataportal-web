import { usePathname } from "next/navigation";
import { sideBarContent } from "./sideBarContent.js";
import Image from "next/image";
import arrowRight from "../../../public/icons/arrowRight.svg";
import externalLink from "../../../public/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link.js";

function SideBar({ openSideBar }: any) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isActive = (path: any) => {
    if (pathname === path || pathname === t(`common|${path}`)) {
      return true;
    } else return false;
  };
  return (
    <div className={`menu${openSideBar ? " open" : ""}`}>
      <ul className="menuList">
        {sideBarContent.map((menu: any, idx: number) => (
          <li key={idx}>
            {menu.href ? (
              <Link
                href={`${menu.href === "lang-path" ? "/" : menu.href}`}
                legacyBehavior
              >
                <a
                  className={`menuitem${isActive(menu.href) ? " active" : ""}`}
                  target={menu.external && "_blank"}
                >
                  <Image
                    className={isActive(menu.href) ? "" : "svg"}
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  {t(`common|${menu.title}`)}
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
            ) : (
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
                  <span>{t(`common|${menu.title}`)}</span>
                  <Image
                    className="detailsArrow"
                    src={arrowRight}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                </summary>
                ​
                <ul className="subMenu">
                  {menu.children.map((subMenu: any, idx: number) => (
                    <li
                      key={idx}
                      className={`subMenuItem ${
                        isActive(subMenu.href) ? "active" : ""
                      }`}
                    >
                      <Link href={subMenu.href}>
                        {t(`common|${subMenu.title}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default SideBar;
