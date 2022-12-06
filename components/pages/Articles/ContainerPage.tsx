import React, { useContext, useEffect, useState } from 'react';
import { ContainerNavigation, ContentArea, SettingsContext } from '../../../components';
import {
  Containers_dataportal_Digg_Containers as IContainer,
  Containers_dataportal_Digg_Containers_blocks,
} from '../../../graphql/__generated__/Containers';
import { Module_blocks } from '../../../graphql/__generated__/Module';
import { isIE } from '../../../utilities';
import { AnchorLinkMenu, Heading, SearchField, space } from '@digg/design-system';
import { checkLang } from '../../../utilities/checkLang';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Container } from '@digg/design-system';
import { css } from '@digg/design-system';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { Related_containers } from '../../../graphql/__generated__/Related';
import { MultiContainers_category_categories } from '../../../graphql/__generated__/MultiContainers';

/**
 * Uses prismjs to style codeblock
 */
export const highlightCodeBlock = async () => {
  // ? Fix to get <br/> as line-breaks
  (await import('prismjs')).hooks.add('before-highlight', function (env) {
    env.code = (env as any).element.innerText;
  });
  // * init prismjs
  (await import('prismjs')).highlightAll();
  // ? Await all plugins and components to fix hydration issue
  await require('prismjs/plugins/line-numbers/prism-line-numbers');
  await require('prismjs/components/prism-markup-templating');
  await require('prismjs/components/prism-csharp');
  await require('prismjs/components/prism-json');
  await require('prismjs/components/prism-javascript');
  await require('prismjs/components/prism-css');
  await require('prismjs/components/prism-php');
  await require('prismjs/components/prism-ruby');
  await require('prismjs/components/prism-python');
  await require('prismjs/components/prism-java');
  await require('prismjs/components/prism-c');
  await require('prismjs/components/prism-cpp');
  await require('prismjs/plugins/line-numbers/prism-line-numbers');
  await require('prismjs/plugins/toolbar/prism-toolbar');
  await require('prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard');
};

/**
 * Gets all h2 elements on the page and sets id:s to a visibility:hidden sibling be used
 * in the anchorLinkMenu
 * @returns {Array} An array of id:s to all h2-elements on the page
 */
const getLinks = () => {
  const menuItems: Anchorlink[] = [];
  const headerScope = '.content';
  const cont: HTMLElement = document.querySelector(headerScope) || document.createElement('div');
  const hTags = Array.prototype.slice.call(
    cont.querySelectorAll('h2') || document.createElement('div'),
    0
  );

  // Set only if there are more than 2 elements
  hTags.length > 2 &&
    hTags.forEach((element: HTMLElement) => {
      // filter swedish charachters and whitespaces from anchor
      let chars: any = { å: 'a', ä: 'a', ö: 'o', ' ': '_', '.': '' };
      const id = `${element.innerText.toLowerCase().replace(/[åäö\s\.]/g, (m: any) => chars[m])}`;
      // Get the sibling element and give it the id
      element.id = `${id}`;
      menuItems.push({
        id: id,
        text: element.textContent,
      } as Anchorlink);
    });

  return menuItems;
};

interface ContainerPageProps extends IContainer {
  related?: Related_containers[];
  domain?: DiggDomain;
  category?: MultiContainers_category_categories;
}

const styles = css`
  position: relative;
  ${space({ mb: 16 })};
`;

export const ContainerPage: React.FC<ContainerPageProps> = ({
  heading,
  preamble,
  blocks,
  name,
  related,
  domain,
}) => {
  const [menuItems, setMenuItems] = useState<Anchorlink[]>([]);
  const { asPath } = useRouter() || {};
  const { t } = useTranslation();
  const { trackPageView } = useMatomo();
  const AnchorLinkMenuRef = React.createRef<HTMLDivElement>(); //for making changes in ms edge legacy
  const { appRenderKey } = useContext(SettingsContext);

  // todo - add some conditions for these
  const showContentMenu = menuItems[0] && menuItems.length > 2;
  const fullWidth = false;
  const hasRelatedContent = related && related.length > 2;

  useEffect(() => {
    const newMenuItems = getLinks();
    // Make sure that the state needs to be updated
    if (
      (menuItems[0] && newMenuItems[0] && menuItems[0].id !== newMenuItems[0].id) ||
      (menuItems[0] && !newMenuItems[0]) ||
      (!menuItems[0] && newMenuItems[0])
    ) {
      !isIE && setMenuItems(newMenuItems);
    }
  }, [menuItems, asPath, appRenderKey]);

  useEffect(() => {
    highlightCodeBlock();

    // Adds lang attribute to codeBlocks
    const codeWrappers = Array.prototype.slice.call(
      document.getElementsByClassName('code-toolbar')
    );
    codeWrappers.map((codeWrapper) => codeWrapper.setAttribute('lang', 'en'));

    // Adds line numbers to codeBlocks
    const pres = Array.prototype.slice.call(document.getElementsByTagName('pre'));
    pres.map((pre) => pre.classList.add('line-numbers'));

    // Matomo tracking
    trackPageView({ documentTitle: name });
  }, [asPath]);

  return (
    <Container cssProp={MainContainerStyle}>
      {hasRelatedContent && (
        <ContainerNavigation
          related={related}
          domain={domain}
        />
      )}
      {heading && (
        <Heading
          color="pinkPop"
          weight="light"
        >
          {checkLang(heading)}
        </Heading>
      )}
      <div css={styles}>
        {!fullWidth && (
          <div className="anchorlink_wrapper">
            {showContentMenu && (
              <AnchorLinkMenu
                menuItems={menuItems}
                menuHeading={t('common|content-menu-heading')}
                anchorLinkMenuRef={AnchorLinkMenuRef}
              />
            )}
          </div>
        )}

        <div className={fullWidth ? fullWidth : 'content'}>
          <p className="preamble text-lg">{checkLang(preamble)}</p>
          {/* {hasRelatedContent && (
            <div className="container--related-search">
              <Heading
                level={2}
                size="xl"
              >
                Sök inom kategorin {category?.name}
              </Heading>
              <SearchField
                submitLabel="Sök"
                placeholder="Skriv in sökord"
              />
            </div>
          )} */}
          {blocks && blocks.length > 0 && (
            <ContentArea
              blocks={
                blocks as (Containers_dataportal_Digg_Containers_blocks | Module_blocks | null)[]
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
};
