import {
  Box,
  ArrowIcon,
  SearchIcon,
  Accordion,
  Container,
  colorPalette,
} from '@digg/design-system';
import React from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext, Redirect } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import { TopImage } from 'assets/TopImage';
import i18n from 'i18n';
import { Statistic } from '../../components/Statistic';
import { SettingsContext } from '../../components/SettingsProvider';
import { PageProps } from 'pages/PageProps';

// import RenderInBrowser from 'react-render-in-browser';

import { StatisticGraph } from '../../components/StatisticGraph';
import { Highlight } from '../../components/Highlight';

const MainContent = Box.withComponent('main');

export class StartPage extends React.Component<PageProps, any> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
  }

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
    }
  }

  setTopMargin(height: number) {
    this.setState({ headerHeight: height });
  }

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);

    return (
      <QueryParamProvider params={uri}>
        <SettingsContext.Consumer>
          {settings => (
            <Box
              id="top"
              display="flex"
              direction="column"
              minHeight="100vh"
              bgColor="#fff"
            >
              <PageMetadata
                seoTitle="Sveriges dataportal"
                seoDescription="Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor"
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
              />
              <NoJavaScriptWarning text="" />

              <Header ref={this.headerRef} />

              <ErrorBoundary>
                <MainContent id="main" flex="1 1 auto">
                  <div className="wpb_wrapper">
                    <div className="main-search-container">
                      <div className="startpage-top">
                        <div className="startpage-search">
                          <h1 className="">
                            Sök och utforska <br /> data i Sverige
                          </h1>
                          <form
                            className="startpage-form"
                            method="GET"
                            action={`/${i18n.languages[0]}/datasets`}
                          >
                            <label
                              className="screen-reader"
                              htmlFor="start-search"
                            >
                              {i18n.t('pages|startpage|search_placeholder')}
                            </label>
                            <input
                              id="start-search"
                              type="text"
                              placeholder={i18n.t(
                                'pages|startpage|search_placeholder'
                              )}
                              name="q"
                              autoComplete="off"
                            ></input>
                            <button
                              className="startpage-searchbtn"
                              type="submit"
                              aria-label="Sök"
                            >
                              <SearchIcon
                                color={colorPalette.white}
                                width={[32]}
                              />
                            </button>
                          </form>
                        </div>

                        <div className="search-boxes">
                          <div
                            onClick={e => {
                              window.location.href = `/${i18n.languages[0]}/datasets?p=1&q=*&f=`;
                            }}
                          >
                            <a
                              className="text-4"
                              aria-label="Sök efter termer"
                              href={`/${i18n.languages[0]}/datasets?p=1&q=*&f=`}
                            >
                              {i18n.t('pages|search|datasets')}
                            </a>
                            <span className="text-6">Utforska datamängder</span>
                          </div>

                          <div
                            className="disabled-linkbox"
                            // onClick={e => {
                            //   window.location.href = `/${i18n.languages[0]}/concepts?p=1&q=*&f=`;
                            // }}
                          >
                            <span className="soon">KOMMER SNART</span>

                            <a
                              className="text-4"
                              aria-label="Sök efter specifikationer"
                              // href={`/${i18n.languages[0]}/concepts?p=1&q=*&f=`}
                            >
                              {i18n.t('pages|search|concepts')}
                            </a>
                            <span className="text-6">
                              Utforska begrepp och terminologier
                            </span>
                          </div>

                          <div
                            className="disabled-linkbox"
                            // onClick={e => {
                            //   window.location.href = `/${i18n.languages[0]}/specifications?p=1&q=*&f=`;
                            // }}
                          >
                            <span className="soon">KOMMER SNART</span>

                            <a
                              className="text-4"
                              aria-label="Sök efter specifikationer"
                              // href={`/${i18n.languages[0]}/specifications?p=1&q=*&f=`}
                            >
                              {i18n.t('pages|search|specifications')}
                            </a>
                            <span className="text-6">
                              Utforska specifikationer av informations- och
                              datamodeller
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="main-container">
                      <div className="startpage-categories">
                        <h2 className="text-3">Datamängder efter kategorier</h2>
                        <ul>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin miljö"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FENVI%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CMiljö`}
                            >
                              Miljö
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin befolkning och samhälle"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FSOCI%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CBefolkning%20och%20samhälle`}
                            >
                              Befolkning och samhälle
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin hälsa"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FHEAL%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CHälsa`}
                            >
                              Hälsa
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin energi"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FENER%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CEnergi`}
                            >
                              Energi
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin utbildning, kultur och sport"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FEDUC%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CUtbildning%2C%20kultur%20och%20sport`}
                            >
                              Utbildning, kultur och sport
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin transport"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FTRAN%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CTransport`}
                            >
                              Transport
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin regioner och städer"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FREGI%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CRegioner%20och%20städer`}
                            >
                              Regioner och städer
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin ekonomi och finans"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FECON%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CEkonomi%20och%20finans`}
                            >
                              Ekonomi och finans
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin jordbruk, fiske, skogsbruk och livsmedel"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FAGRI%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CJordbruk%2C%20fiske%2C%20skogsbruk%20och%20livsmedel`}
                            >
                              Jordbruk, fiske, skogsbruk och livsmedel
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin regeringen och den offentliga sektorn"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FGOVE%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CRegeringen%20och%20den%20offentliga%20sektorn`}
                            >
                              Regeringen och den offentliga sektorn
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin vetenskap och teknik"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FTECH%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CVetenskap%20och%20teknik`}
                            >
                              Vetenskap och teknik
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin internationella frågor"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FINTR%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CInternationella%20frågor`}
                            >
                              Internationella frågor
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label="Sök datamängder inom kategorin rättvisa, rättsliga system och allmän säkerhet"
                              href={`/${i18n.languages[0]}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme%2FJUST%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7CRättvisa%2C%20rättsliga%20system%20och%20allmän%20säkerhet`}
                            >
                              Rättvisa, rättsliga system och allmän säkerhet
                            </a>
                          </li>
                        </ul>
                      </div>

                      <Highlight env={settings.env} />

                      {/* <RenderInBrowser except ie> */}
                      <StatisticGraph env={settings.env} />
                      {/* </RenderInBrowser> */}
                      <Statistic env={settings.env} />
                    </div>
                  </div>
                </MainContent>
              </ErrorBoundary>
              <Footer onToTopButtonPushed={this.setFocus} />
            </Box>
          )}
        </SettingsContext.Consumer>
      </QueryParamProvider>
    );
  }
}
