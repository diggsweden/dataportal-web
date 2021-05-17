import { Box, Accordion } from '@digg/design-system';
import React, { useState, useEffect } from 'react';
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
import i18n from '../../i18n';
import { SettingsContext } from '../../components/SettingsProvider';
import { PageProps } from '../PageProps';
import Helmet from 'react-helmet';
import moment from 'moment';
import {
  Breadcrumb,
  StaticBreadcrumb,
  StaticPath,
} from '../../components/Breadcrumb';
import { MenuItem, AnchorLinkMenu } from './AnchorLinkMenu';
import { onNextFrame } from '../../utilities/onNextFrame';
import { isIE } from '../../utilities/detectBrowser';
import {
  skipToContent,
  skipToElement,
  startFromTop,
} from 'components/SkipToContent';

const MainContent = Box.withComponent('main');

const getLinks = () => {
  const menuItems: MenuItem[] = [];
  let headerScope = '.main-text';
  let cont: HTMLElement =
    document.querySelector(headerScope) || document.createElement('div');
  let hTags = Array.prototype.slice.call(
    cont.querySelectorAll('h2') || document.createElement('div'),
    0
  );

  // Set only if there are more than 2 elements
  hTags.length > 2 &&
    hTags.forEach((element: HTMLElement) => {
      // filter swedish charachters and whitespaces from anchor
      let chars: any = { å: 'a', ä: 'a', ö: 'o', ' ': '_', '.': '' };
      const id = `${element.innerText
        .toLowerCase()
        .replace(/[åäö\s\.]/g, (m: any) => chars[m])}`;
      // Get the sibling element and give it the id
      element.id = `${id}`;
      menuItems.push({
        id: id,
        text: element.textContent,
      } as MenuItem);
    });

  return menuItems;
};

interface ContentPageProps extends PageProps {
  content: any;
  staticPaths: StaticPath[];
}

export const ContentPage: React.FC<ContentPageProps> = (props) => {
  // private headerRef: React.RefObject<Header>;
  const { content } = props;
  const initialState: MenuItem[] = [];
  const [menuItems, setMenuItems] = useState(initialState);
  // const [width, setWidth] = useState(getWidth());
  const AnchorLinkMenuRef = React.createRef<HTMLDivElement>(); //for making changes in ms edge legacy
  const { location } = props;
  const headerRef = React.createRef<Header>();

  useEffect(() => {
    const newMenuItems = getLinks();
    // Make sure that the state needs to be updated
    if (
      (menuItems[0] &&
        newMenuItems[0] &&
        menuItems[0].id !== newMenuItems[0].id) ||
      (menuItems[0] && !newMenuItems[0]) ||
      (!menuItems[0] && newMenuItems[0])
    ) {
      !isIE && setMenuItems(newMenuItems);
    }
    !location.hash
      ? onNextFrame(() => (skipToContent(), startFromTop()))
      : onNextFrame(() => skipToElement(location.hash));
  });

  let uri = new URLSearchParams(location.search);

  let contentUrlSegment = props.staticPaths && props.staticPaths.length > 0? props.staticPaths[props.staticPaths.length-1].path : '';

  return (
    <QueryParamProvider params={uri}>      
      <SettingsContext.Consumer>
        {(settings) => (          
          <Box
            id="top"
            display="flex"
            direction="column"
            minHeight="100vh"
            bgColor="#fff"
          >
            <NoJavaScriptWarning text="" />

            <Header ref={headerRef} />

            <PageMetadata
              seoTitle={`${props.content?.name} - ${i18n.t('common|seo-title')}`}
              seoDescription=""
              seoImageUrl=""
              seoKeywords=""
              robotsFollow={true}
              robotsIndex={true}
              lang={i18n.languages[0]}
              socialMeta={{
                socialDescription : props.content?.preambleHTML,
                socialTitle : props.content?.name,
                socialUrl : `${props.env.CANONICAL_URL}${contentUrlSegment}`
              }}
              
            />

            <ErrorBoundary>
              <MainContent flex="1 1 auto">
                <StaticBreadcrumb
                  staticPaths={props.staticPaths}
                  env={settings.env}
                />

                <div className="main-container">
                  <div className="news-article content">                    
                    {props.content && props.content.imageUrl && (
                      <img src={`${props.content.imageUrl}?width=1024`} />
                    )}
                    <h1 className="text-1 bkjsbkadjhb">{props.content.name}</h1>
                    <p
                      className="preamble text-4"
                      dangerouslySetInnerHTML={{
                        __html: props.content.preambleHTML,
                      }}
                    />
                    <div
                      className="main-text text-5"
                      dangerouslySetInnerHTML={{
                        __html: props.content.bodyHTML,
                      }}
                    ></div>
                  </div>
                </div>
              </MainContent>
            </ErrorBoundary>
            <Footer onToTopButtonPushed={() => {}} />
          </Box>
        )}
      </SettingsContext.Consumer>
    </QueryParamProvider>
  );
  // }
};
