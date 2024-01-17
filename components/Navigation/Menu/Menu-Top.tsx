import { usePathname } from "next/navigation";
import { topMenu } from "./menu-data";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TopMenuData {
  title: string;
  icon: any;
  href?: string;
}

interface SidebarProps {
  setOpenSidebar: Function;
}

const MenuTop: React.FC<SidebarProps> = ({ setOpenSidebar }) => {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <nav className="top-nav">
      <ul>
        {topMenu.map((menu: TopMenuData, idx: number) => (
          <li key={idx}>
            {menu.href ? (
              <Link href={menu.href} target="_blank" className="top-link">
                <>
                  <Image
                    src={menu.icon}
                    width={20}
                    height={20}
                    alt={"link icon"}
                    className="svg"
                  />
                  <span className="top-link_text">
                    {t(`common|${menu.title}`)}
                  </span>
                </>
              </Link>
            ) : (
              <Link
                href={`/${t(`routes|${menu.title}$path`)}`}
                locale={`${menu.title === "language" ? "" : lang}`}
                onClick={() => setOpenSidebar(false)}
                className={`top-link${
                  pathname === `/${t(`routes|${menu.title}$path`)}`
                    ? " active"
                    : ""
                }`}
              >
                <>
                  <Image
                    src={menu.icon}
                    width={20}
                    height={20}
                    alt={"link icon"}
                    className="svg"
                  />
                  <span
                    className={menu.title === "language" ? "" : "top-link_text"}
                  >
                    {t(`routes|${menu.title}$title`)}
                  </span>
                </>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuTop;
