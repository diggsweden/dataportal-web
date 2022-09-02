import React, { useEffect, useState } from 'react';
import { client, CONTAINER_QUERY } from '../graphql';
import { ContentArea } from '../components';
import {
  Containers,
  ContainersVariables,
  Containers_dataportal_Digg_Containers,
} from '../graphql/__generated__/Containers';
import { SharedContentData_blocks } from '../graphql/__generated__/SharedContentData';
import { Start_dataportal_Digg_Start_blocks } from '../graphql/__generated__/Start';
import { isIE } from '../utilities';
import { AnchorLinkMenu, Heading } from '@digg/design-system';
import { checkLang } from '../utilities/checkLang';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Container } from '@digg/design-system';
import { css } from '@digg/design-system';
import { space } from '@digg/design-system';
import { MainContainerStyle } from '../styles/general/emotion';

/**
 * Gets all h2 elements on the page and sets id:s to a visibility:hidden sibling be used
 * in the anchorLinkMenu
 * @returns {Array} An array of id:s to all h2-elements on the page
 */
const getLinks = () => {
  const menuItems: Anchorlink[] = [];
  let headerScope = '.content';
  let cont: HTMLElement = document.querySelector(headerScope) || document.createElement('div');
  let hTags = Array.prototype.slice.call(
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

export const Page: React.FC<Containers_dataportal_Digg_Containers> = ({
  heading,
  preamble,
  uiHints,
  blocks,
  name,
}) => {
  const [menuItems, setMenuItems] = useState<Anchorlink[]>([]);
  const { pathname } = useRouter() || {};
  const { t } = useTranslation();
  const { trackPageView } = useMatomo();
  const AnchorLinkMenuRef = React.createRef<HTMLDivElement>(); //for making changes in ms edge legacy

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
  }, [menuItems]);

  useEffect(() => {
    trackPageView({ documentTitle: name });
  }, [pathname]);

  // const hideSubMenu = uiHints?.includes('hideSubMenu');
  const showContentMenu = uiHints?.find((hint) => hint === 'showContentMenu');
  const fullWidth = uiHints?.find((hint) => hint === 'fullWidth');

  return (
    <Container cssProp={MainContainerStyle}>
      {heading && <Heading>{checkLang(heading)}</Heading>}
      <div
        css={css`
          position: relative;
        `}
      >
        {!fullWidth && (
          <div className="anchorlink_wrapper">
            {menuItems[0] && showContentMenu && (
              <AnchorLinkMenu
                menuItems={menuItems}
                menuHeading={t('content-menu-heading')}
                anchorLinkMenuRef={AnchorLinkMenuRef}
              />
            )}
          </div>
        )}

        <div className={fullWidth ? fullWidth : 'content'}>
          <p className="preamble text-lg">{checkLang(preamble)}</p>
          {blocks && blocks.length > 0 && (
            <ContentArea
              blocks={
                blocks as (Start_dataportal_Digg_Start_blocks | SharedContentData_blocks | null)[]
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export async function getStaticProps({ params, locale }: any) {
  const slug = '/' + params?.containerSlug?.join('/');
  // Get external data from the file system, API, DB, etc.
  const result = await client.query<Containers, ContainersVariables>({
    query: CONTAINER_QUERY,
    variables: {
      filter: { slug, limit: 1, locale },
    },
    fetchPolicy: 'no-cache',
  });

  const page = result && result.data ? result.data.dataportal_Digg_Containers[0] : undefined;

  if (result && result.error) {
    console.error(result.error);
  }

  if (!page) {
    console.warn(`No page found for path: ${slug}`);
    return {
      notFound: true,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60'),
    };
  }

  // The value of the `props` key will be
  //  passed to the `Page` component
  return {
    props: { ...page },
    revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60'),
  };
}

export async function getStaticPaths({ locales }: { locales: string[] }) {
  const paths: any[] = [];
  // await Promise.all(
  //   // create static paths for all locales
  //   locales.map(async (locale) => {
  //     // Get external data from the file system, API, DB, etc.
  //     const result = await client.query<Containers, ContainersVariables>({
  //       query: CONTAINER_QUERY,
  //       variables: { filter: { locale } },
  //     });

  //     const containers = result?.data?.dataportal_Digg_Containers;

  //     if (result?.error) {
  //       console.error(result?.error);
  //     }

  //     containers &&
  //       extractSlugs(containers).map((arr) => {
  //         paths.push({ params: { containerSlug: arr }, locale });
  //       });
  //   })
  // );

  return {
    paths,
    fallback: 'blocking',
  };
}

export default Page;
