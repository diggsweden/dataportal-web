import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { mainNav } from "@/components/navigation/Nav/navData";
import NavLink from "@/components/navigation/Nav/NavLink";
import NavList from "@/components/navigation/Nav/NavList";

interface NavSideData {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: NavSideData[];
}

interface NavSideProps {
  openNavSide: boolean;
  setOpenNavSide: Function;
}

const NavSide: FC<NavSideProps> = ({ openNavSide, setOpenNavSide }) => {
  const [menu, setMenu] = useState<any>([]);
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

      setMenu(enMenu);
    } else {
      setMenu(mainNav);
    }
  }, [isEn]);

  return (
    <nav
      className={`absolute top-[128px] -mb-[128px] h-[calc(100%-128px)] w-[300px] bg-white transition-all duration-500 ease-in-out ${
        openNavSide ? "right-none" : "-right-full"
      }`}
    >
      <ul className="w-full list-none">
        {menu.map((menu: NavSideData, idx: number) => (
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
                setOpenNavSide={setOpenNavSide}
              />
            ) : (
              <NavLink
                href={`/${t(`routes|${menu.title}$path`)}`}
                icon={menu.icon}
                label={t(`routes|${menu.title}$title`)}
                onClick={() => setOpenNavSide(false)}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default NavSide;
