import { Box, Accordion } from '@digg/design-system';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { PageProps } from '../PageProps'

const MainContent = Box.withComponent('main');

export class AboutWebPage extends React.Component<PageProps> {
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
        <PageMetadata
          seoTitle="Om webbplatsen - Sveriges dataportal"
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
          canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|about|path')}/`}
        />
        <Box
          id="top"
          display="flex"
          direction="column"
          minHeight="100vh"
          bgColor="#fff"
        >
          <NoJavaScriptWarning text="" />

          <Header ref={this.headerRef} />

          <ErrorBoundary>
            <MainContent flex="1 1 auto">
              <div className="main-container">
                <h1 className="text-header text-1">Om webbplatsen</h1>
                
                <div className="content">
                  <p className="preamble text-4">
                    Sveriges dataportal är under utveckling och finns i nuläget
                    tillgänglig i en betaversion. Under 2020 kommer dataportalen
                    att vidareutvecklas med fler funktioner och mer innehåll.
                    Den nya dataportalen vidareutvecklas och förvaltas av
                    Myndigheten för digital förvaltning (DIGG). Du kan
                    fortfarande använda den gamla dataportalen,{' '}
                    <a
                      target="_blank"
                      href="https://oppnadata.se"
                      rel="noreferrer"
                    >
                      oppnadata.se
                    </a>
                    . Oppnadata.se planeras att stängas ned under 2020.
                  </p>

                  <p className="main-text text-5">
                    Data är en nationell resurs för näringslivets, samhällets
                    och den offentliga förvaltningens utveckling. Det är en väg
                    till transparens, innovation och tillväxt som gynnar hela
                    samhället som skapas av medborgarna, näringslivet och
                    myndigheter tillsammans.
                  </p>
                  <p className="main-text text-5">
                    Sveriges dataportal samordnar och tillgängliggör datamängder
                    som tillhandahålls av offentliga och privata organisationer.
                    Dataportalen fungerar även som det nav där Sveriges
                    myndigheter publicerar information om vilka typer av
                    handlingar som vanligen tillhandahålls elektroniskt för
                    vidareutnyttjande.
                  </p>
                  <p className="main-text text-5">
                    På dataportalen finns enbart information om datamängder, dvs.
                    metadata. Data hämtas via länkar för nedladdning eller
                    efterfrågas hos respektive organisation som ansvarar för
                    sina egna datamängder.
                  </p>

                  <h2 className="text-2">Uppdateringar</h2>
                  <div className="main-text">
                    <span className="text-5-bold">2020-01-09:</span>
                    <ul className="text-5">
                      <li>Gjort justeringar i designen</li>
                      <li>Förbättrat sökfunktionen</li>
                      <li>Gjort korrigeringar för validering av HTML</li>
                    </ul>
                  </div>
                  <div className="main-text">
                    <span className="text-5-bold">2020-03-17:</span>
                    <ul className="text-5">
                      <li>Vidareutveckling av startsidan</li>
                      <li>
                        Publicerat källkod på{' '}
                        <a href="https://github.com/DIGGSweden/dataportal-web">
                          GitHub
                        </a>
                      </li>
                      <li>Förberett för begrepp och specifikationer</li>
                      <li>Förberett för språkstöd (engelska)</li>
                      <li>Möjlighet att sortera datamängder</li>
                      <li>Möjligheter att filtrera datamängder på licens</li>
                      <li>Statistik på dataportalen</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-04-16:</span>
                    <ul className="text-5">
                      <li>Gjort designjusteringar</li>
                      <li>Gjort justeringar för bättre tillgänglighet</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-06-10:</span>
                    <ul className="text-5">
                      <li>Gjort justeringar i designen</li>
                      <li>Gjort justeringar av sökfunktionen</li>
                      <li>Sökfraser med AND, OR och NOT går att använda</li>
                      <li>Förbättrat relevansen i träfflistan efter sökning</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-08-19:</span>
                    <ul className="text-5">
                      <li>Utvecklat sitemap för webbplatsen som möjliggör indexering och sökning på google</li>
                      <li>Förberett för publicering av nyheter</li>
                      <li>Diverse buggrättningar, bland annat i sökfunktionen</li>
                      <li>Säkerhetsuppdateringar</li>
                    </ul>
                  </div>


                  <h2 className="text-2">
                    Tillgänglighetsredogörelse för dataportalen
                  </h2>
                  <p className="main-text text-5">
                    Myndigheten för digital förvaltning (DIGG) står bakom den
                    här webbplatsen.{' '}
                    <a
                      href={`/${i18n.languages[0]}/${i18n.t(
                        'routes|accessibility|path'
                      )}`}
                    >
                      Här kan du ta del av tillgänglighetsredogörelsen
                    </a>
                    .
                  </p>

                  <h2 className="text-2">Kakor (cookies)</h2>
                  <p className="main-text text-5">
                    En kaka (cookie) är en liten textfil som lagras på din dator
                    och innehåller information. Kakor används normalt för att
                    förbättra webbplatsen för dig som besökare.
                  </p>

                  <p className="main-text text-5">
                    Den nya dataportalen (dataportal.se) lagrar och använder
                    inga kakor. Om du ändå ser kakor i webbläsaren beror det på
                    att du tidigare besökt den gamla dataportalen
                    (oppnadata.se). Dessa kakor följer med till den nya
                    dataportalen eftersom den använder komponenter från den
                    gamla, men dessa kakor används inte.
                  </p>

                  <div className="main-text text-5">
                    <span className="text-5-bold">Kakor som kan förekomma:</span>
                    <ul className="text-5">
                      <li>CONSENT</li>
                      <li>_fbp</li>
                      <li>_ga</li>
                      <li>_gcl_au</li>
                      <li>_hjid</li>
                    </ul>
                    Du kan ta bort de lagrade kakorna genom att använda
                    funktionen för att rensa kakor i din webbläsare.
                  </div>

                  <h2 className="text-2">Synpunkter på dataportalen</h2>
                  <p className="main-text text-5">
                    <a
                      target="_blank"
                      href="https://webropol.com/s/beta-sveriges-dataportal"
                      rel="noreferrer"
                    >
                      Skicka gärna in dina synpunkter
                    </a>{' '}
                    på den nya dataportalen till oss!
                  </p>
                </div>
              </div>
            </MainContent>
          </ErrorBoundary>
          <Footer onToTopButtonPushed={this.setFocus} />
        </Box>
      </QueryParamProvider>
    );
  }
}
