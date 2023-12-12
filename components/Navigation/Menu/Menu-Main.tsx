import { usePathname } from "next/navigation";
import { mainMenu } from "./menu-data";
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
  setOpenSidebar: Function;
}

const MenuMain: React.FC<SidebarProps> = ({ setOpenSidebar }) => {
  const [menues, setMenues] = useState<any>([]);
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

  useEffect(() => {
    let enMenu;
    if (isEn) {
      enMenu = mainMenu.filter((menu) => menu.promoted && menu.inEn);

      setMenues(enMenu);
    } else {
      enMenu = mainMenu.filter((menu) => menu.promoted);
      setMenues(enMenu);
    }
  }, [isEn]);

  return (
    <div className="mainNav">
      {menues.map((menu: MenuItem, idx: number) => (
        <Link
          key={idx}
          href={t(`routes|${menu.title}$path`)}
          className={`header-link${
            pathname === `/${t(`routes|${menu.title}$path`)}` ? " active" : ""
          }`}
          onClick={() => setOpenSidebar(false)}
        >
          {t(`routes|${menu.title}$title`)}
        </Link>
      ))}
    </div>
  );
};

export default MenuMain;
