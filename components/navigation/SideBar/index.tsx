import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { mainNav } from "@/utilities/menuData";
import SideBarLink from "@/components/navigation/SideBar/SideBarLink.tsx";
import { useClickoutside } from "@/hooks/useClickoutside";

interface NavSideData {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: NavSideData[];
}

interface NavSideProps {
  openSideBar: boolean;
  setOpenSideBar: Function;
}

export const SideBar: FC<NavSideProps> = ({ openSideBar, setOpenSideBar }) => {
  const [menu, setMenu] = useState<any>([]);
  const { t, lang } = useTranslation();
  const [vw, setVw] = useState(0);
  const isEn = lang === "en";
  const ref = useClickoutside(
    () => (vw < 1200 ? setOpenSideBar(false) : null),
    ["#sidebarBtn"],
  );
  useEffect(() => {
    if (isEn) {
      const enMenu = mainNav
        .filter(
          (menu) =>
            menu.inEn ||
            (menu.children && menu.children.some((subMennu) => subMennu.inEn)),
        )
        .map((menu) => ({
          ...menu,
          children: menu.children?.filter((subMenu) => subMenu.inEn),
        }));

      setMenu(enMenu);
    } else {
      setMenu(mainNav);
    }
  }, [isEn]);

  useEffect(() => {
    if (typeof window !== "undefined" && vw === 0) {
      setVw(window.innerWidth);
    }

    window.addEventListener("resize", () => setVw(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setVw(window.innerWidth));
  });

  return (
    <nav
      id="sidebar"
      role="navigation"
      ref={ref}
      className={`absolute right-none top-[136px] z-50 -mb-[136px] h-[calc(100%-136px)] overflow-y-auto 
      overflow-x-hidden bg-white transition-all duration-300 ease-in-out md:overflow-y-visible
      ${openSideBar ? "w-full md:w-[300px]" : "w-none"}`}
      aria-label={t("common|menu-sidebar")}
    >
      <ul className="w-full list-none whitespace-nowrap md:w-[300px]">
        {menu.map((menu: NavSideData, idx: number) => (
          <li key={idx} className="whitespace-nowrap">
            {menu.href ? (
              <SideBarLink
                level="1"
                icon={menu.icon}
                href={menu.href}
                label={t(`common|${menu.title}`)}
                variant={"external"}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
              />
            ) : menu.children ? (
              <SideBarLink
                level="2"
                icon={menu.icon}
                list={menu.children}
                label={t(`routes|${menu.title}$title`)}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
              />
            ) : (
              <SideBarLink
                level="1"
                href={`/${t(`routes|${menu.title}$path`)}`}
                icon={menu.icon}
                label={t(`routes|${menu.title}$title`)}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
