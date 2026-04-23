import { createFocusTrap, type FocusTrap } from "focus-trap";
import useTranslation from "next-translate/useTranslation";
import {
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { SidebarLink } from "@/components/navigation/sidebar/sidebar-link";
import type { MenuLinkIconFragment } from "@/graphql/__generated__/operations";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { SubLink } from "@/types/global";

interface NavSideProps {
  openSideBar: boolean;
  setOpenSideBar: (_param: boolean) => void;
  sidebarMenu: MenuLinkIconFragment[] | SubLink[];
}

export const Sidebar: FC<NavSideProps> = ({
  openSideBar,
  setOpenSideBar,
  sidebarMenu,
}) => {
  const { t } = useTranslation();
  const [vw, setVw] = useState(0);
  const trapRef = useRef<FocusTrap | null>(null);
  const navRef = useRef<HTMLElement>(null);
  useClickOutside(
    () => (vw < 1200 ? setOpenSideBar(false) : null),
    ["#sidebarBtn"],
    navRef,
  );

  useEffect(() => {
    if (typeof window !== "undefined" && vw === 0) {
      setVw(window.innerWidth);
    }

    window.addEventListener("resize", () => setVw(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setVw(window.innerWidth));
  });

  useEffect(() => {
    if (openSideBar && vw < 600 && navRef.current) {
      trapRef.current = createFocusTrap(navRef.current, {
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

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && openSideBar && vw < 768) {
      setOpenSideBar(false);
    }
  };

  return (
    <nav
      id="sidebar"
      ref={navRef}
      className={`absolute right-none top-[8.5rem] z-50 -mb-[8.5rem] h-[calc(100%-8.5rem)] overflow-y-auto 
      overflow-x-hidden bg-white transition-all duration-300 ease-in-out md:overflow-y-visible
      ${openSideBar ? "w-full md:w-[18.75rem]" : "w-none"}`}
      aria-label={t("common|menu-sidebar")}
      onKeyDown={handleEscape}
    >
      <ul className="w-full list-none whitespace-nowrap md:w-[18.75rem]">
        {sidebarMenu?.length > 0 &&
          sidebarMenu.map((menu: MenuLinkIconFragment | SubLink) => (
            <li
              key={
                menu.__typename === "dataportal_Digg_MenuLinkIcon"
                  ? menu.link
                  : `${menu.title}-${menu.links.map((l) => l.link).join("|")}`
              }
              className="whitespace-nowrap"
            >
              {menu.__typename === "dataportal_Digg_MenuLinkIcon" ? (
                <SidebarLink
                  level="1"
                  icon={menu.icon}
                  href={menu.link}
                  label={menu.name}
                  variant={"external"}
                  openSideBar={openSideBar}
                  setOpenSideBar={setOpenSideBar}
                />
              ) : (
                <SidebarLink
                  level="2"
                  icon={menu.icon}
                  list={menu.links}
                  label={menu.title}
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
