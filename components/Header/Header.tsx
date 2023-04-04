import {
  MenuIcon,
  CloseIcon,
  colorPalette,
  css,
  responsiveProp,
  InfoCircleIcon,
  ChatIcon,
  GlobeIcon,
  SearchIcon,
} from "@digg/design-system";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { EnvSettings } from "../../env/EnvSettings";
import { GlobalSearch } from "../Search";
import { usePrevious } from "../../utilities";

type HeaderProps = {
  menu: any;
  env: EnvSettings;
};

const showLangLink = true;

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
  iconColor,
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
        <CloseIcon
          color={colorPalette[iconColor || "gray500"]}
          width={20}
          className="search-link--icon"
        />
      ) : (
        <SearchIcon
          color={colorPalette[iconColor || "gray500"]}
          width={20}
          className="search-link--icon"
        />
      )}
      <span>{show ? t("close_search") : t("search")}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = () => {
  const { pathname } = useRouter() || {};
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(pathname === "/");
  const [focusTrap, setFocusTrap] = useState(false);
  const { t, lang } = useTranslation();
  const searchRef = useRef<HTMLInputElement>(null);
  const isEn = lang === "en";
  const previousPathname = usePrevious(pathname);
  const isFirstLoad = previousPathname === undefined;

  const handleMenuState = (e: UIEvent) => {
    const screenWidth = (e as any).currentTarget.innerWidth;
    if (screenWidth > 880) {
      showMenu && closeMenu();
    }
  };

  const openMenu = () => {
    setShowMenu(true);
    setShowSearch(false);
    setFocusTrap(true);
    document.body.setAttribute("style", `position:fixed;width:100%`);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setFocusTrap(false);
    document.body.setAttribute("style", ``);
  };

  const toggleSearch = () => {
    setShowMenu(false);
    setShowSearch(!showSearch);
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
        <div className="header-box">
          <div className="main-bar">
            <div className="start-link">
              <Link
                locale={lang}
                href={`/`}
                className={`header-link start-link-text ${
                  pathname === `/` ? "active" : ""
                }`}
              >
                {t("common|logo")}
              </Link>
            </div>
            <nav>
              <div className="header-links text-base">
                <Link
                  href={`/data`}
                  className={`header-link ${
                    pathname?.split("/")[1] === `data` ? "active" : ""
                  }`}
                >
                  {t("pages|startpage$data-api-header")}
                </Link>

                {!isEn && (
                  <>
                    <Link
                      href={`/oppen-kallkod`}
                      className={`header-link ${
                        pathname?.split("/")[1] === `oppen-kallkod`
                          ? "active"
                          : ""
                      }`}
                    >
                      {t("pages|startpage$open-source-header")}
                    </Link>
                    <Link
                      href={`/offentligai`}
                      className={`header-link ${
                        pathname?.split("/")[1] === `offentligai`
                          ? "active"
                          : ""
                      }`}
                    >
                      {t("pages|startpage$public-ai-header")}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>

          <FocusTrap active={focusTrap}>
            <div
              role="dialog"
              aria-modal={showMenu}
              className="main-bar__right-menu"
            >
              <SearchButton
                styles={css`
                  ${responsiveProp("display", ["flex", "flex", "flex", "none"])}
                `}
                toggle={toggleSearch}
                show={showSearch}
                pathname={pathname}
                iconColor="white"
              />
              <button
                css={css`
                  ${responsiveProp("display", ["flex", "flex", "flex", "none"])}
                  justify-content: space-around;
                  align-items: center;
                  gap: 0.75rem;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  padding-right: 0;
                `}
                type="button"
                aria-label={
                  showMenu ? t("common|close_menu") : t("common|menu")
                }
                onClick={showMenu ? closeMenu : openMenu}
              >
                {showMenu ? (
                  <span className="open-close-link">
                    <CloseIcon
                      width={[18, 24]}
                      color={colorPalette.white}
                      className="close-icon"
                    />
                    <span
                      css={css`
                        color: white;
                      `}
                    >
                      {t("common|close")}
                    </span>
                  </span>
                ) : (
                  <span className="open-close-link">
                    <MenuIcon
                      width={[18, 24]}
                      color={colorPalette.white}
                      className="close-icon"
                    />
                    <span
                      css={css`
                        color: white;
                      `}
                    >
                      {t("common|menu")}
                    </span>
                  </span>
                )}
              </button>
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
                    <SearchButton
                      toggle={toggleSearch}
                      show={showSearch}
                      pathname={pathname}
                    />

                    {!isEn && (
                      <Link
                        href={`/faq`}
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
                            {t("common|about")}
                          </span>
                        </div>
                      </Link>
                    )}

                    <Link
                      href={`https://community.dataportal.se/`}
                      key={"community-link"}
                      onClick={closeMenu}
                      lang="en"
                    >
                      <div className="search-link">
                        <ChatIcon
                          color={colorPalette.gray500}
                          width={20}
                          className="search-link--icon"
                        />
                        <span className="right-bar-item">Community</span>
                      </div>
                    </Link>
                    {showLangLink && (
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
                          <span className="right-bar-item">
                            {t("common|lang-linktext")}
                          </span>
                        </div>
                      </Link>
                    )}
                  </>
                )}

                {/* Mobile menu */}
                {showMenu && (
                  <div className="header__mobile-menu">
                    <Link
                      href={`/data`}
                      key={"data-link"}
                      onClick={closeMenu}
                      lang={lang}
                    >
                      <div>
                        <span className="header__mobile-menu_link text-xl font-light">
                          {t("pages|startpage$data-api-header")}
                        </span>
                      </div>
                    </Link>

                    {!isEn && (
                      <>
                        <Link
                          href={`/oppen-kallkod`}
                          key={"oppen-kallkod-link"}
                          onClick={closeMenu}
                          lang={lang}
                        >
                          <div>
                            <span className="header__mobile-menu_link text-xl font-light">
                              {t("pages|startpage$open-source-header")}
                            </span>
                          </div>
                        </Link>

                        <Link
                          href={`/offentligai`}
                          key={"offentlig-ai-link"}
                          onClick={closeMenu}
                          lang={lang}
                        >
                          <div>
                            <span className="header__mobile-menu_link text-xl font-light">
                              {t("pages|startpage$public-ai-header")}
                            </span>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* FAQ/Community/Lang mobile menu */}
                    <div className="header__bottom-links">
                      <Link
                        href={`/faq`}
                        key={"faq-link"}
                        locale={lang}
                        onClick={closeMenu}
                        className={`${pathname === "/faq" ? " active" : ""}`}
                      >
                        <div className="header__bottom-links--link">
                          <InfoCircleIcon
                            color={colorPalette.gray500}
                            width={16}
                            className="search-link--icon"
                          />
                          <span>{t("common|about")}</span>
                        </div>
                      </Link>

                      <Link
                        href={`https://community.dataportal.se/`}
                        key={"community-link"}
                        onClick={closeMenu}
                        lang="en"
                      >
                        <div className="header__bottom-links--link">
                          <ChatIcon
                            color={colorPalette.gray500}
                            width={20}
                            className="search-link--icon"
                          />
                          <span>Community</span>
                        </div>
                      </Link>

                      {showLangLink && (
                        <Link
                          href={`/${t("common|change-lang")}`}
                          key={"lang-link"}
                          locale={t("common|change-lang")}
                          onClick={closeMenu}
                        >
                          <div className="header__bottom-links--link">
                            <GlobeIcon
                              color={colorPalette.gray500}
                              width={20}
                              className="search-link--icon"
                            />
                            <span>{t("common|lang-linktext")}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </FocusTrap>
        </div>
      </div>
      <GlobalSearch
        ref={searchRef}
        hidden={!showSearch}
        className={`global-search${showSearch ? " visible" : ""}`}
        onSearch={() => setShowSearch(false)}
      />
    </header>
  );
};
