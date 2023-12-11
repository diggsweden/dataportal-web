import {
  CloseIcon,
  colorPalette,
  GlobeIcon,
  InfoCircleIcon,
  SearchIcon,
} from "@digg/design-system";
import communityIcon from "../../assets/icons/community.svg";
import hamburger from "../../public/icons/hamburger.svg";
import diggLogo from "../../public/icons/diggLogo.svg";
import dataportalenLogo from "../../public/icons/dataportalenLogo.svg";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { EnvSettings } from "../../env/EnvSettings";
import { GlobalSearch } from "../Search";
import { usePrevious } from "../../utilities";
import Image from "next/image";
import MenuMain from "../Navigation/Menu/Menu-Main";
type HeaderProps = {
  menu: any;
  env: EnvSettings;
  setOpenSidebar: Function;
  openSideBar: boolean;
};

interface SearchButtonProps {
  toggle: () => void;
  show: boolean;
  pathname: string;
  styles?: any;
  iconColor?: DiggColor;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  toggle,
  show,
  pathname,
  styles,
}) => {
  const { t } = useTranslation("common");
  return (
    <button
      key={"search-toggle"}
      onClick={toggle}
      className={`search-link search-toggle${
        pathname === "/search" ? " active" : ""
      }`}
      css={styles}
    >
      {show ? (
        <CloseIcon color={"white"} width={20} className="search-link--icon" />
      ) : (
        <SearchIcon color={"white"} width={20} className="search-link--icon" />
      )}
      <span>{show ? t("close_search") : t("search")}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { pathname } = useRouter() || {};
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(pathname === "/");
  const [focusTrap, setFocusTrap] = useState(false);
  const { t, lang } = useTranslation();
  const searchRef = useRef<HTMLInputElement>(null);
  const previousPathname = usePrevious(pathname);
  const isFirstLoad = previousPathname === undefined;

  const MenuButton: React.FC<any> = () => {
    const { t } = useTranslation("common");
    return (
      <button
        onClick={() => props.setOpenSidebar(!props.openSideBar)}
        className={"search-link search-toggle"}
      >
        {props.openSideBar ? (
          <CloseIcon color={"white"} width={20} className="search-link--icon" />
        ) : (
          <Image src={hamburger} alt={"hamburger-icon"} />
        )}
        <span>{props.openSideBar ? t("close_menu") : t("menu")}</span>
      </button>
    );
  };

  const handleMenuState = (e: UIEvent) => {
    const screenWidth = (e as any).currentTarget.innerWidth;
    if (screenWidth > 880) {
      showMenu && closeMenu();
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
    setFocusTrap(false);
    document.body.setAttribute("style", ``);
  };

  const toggleSearch = () => {
    setShowMenu(false);
    setShowSearch(!showSearch);
    props.openSideBar && !showSearch && props.setOpenSidebar(false);
  };

  useEffect(() => {
    const handleFocus = () => !isFirstLoad && searchRef.current?.focus();
    showSearch ? handleFocus() : searchRef.current?.blur();
  }, [showSearch]);

  useEffect(() => {
    !isFirstLoad && setShowSearch(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("resize", handleMenuState);

    return () => {
      window.removeEventListener("resize", handleMenuState);
    };
  }, [showMenu]);

  return (
    <header>
      <div className={`header-wrapper${showSearch ? " show-search" : ""}`}>
        <div className="header-top">
          <div className="main-bar">
            <div className="start-link">
              <Link href={"https://digg.se/"} target="_blank">
                <Image
                  src={diggLogo}
                  width={45}
                  height={30}
                  alt={"digg-logo"}
                />
              </Link>
            </div>
          </div>

          <FocusTrap active={focusTrap}>
            <div
              role="dialog"
              aria-modal={showMenu}
              className="main-bar__right-menu"
            >
              <div
                className={"menu-bg" + (showMenu ? " menu-bg--active" : "")}
              ></div>
              <nav
                className={
                  "header-links" + (showMenu ? "--active text-md" : "")
                }
              >
                {!showMenu && (
                  <>
                    <Link
                      href={t("routes|about-us$path")}
                      key={"faq-link"}
                      locale={lang}
                      onClick={closeMenu}
                      className={`${pathname === "/faq" ? " active" : ""}`}
                    >
                      <div className="search-link">
                        <InfoCircleIcon
                          color={colorPalette.gray500}
                          width={16}
                          className="search-link--icon"
                        />
                        <span className="right-bar-item">
                          {t("routes|about-us$title")}
                        </span>
                      </div>
                    </Link>

                    <Link
                      href={`https://community.dataportal.se/`}
                      target="_blank"
                      key={"community-link"}
                      onClick={closeMenu}
                      lang="en"
                    >
                      <div className="search-link">
                        <Image
                          className="search-link--icon"
                          src={communityIcon}
                          alt={"community-icon"}
                          width={20}
                        />
                        <span className="right-bar-item">Community</span>
                      </div>
                    </Link>

                    <Link
                      href={`/${t("common|change-lang")}`}
                      key={"lang-link"}
                      locale={`${t("common|change-lang")}`}
                      onClick={closeMenu}
                      lang={lang === "sv" ? "en" : "sv"}
                    >
                      <div className="search-link">
                        <GlobeIcon
                          color={colorPalette.gray500}
                          width={20}
                          className="search-link--icon"
                        />
                        <span className="globe-icon">
                          {t("common|lang-linktext")}
                        </span>
                      </div>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </FocusTrap>
        </div>

        <div className="header-bottom">
          <div className="header-links text-base">
            <Link
              onClick={() => props.setOpenSidebar(false)}
              className="header-bottom-logo"
              href={t(`common|${"lang-path"}`)}
            >
              <Image
                src={dataportalenLogo}
                height={40}
                width={200}
                alt={"dataportalen-logo"}
                className="dataportalen-logo"
              />
            </Link>
            <MenuMain setOpenSidebar={props.setOpenSidebar} />
          </div>

          <div className="searchAndMenu">
            <SearchButton
              toggle={toggleSearch}
              show={showSearch}
              pathname={pathname}
            />

            <MenuButton />
          </div>

          <GlobalSearch
            ref={searchRef}
            hidden={!showSearch}
            className={`global-search${showSearch ? " visible" : ""}`}
            onSearch={() => setShowSearch(false)}
          />
        </div>
      </div>
    </header>
  );
};
