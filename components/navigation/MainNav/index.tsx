import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import Link from "next/link.js";
import { Button, ButtonLink } from "@/components/global/Button";
import { mainNav } from "@/utilities/menuData";
import DataportalLogo from "@/assets/logos/dataportal.svg";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";

interface MainNavData {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: MainNavData[];
}

interface MainNavProps {
  setOpenSideBar: Function;
  openSideBar: boolean;
}

const MainNav: FC<MainNavProps> = ({ setOpenSideBar, openSideBar }) => {
  const [menues, setMenues] = useState<any>([]);
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

  useEffect(() => {
    let enMenu;
    if (isEn) {
      enMenu = mainNav.filter((menu) => menu.promoted && menu.inEn);

      setMenues(enMenu);
    } else {
      enMenu = mainNav.filter((menu) => menu.promoted);
      setMenues(enMenu);
    }
  }, [isEn]);

  return (
    <div className="flex flex-row items-center justify-between">
      <Link
        href={`${t(`common|${"lang-path"}`)}`}
        onClick={() => setOpenSideBar(false)}
        className="focus:outline-white"
      >
        <DataportalLogo
          viewBox="0 0 228 44"
          className="h-[32px] w-[160px] md:h-[44px] md:w-[228px]"
        />
      </Link>
      <div className="flex flex-row items-center">
        <nav className="hidden flex-row items-center gap-sm lg:flex">
          {menues.map((menu: MainNavData, idx: number) => (
            <ButtonLink
              key={idx}
              href={`/${t(`routes|${menu.title}$path`)}`}
              onClick={() => setOpenSideBar(false)}
              label={t(`routes|${menu.title}$title`)}
              className={`focus:-outline-offset-2 focus:outline-white ${
                pathname === `/${t(`routes|${menu.title}$path`)}`
                  ? " active"
                  : ""
              }`}
            />
          ))}
        </nav>
        <Button
          icon={openSideBar ? CloseCrossIcon : HamburgerIcon}
          iconPosition="left"
          onClick={() => setOpenSideBar(!openSideBar)}
          label={t("common|menu")}
          className="focus:-outline-offset-2 focus:!outline-white"
        />
      </div>
    </div>
  );
};

export default MainNav;
