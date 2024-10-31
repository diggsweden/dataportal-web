import { FC, useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { mainNav } from "@/utilities/menuData";
import SideBarLink from "@/components/navigation/SideBar/SideBarLink.tsx";
import { useClickOutside } from "@/hooks/useClickOutside";
import { createFocusTrap, FocusTrap } from "focus-trap";

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
  const trapRef = useRef<FocusTrap | null>(null);
  const ref = useClickOutside(
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

  useEffect(() => {
    if (openSideBar && vw < 600 && ref.current) {
      trapRef.current = createFocusTrap(ref.current, {
        escapeDeactivates: false,
        allowOutsideClick: true,
      });
      trapRef.current.activate();
    }

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
    };
  }, [openSideBar, vw]);

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && openSideBar && vw < 768) {
      setOpenSideBar(false);
    }
  };

  return (
    <nav
      id="sidebar"
      role="navigation"
      ref={ref}
      className={`absolute right-none top-[8.5rem] z-50 -mb-[8.5rem] h-[calc(100%-8.5rem)] overflow-y-auto 
      overflow-x-hidden bg-white transition-all duration-300 ease-in-out md:overflow-y-visible
      ${openSideBar ? "w-full md:w-[18.75rem]" : "w-none"}`}
      aria-label={t("common|menu-sidebar")}
      onKeyDown={handleEscape}
    >
      <ul className="w-full list-none whitespace-nowrap md:w-[18.75rem]">
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
