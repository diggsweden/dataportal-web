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
import { string } from 'prop-types';

const MainContent = Box.withComponent('main');

export interface NewsListProps
  extends RouteComponentProps<any, RouterContext> {}

export class NewsListPage extends React.Component<NewsListProps> {
  private headerRef: React.RefObject<Header>;

  constructor(props: NewsListProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.state = {
        bgColor: [
          '#F0EFEE',
          '#F4E0CE',
          '#D6D9D3',
          "#EBC0B8",
        ],
    };
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
                <h1 className="text-header text-1">Nyheter</h1>
                <div className="content">
                    <div className="news-list">
                        {/* <ul>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                            <li style={{borderColor: this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)]}}>
                                <span className="text-6">7 Maj 2020</span>
                                <a className="text-3" href="#">Nyhet nummer uno</a>
                                <p className="text-5">
                                Convallis est lorem habitasse mollis. Feugiat id ullamcorper imperdiet amet sapien, aliquet. Et libero nisl quisque netus et fames scelerisque. Etiam facilisis faucibus pretium elit nulla pharetra, eu purus. 
                                </p>
                            </li>
                        </ul> */}
                        <button>Visa fler nyheter</button>
                    </div>
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
