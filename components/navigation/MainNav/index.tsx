import useTranslation from "next-translate/useTranslation";
import { FC, useEffect, useState } from "react";
import Link from "next/link.js";
import { Button, ButtonLink } from "@/components/global/Button";
import { mainNav } from "@/utilities/menuData";
import DataportalLogo from "@/assets/logos/sveriges_dataportal_logo.svg";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/content/Search/SearchInput";
import SearchIcon from "@/assets/icons/search.svg";
import { useClickoutside } from "@/hooks/useClickoutside";
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
  const basePath = `/${pathname.split("/").splice(1, 1)[0]}`;
  const { t, lang } = useTranslation();
  const isEn = lang === "en";
  const ref = useClickoutside(() => setOpenSearch(false));

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
        aria-label="Dataportal logo"
        onClick={() => setOpenSideBar(false)}
      >
        <DataportalLogo
          className={`${
            openSearch
              ? "hidden lg:block"
              : "h-[32px] w-[160px] md:h-[44px] md:w-[248px]"
          } `}
        />
      </Link>
      <div className="flex w-full flex-row items-center justify-end space-x-md">
        <nav
          className="hidden flex-row items-center gap-sm xl:flex"
          aria-label="Main"
        >
          {menues.map((menu: MainNavData, idx: number) => (
            <ButtonLink
              variant="plain"
              key={idx}
              href={`/${t(`routes|${menu.title}$path`)}`}
              onClick={() => setOpenSideBar(false)}
              label={t(`routes|${menu.title}$title`)}
              className={`${
                `/${t(`routes|${menu.title}$path`)}` === basePath
                  ? " active"
                  : ""
              }`}
            />
          ))}
        </nav>
        <div
          ref={ref}
          className="relative left-none flex w-full justify-end md:w-auto"
        >
          {!openSearch ? (
            <Button
              variant="plain"
              aria-label="Search"
              onClick={() => setOpenSearch(!openSearch)}
              icon={SearchIcon}
              iconPosition="left"
              className="w-[44px] cursor-pointer p-[10px]"
            />
          ) : (
            <form
              className={`transition-width max-w-[274px] text-sm duration-100 md:w-[274px] [&_div]:mr-none [&_div_div_button]:p-[10px] hover:first:[&_div_div_button]:bg-brown-200  ${
                openSearch
                  ? `w-full ${
                      query
                        ? "first:[&_div_div_button]:bg-transparent first:focus-visible:[&_div_div_button]:bg-brown-200 first:focus-visible:[&_div_div_button]:-outline-offset-2 first:focus-visible:[&_div_div_button]:outline-pink-600"
                        : ""
                    } [&_div_div_button]:bg-brown-800 last:hover:[&_div_div_button]:bg-brown-900 focus-visible:[&_div_div_button]:-outline-offset-2 focus-visible:[&_div_div_button]:outline-white`
                  : "w-none overflow-hidden"
              }`}
              action={`/${lang}/search`}
            >
              <SearchInput
                id="header-search"
                placeholder={t("common|search")}
                query={query}
                setQuery={setQuery}
                type="small"
                className="focus-i-n !h-[44px] border-none !bg-brown-100 pr-[90px] hover:outline-0"
              />
            </form>
          )}
        </div>

        <Button
          id="sidebarBtn"
          variant="plain"
          icon={openSideBar ? CloseCrossIcon : HamburgerIcon}
          iconPosition="left"
          onClick={() => setOpenSideBar(!openSideBar)}
          label={t("common|menu")}
          className={`button--large ${openSideBar ? "active" : ""}`}
        />
      </div>
    </div>
  );
};

export default MainNav;
