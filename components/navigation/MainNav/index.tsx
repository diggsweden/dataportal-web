import useTranslation from "next-translate/useTranslation";
import { FC, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import Link from "next/link.js";
import { Button, ButtonLink } from "@/components/global/Button";
import { mainNav } from "@/utilities/menuData";
import DataportalLogo from "@/assets/logos/sveriges_dataportal_logo.svg";
import DataportalTestLogo from "@/assets/logos/dataportalTest.svg";
import CloseCrossIcon from "@/assets/icons/closeCross.svg";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/content/Search/SearchInput";
import SearchIcon from "@/assets/icons/search.svg";
import { useClickoutside } from "@/hooks/useClickoutside";
import { SettingsContext } from "@/providers/SettingsProvider";
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
  const ref = useClickoutside<HTMLDivElement>(() => setOpenSearch(false));
  const formRef = useRef<HTMLFormElement>(null);

  const { env } = useContext(SettingsContext);
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

  const handleSearchButtonClick = () => {
    setOpenSearch(!openSearch);
    // Use setTimeout to ensure the form is rendered before trying to focus
    setTimeout(() => {
      const input = formRef.current?.querySelector("input");
      input?.focus();
    }, 0);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <Link
        href={`${t(`common|${"lang-path"}`)}`}
        aria-label="Dataportal logga länk till startsida"
        onClick={() => setOpenSideBar(false)}
      >
        {env.envName === "sandbox" ? (
          <DataportalTestLogo />
        ) : (
          <DataportalLogo
            className={`${
              openSearch
                ? "hidden lg:block"
                : "min-w-0 max-h-[2rem] w-full max-w-[10rem] md:h-[2.75rem] md:w-[15.5rem]"
            }`}
          />
        )}
      </Link>
      <div className="flex flex-row items-center justify-end space-x-md">
        <nav
          className="hidden flex-row items-center space-x-sm xl:flex"
          aria-label={t("common|menu-main")}
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
              aria-label={t("common|search-content")}
              onClick={handleSearchButtonClick}
              icon={SearchIcon}
              iconPosition="left"
              className="w-[2.75rem] cursor-pointer p-[0.625rem]"
            />
          ) : (
            <form
              ref={formRef}
              className={`transition-width max-w-[17.125rem] text-sm duration-100 md:w-[17.125rem] [&_div]:mr-none [&_div_div_button]:p-[0.625rem] hover:first:[&_div_div_button]:bg-brown-200  ${
                openSearch
                  ? `w-full ${
                      query
                        ? "first:[&_div_div_button]:bg-transparent first:focus-visible:[&_div_div_button]:bg-brown-200 first:focus-visible:[&_div_div_button]:-outline-offset-2 first:focus-visible:[&_div_div_button]:outline-pink-600"
                        : ""
                    } [&_div_div_button]:bg-brown-800 last:hover:[&_div_div_button]:bg-brown-900 focus-visible:[&_div_div_button]:-outline-offset-2 focus-visible:[&_div_div_button]:outline-white`
                  : "w-none overflow-hidden"
              }`}
              action={`/${lang}/search`}
              role={"search"}
            >
              <SearchInput
                id="header-search"
                placeholder={t("common|search")}
                ariaLabel={t("common|search-content")}
                query={query}
                setQuery={setQuery}
                type="small"
                className="focus-in !h-[2.75rem] border-none !bg-brown-100 pr-[5.625rem] hover:outline-0"
              />
            </form>
          )}
        </div>

        <Button
          id="sidebarBtn"
          aria-expanded={openSideBar}
          aria-controls="sidebar"
          variant="plain"
          icon={openSideBar ? CloseCrossIcon : HamburgerIcon}
          iconPosition="left"
          onClick={() => setOpenSideBar(!openSideBar)}
          label={t("common|menu")}
          className={`button--large ${openSideBar ? "active" : ""}`}
          aria-label={
            openSideBar ? t("common|menu-close") : t("common|menu-open")
          }
        />
      </div>
    </div>
  );
};

export default MainNav;
