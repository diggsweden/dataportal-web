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
import { TopImage } from 'assets/TopImage';
import { string } from 'prop-types';

const MainContent = Box.withComponent('main');

export interface NewsPageProps
  extends RouteComponentProps<any, RouterContext> {}

export class NewsPage extends React.Component<NewsPageProps> {
  private headerRef: React.RefObject<Header>;

  constructor(props: NewsPageProps) {
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
          seoTitle="Nyheter - Sveriges dataportal"
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
                
                <div className="news-article content">

                <TopImage />



                <span className="text-6">7 Maj 2020</span>
                <h1 className="text-1">Nyhets artikel</h1>
                  <p className="preamble text-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus purus metus, viverra quis urna at, hendrerit
                    tempor lorem. Maecenas iaculis est in mattis egestas.
                    Suspendisse pulvinar, lacus eu egestas ornare, mi nisl
                    euismod purus, placerat pulvinar leo quam ac turpis.
                  </p>
                  <p className="main-text text-5">
                    Pellentesque quis pharetra dui, et vestibulum metus.
                    Suspendisse eget aliquet leo. In imperdiet lacinia
                    facilisis. Praesent ipsum nunc, sagittis sed dignissim quis,
                    ultrices id neque. Curabitur tincidunt malesuada tempor.
                    Donec fringilla eros nec semper vehicula. Sed in bibendum
                    ex, ac malesuada nibh. Sed commodo lorem leo, eget commodo
                    sapien rhoncus consequat. Praesent condimentum pulvinar
                    tristique. Nullam commodo volutpat sem. Donec feugiat justo
                    vel auctor efficitur. Nullam in massa finibus nisl
                    vestibulum volutpat. Cras lacinia leo blandit arcu rhoncus
                    tincidunt.
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
