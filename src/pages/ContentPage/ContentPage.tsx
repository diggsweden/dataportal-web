import React, { useState, useEffect } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from '../../i18n';
import { PageProps } from '../PageProps';
import {
  StaticBreadcrumb,
  StaticPath,
} from '../../components/Breadcrumb';
import { MenuItem } from './AnchorLinkMenu';
import { onNextFrame } from '../../utilities/onNextFrame';
import { isIE } from '../../utilities/detectBrowser';
import {
  skipToContent,
  skipToElement,
  startFromTop,
} from 'components/SkipToContent';

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

export const ContentPage: React.FC<ContentPageProps> = ({
  staticPaths,
  content,
  location,
  env
}) => {
  const initialState: MenuItem[] = [];
  const [menuItems, setMenuItems] = useState(initialState);

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

  let contentUrlSegment =
    staticPaths && staticPaths.length > 0
      ? staticPaths[staticPaths.length - 1].path
      : '';

  return (
    <>
      <PageMetadata
        seoTitle={`${content?.name} - ${i18n.t('common|seo-title')}`}
        seoDescription=""
        seoImageUrl=""
        seoKeywords=""
        robotsFollow={true}
        robotsIndex={true}
        lang={i18n.languages[0]}
        socialMeta={{
          socialDescription: content?.preambleHTML,
          socialTitle: content?.name,
          socialUrl: `${env.CANONICAL_URL}${contentUrlSegment}`,
        }}
      />

      <StaticBreadcrumb staticPaths={staticPaths} env={env} />

      <div className="main-container">
        <div className="news-article content">
          {content && content.imageUrl && (
            <img src={`${content.imageUrl}?width=1024`} />
          )}
          <h1 className="text-1 bkjsbkadjhb">{content.name}</h1>
          <p
            className="preamble text-4"
            dangerouslySetInnerHTML={{
              __html: content.preambleHTML,
            }}
          />
          <div
            className="main-text text-5"
            dangerouslySetInnerHTML={{
              __html: content.bodyHTML,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};
