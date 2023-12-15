import { usePathname } from "next/navigation";
import { mainNav } from "./navData";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import NavLink from "@/components/navigation/NavLink";
import NavList from "@/components/navigation/NavList";

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

const NavSide: React.FC<SidebarProps> = ({ openSideBar, setOpenSidebar }) => {
  const [menues, setMenues] = useState<any>([]);
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

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

      setMenues(enMenu);
    } else {
      setMenues(mainNav);
    }
  }, [isEn]);

  return (
    <nav
      className={`absolute top-[128px] -mb-[128px] h-[calc(100%-128px)] w-[300px] bg-white transition-all duration-500 ease-in-out ${
        openSideBar ? "right-none" : "-right-full"
      }`}
    >
      <ul className="w-full list-none">
        {menues.map((menu: MenuItem, idx: number) => (
          <li key={idx}>
            {menu.href ? (
              <NavLink
                icon={menu.icon}
                href={menu.href}
                label={t(`common|${menu.title}`)}
                variant={"external"}
              />
            ) : menu.children ? (
              <NavList
                icon={menu.icon}
                list={menu.children}
                label={t(`routes|${menu.title}$title`)}
                setOpenSidebar={setOpenSidebar}
              />
            ) : (
              <NavLink
                href={`/${t(`routes|${menu.title}$path`)}`}
                icon={menu.icon}
                label={t(`routes|${menu.title}$title`)}
                onClick={() => setOpenSidebar(false)}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default NavSide;
