import {
  MenuIcon,
  CloseIcon,
  Container,
  space,
  Button,
  colorPalette,
  css,
  responsiveProp,
} from '@digg/design-system';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataportalLogo } from '../';
import FocusTrap from 'focus-trap-react';
import useTranslation from 'next-translate/useTranslation';
import { MainMenu_dataportal_v1_Digg_Menu } from '../../graphql/__generated__/MainMenu';
import { useRouter } from 'next/router';
import { checkLang } from '../../utilities/checkLang';
import { EnvSettings } from '../../env/EnvSettings';

type HeaderProps = {
  menu: MainMenu_dataportal_v1_Digg_Menu;
  env: EnvSettings;
};

export const Header: React.FC<HeaderProps> = ({ menu, env }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [focusTrap, setFocusTrap] = useState(false);
  const { t, lang } = useTranslation();
  const { pathname, query } = useRouter() || {};
  const showLangLink = menu?.uiHints?.some((hint) => hint === 'showLangLink');
  const slug = `/${query?.containerSlug && query.containerSlug[0]}`;

  const handleMenuState = (e: UIEvent) => {
    const screenWidth = (e as any).currentTarget.innerWidth;
    if (screenWidth > 880) {
      showMenu && closeMenu();
    }
  };

  const openMenu = () => {
    setShowMenu(true);
    setFocusTrap(true);
    document.body.setAttribute('style', `position:fixed;width:100%`);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setFocusTrap(false);
    document.body.setAttribute('style', ``);
  };

  useEffect(() => {
    window.addEventListener('resize', handleMenuState);

    return () => {
      window.removeEventListener('resize', handleMenuState);
    };
  }, [showMenu]);

  return (
    <header>
      <div
        css={css`
          ${space({ py: 0, px: 4 })};
        `}
      >
        <Container>
          <div className="header-box">
            <Link href={`/${lang}`}>
              <a
                aria-label={t('common|logo-title')}
                className={'dataportal-logo'}
                aria-hidden={showMenu}
              >
                <div>
                  <div className="logo-box">
                    <DataportalLogo env={env} />
                  </div>
                </div>
              </a>
            </Link>

            <FocusTrap active={focusTrap}>
              <div
                role="dialog"
                aria-modal={showMenu}
              >
                <Button
                  css={css`
                    ${space({ px: 3 })}
                    ${responsiveProp('display', ['flex', 'flex', 'none'])}
                    justify-content: space-around;
                    align-items: center;
                    gap: 0.75rem;
                  `}
                  inline
                  aria-label={showMenu ? t('common|close_menu') : t('common|menu')}
                  onClick={showMenu ? closeMenu : openMenu}
                >
                  {showMenu ? (
                    <CloseIcon
                      width={24}
                      color={colorPalette.green600}
                      className="close-icon"
                    ></CloseIcon>
                  ) : (
                    <MenuIcon
                      width={[24, 18]}
                      color={colorPalette.green600}
                      className="menu-icon"
                    ></MenuIcon>
                  )}{' '}
                  <span
                    className="text-base"
                    css={css`
                      ${responsiveProp('display', ['none', 'block'])}
                    `}
                  >
                    {' '}
                    {showMenu ? t('common|close') : t('common|menu')}
                  </span>
                </Button>

                <div className={'menu-bg' + (showMenu ? ' menu-bg--active' : '')}></div>
                <nav className={'header-links' + (showMenu ? '--active text-md' : '')}>
                  <Link
                    href={`/${lang}/datasets?q=&f=`}
                    key={'search-data-link'}
                    locale={lang}
                  >
                    <a
                      onClick={closeMenu}
                      className={`header-link${pathname === '/datasets' ? ' active' : ''}`}
                    >
                      {t('common|search-data')}
                    </a>
                  </Link>
                  {lang === 'sv' && (
                    <Link
                      href={`/${lang}/${t('routes|news$path')}`}
                      key={'news-link'}
                      locale={lang}
                    >
                      <a
                        onClick={closeMenu}
                        className={`header-link${pathname === '/nyheter' ? ' active' : ''}`}
                      >
                        {t('routes|news$title')}
                      </a>
                    </Link>
                  )}
                  {menu?.children?.map((child, index) => (
                    <Link
                      href={`/${lang}${child?.link?.link}` || ''}
                      key={index}
                    >
                      <a
                        onClick={closeMenu}
                        className={`header-link${slug === child?.link?.link ? ' active' : ''}`}
                      >
                        {child && child.link && checkLang(child?.link?.title)}
                      </a>
                    </Link>
                  ))}
                  <Link
                    href={`https://community.dataportal.se/`}
                    key={'community-link'}
                  >
                    <a
                      onClick={closeMenu}
                      className={`header-link`}
                      lang="en"
                    >
                      Community
                    </a>
                  </Link>
                  {showLangLink && (
                    <Link
                      href={`/${t('common|change-lang')}`}
                      key={'lang-link'}
                      locale={`${t('common|change-lang')}`}
                    >
                      <a
                        onClick={closeMenu}
                        className={`header-link header-link--top`}
                        lang={lang === 'sv' ? 'en' : 'sv'}
                      >
                        {t('common|lang-linktext')}
                      </a>
                    </Link>
                  )}
                  {showMenu && (
                    <button
                      className="link-btn text-xs"
                      onClick={closeMenu}
                    >
                      {t('common|close_menu')}
                    </button>
                  )}
                  <div
                    className="click-outside"
                    onClick={closeMenu}
                  ></div>
                </nav>
              </div>
            </FocusTrap>
          </div>
        </Container>
      </div>
    </header>
  );
};
