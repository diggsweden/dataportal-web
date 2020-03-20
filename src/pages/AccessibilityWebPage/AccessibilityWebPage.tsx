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

const MainContent = Box.withComponent('main');

export interface PageProps extends RouteComponentProps<any, RouterContext> {}

export class AccessibilityWebPage extends React.Component<PageProps> {
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
          seoTitle="Tillgänglighet för dataportalen - Sveriges dataportal"
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
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
                <h1 className="text-header text-1">
                  Tillgänglighet för Sveriges dataportal
                </h1>
                <div className="content">
                  <p className="preamble text-4">
                    Myndigheten för digital förvaltning står bakom den här
                    webbplatsen. Vi vill att så många som möjligt ska kunna
                    använda webbplatsen. Det här dokumentet beskriver hur
                    Sveriges dataportal uppfyller{' '}
                    <cite>
                      lagen om tillgänglighet till digital offentlig service
                    </cite>
                    , eventuella kända tillgänglighetsproblem och hur du kan
                    rapportera brister till oss så att vi kan åtgärda dem.
                  </p>
                  <h2 className="text-2">Hur tillgänglig är webbplatsen?</h2>
                  <p className="main-text text-5">
                    Vi är medvetna om att delar av webbplatsen inte är helt
                    tillgängliga.
                  </p>
                  <p className="main-text text-5">
                    Länkarna nedan leder till detaljerad information om vilka
                    tillgänglighetsproblem du kan möta i olika
                    användningssituationer.
                  </p>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        <a href="#usage-1">Användning utan synförmåga</a>
                      </li>

                      <li>
                        <a href="#usage-2">Användning med nedsatt synförmåga</a>
                      </li>

                    </ul>
                  </div>
                  <h2 className="text-2">
                    Vad kan du göra om du inte kan använda delar av webbplatsen?
                  </h2>
                  <p className="main-text text-5">
                    Om du behöver innehåll från Sveriges dataportal som inte är
                    tillgängligt för dig, men som är undantaget från lagens
                    tillämpningsområde enligt beskrivning nedan, kan du{' '}
                    <a href="https://www.digg.se/tdosanmalan">meddela oss</a>.
                  </p>
                  <p className="main-text text-5">
                    Du kan också kontakta oss på följande sätt:
                  </p>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        skicka e-post till{' '}
                        <a href="mailto:info@digg.se">info@digg.se</a>
                      </li>
                      <li>
                        ring <a href="tel:+46-771-114400">0771-11 44 00</a>
                      </li>
                    </ul>
                  </div>
                  <h2 className="text-2">Rapportera brister i webbplatsens tillgänglighet</h2>
                  <p className="main-text text-5">
                    Vi strävar hela tiden efter att förbättra webbplatsens
                    tillgänglighet. Om du upptäcker problem som inte är
                    beskrivna på den här sidan, eller om du anser att vi inte
                    uppfyller lagens krav,{' '}
                    <a href="https://www.digg.se/tdosanmalan">meddela oss</a> så
                    att vi får veta att problemet finns.
                  </p>
                  <h2 className="text-2">Tillsyn</h2>
                  <p className="main-text text-5">
                    Myndigheten för digital förvaltning har ansvaret för tillsyn
                    för{' '}
                    <cite>
                      lagen om tillgänglighet till digital offentlig service
                    </cite>
                    . Om du inte är nöjd med hur vi hanterar dina synpunkter kan
                    du{' '}
                    <a href="https://www.digg.se/tdosanmalan">
                      kontakta Myndigheten för digital förvaltning
                    </a>{' '}
                    och påtala det.
                  </p>
                  <h2 className="text-2">Teknisk information om webbplatsens tillgänglighet</h2>
                  <p className="main-text text-5">
                    Den här webbplatsen är inte förenlig med{' '}
                    <cite>
                      lagen om tillgänglighet till digital offentlig service
                    </cite>
                    . Otillgängliga delar beskrivs nedan.
                  </p>
                  <h2 className="text-2" id="inaccessible-content">
                    Innehåll som inte är tillgängligt
                  </h2>
                  <p className="main-text text-5">
                    Det innehåll som beskrivs nedan är på ett eller annat sätt
                    inte helt tillgängligt.
                  </p>
                  <h3 className="text-3">Bristande förenlighet med lagkraven</h3>
                  <h4 className="text-5-bold" id="usage-1">Problem vid användning utan synförmåga</h4>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        <p>
                        Det genererade stapeldiagrammet som visas på startsidan har inget textalternativ.{' '}
                          <span>
                            [<abbr>WCAG</abbr> 1.1.1 (A)]
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>

                  <h4 className="text-5-bold" id="usage-2">Problem vid användning med nedsatt synförmåga</h4>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        <p>
                        På sidan registrera data finns en text som blir svårläst vid 200% text-zoom och ökat avstånd mellan tecken. Vi kommer att rätta felet inom kort.{' '}
                          <span>
                            [<abbr>WCAG</abbr> 1.4.12 (AA)]
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>

                  <h2 className="text-2">Hur vi testat webbplatsen</h2>
                  <p className="main-text text-5">
                    Vi har gjort en självskattning (intern testning) av Sveriges
                    dataportal.
                  </p>
                  <p className="main-text text-5">
                    Senaste bedömingen gjordes den 16&#160;mars 2020.
                  </p>
                  <p className="main-text text-5">
                    Redogörelsen uppdaterades senast den 18&#160;mars 2020.
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
