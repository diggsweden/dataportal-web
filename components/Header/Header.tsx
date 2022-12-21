import {
  MenuIcon,
  CloseIcon,
  colorPalette,
  css,
  responsiveProp,
  QuestionCircleIcon,
  ChatIcon,
  GlobeIcon,
} from "@digg/design-system";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { EnvSettings } from "../../env/EnvSettings";

type HeaderProps = {
  menu: any;
  env: EnvSettings;
};

const showLangLink = true;

export const Header: React.FC<HeaderProps> = ({ env }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [focusTrap, setFocusTrap] = useState(false);
  const { t, lang } = useTranslation();
  const { pathname } = useRouter() || {};
  const isEn = lang === "en";

  const handleMenuState = (e: UIEvent) => {
    const screenWidth = (e as any).currentTarget.innerWidth;
    if (screenWidth > 880) {
      showMenu && closeMenu();
    }
  };

  const openMenu = () => {
    setShowMenu(true);
    setFocusTrap(true);
    document.body.setAttribute("style", `position:fixed;width:100%`);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setFocusTrap(false);
    document.body.setAttribute("style", ``);
  };

  useEffect(() => {
    window.addEventListener("resize", handleMenuState);

    return () => {
      window.removeEventListener("resize", handleMenuState);
    };
  }, [showMenu]);

  return (
    <header>
      <div className="header-wrapper">
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
                    {/* Search data hidden in MVP */}
                    {/* <Link
                      href={`/datasets?q=&f=`}
                      key={'search-data-link'}
                      locale={lang}
                    >
                      <a
                        onClick={closeMenu}
                        className={`${pathname === '/datasets' ? ' active' : ''}`}
                      >
                        <div className="search-link ">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.7529 14.7188L11.5654 10.5312C12.4717 9.42188 12.9717 8.025 12.9717 6.5C12.9717 2.90937 10.0614 0 6.47167 0C2.88198 0 -0.000213623 2.91031 -0.000213623 6.5C-0.000213623 10.0897 2.90979 13 6.47167 13C7.99636 13 9.39511 12.4716 10.5029 11.5925L14.6904 15.78C14.8654 15.9281 15.0592 16 15.2498 16C15.4404 16 15.6335 15.9268 15.7801 15.7803C16.0717 15.4875 16.0717 15.0125 15.7529 14.7188ZM1.49979 6.5C1.49979 3.74312 3.74292 1.5 6.49979 1.5C9.25667 1.5 11.4998 3.74312 11.4998 6.5C11.4998 9.25688 9.25667 11.5 6.49979 11.5C3.74292 11.5 1.49979 9.25625 1.49979 6.5Z"
                              fill="#949494"
                            />
                          </svg>
                          <span className="right-bar-item">{t('common|search-data')}</span>
                        </div>
                      </a>
                    </Link> */}

                    {!isEn && (
                      <Link
                        href={`/faq`}
                        key={"faq-link"}
                        locale={lang}
                        onClick={closeMenu}
                        className={`${pathname === "/faq" ? " active" : ""}`}
                      >
                        <div className="search-link">
                          <QuestionCircleIcon
                            color={colorPalette.gray500}
                            width={16}
                            className="search-link--icon"
                          />
                          <span className="right-bar-item">FAQ</span>
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
                          <QuestionCircleIcon
                            color={colorPalette.gray500}
                            width={16}
                            className="search-link--icon"
                          />
                          <span>FAQ</span>
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
    </header>
  );
};
