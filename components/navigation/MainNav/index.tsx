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
import { SearchInput } from "@/components/content/Search/SearchInput";
import SearchIcon from "@/assets/icons/search.svg";

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
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [query, setQuery] = useState("");
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
          className={`${
            openSearch
              ? "hidden lg:block xl:w-[150px]"
              : "h-[32px] w-[160px] md:h-[44px] md:w-[228px] "
          } `}
        />
      </Link>
      <div className="flex w-full flex-row items-center justify-end">
        <nav className="hidden flex-row items-center gap-sm xl:flex">
          {menues.map((menu: MainNavData, idx: number) => (
            <ButtonLink
              key={idx}
              href={`/${t(`routes|${menu.title}$path`)}`}
              onClick={() => setOpenSideBar(false)}
              label={t(`routes|${menu.title}$title`)}
              className={`focus:-outline-offset-2 focus:outline-white ${
                pathname.startsWith(`/${t(`routes|${menu.title}$path`)}`)
                  ? " active"
                  : ""
              }`}
            />
          ))}
        </nav>
        <div className="relative left-none flex w-full justify-end md:w-auto">
          {!openSearch ? (
            <Button
              onClick={() => setOpenSearch(!openSearch)}
              className="cursor-pointer p-[10px] hover:bg-brown-800"
            >
              <SearchIcon />
            </Button>
          ) : (
            <form
              className={`transition-width max-w-[274px] text-sm duration-100 md:w-[274px] [&_div]:mr-none [&_div_div_button]:p-[10px] first:[&_div_div_button]:bg-transparent hover:first:[&_div_div_button]:bg-brown-200  ${
                openSearch
                  ? "w-full [&_div_div_button]:bg-brown-800 last:hover:[&_div_div_button]:bg-brown-900"
                  : "w-none overflow-hidden"
              }`}
              action="/search"
            >
              <SearchInput
                id="header-search"
                placeholder={t("common|search")}
                query={query}
                setQuery={setQuery}
                type="small"
                className="!h-[44px] border-none !bg-brown-100 pr-[90px] hover:outline-0 focus:outline-0 md:ml-sm"
              />
            </form>
          )}
        </div>

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
