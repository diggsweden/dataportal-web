import { mainNav } from "./navData";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import Dataportal from "@/assets/logos/dataportal.svg";
import { Button, ButtonLink } from "@/components/global/Buttons";
import CloseCross from "@/assets/icons/closeCross.svg";
import Hamburger from "@/assets/icons/hamburger.svg";

interface MenuItem {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  setOpenSidebar: Function;
  openSideBar: boolean;
}

const NavBottom: React.FC<SidebarProps> = ({ setOpenSidebar, openSideBar }) => {
  const [menues, setMenues] = useState<any>([]);
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
    <div className="flex flex-row items-center justify-end md:justify-between">
      <Link
        className="hidden md:block"
        href={t(`common|${"lang-path"}`)}
        onClick={() => setOpenSidebar(false)}
      >
        <Dataportal />
      </Link>
      <div className="flex flex-row items-center">
        <nav className="hidden flex-row items-center gap-sm lg:flex">
          {menues.map((menu: MenuItem, idx: number) => (
            <ButtonLink
              key={idx}
              href={t(`routes|${menu.title}$path`)}
              onClick={() => setOpenSidebar(false)}
              label={t(`routes|${menu.title}$title`)}
            />
          ))}
        </nav>
        <Button
          icon={openSideBar ? CloseCross : Hamburger}
          iconPosition="left"
          onClick={() =>
            openSideBar ? setOpenSidebar(false) : setOpenSidebar(true)
          }
          label={t("common|menu")}
        />
      </div>
    </div>
  );
};

export default NavBottom;
