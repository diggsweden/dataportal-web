import { usePathname } from "next/navigation";
import { mainMenu } from "./menuData";
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
    <nav
      className={`absolute right-none top-[128px] h-full w-[300px] bg-white transition-all duration-500 ease-in-out ${
        openSideBar ? "flex" : "-right-full"
      }`}
    >
      <ul className="w-full list-none">
        {menues.map((menu: MenuItem, idx: number) => (
          <li key={idx} className="group cursor-pointer">
            {menu.href ? (
              <Link href={menu.href} target="_blank">
                <div className="flex w-full flex-row items-center gap-md p-md  text-brown-600">
                  <Image
                    className={"svg"}
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  <span className="w-full underline-offset-4 group-hover:underline">
                    {t(`common|${menu.title}`)}
                  </span>
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
              <details className="flex">
                <summary className="box-border inline-flex w-full flex-row gap-md p-md text-brown-600">
                  <Image
                    className="svg"
                    src={menu.icon}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                  <span className="w-full underline-offset-4 hover:underline">
                    {t(`routes|${menu.title}$title`)}
                  </span>
                  <Image
                    className="detailsArrow"
                    src={arrowRight}
                    height={24}
                    width={24}
                    alt="svg-icon"
                    priority
                  />
                </summary>
                <ul className="pl-[48px] pr-lg">
                  {menu.children.map((subMenu, idx: number) => (
                    <li key={idx}>
                      <Link
                        href={`/${t(`routes|${subMenu.title}$path`)}`}
                        onClick={() => setOpenSidebar(false)}
                        className="group flex w-full flex-row items-center gap-md py-md"
                      >
                        <span className="text-brown-600 underline-offset-4 group-hover:underline">
                          {t(`routes|${subMenu.title}$title`)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                href={t(`routes|${menu.title}$path`)}
                onClick={() => setOpenSidebar(false)}
                className="inline-flex w-full p-md"
              >
                <div
                  className={`inline-flex w-full flex-row items-center gap-md text-brown-600 ${isActive(
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
                  <span className="underline-offset-4 group-hover:underline">
                    {t(`routes|${menu.title}$title`)}
                  </span>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default SideBar;
