import { useMatomo } from '@datapunt/matomo-tracker-react';
import { getFormattedDate, Container, Heading } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { ContentArea, imageLoader, SettingsContext } from '../..';
import { News_dataportal_Digg_News } from '../../../graphql/__generated__/News';
import { initBreadcrumb } from '../../../pages/_app';
import { linkBase } from '../../../utilities';
import { checkLang } from '../../../utilities/checkLang';
import env from '@beam-australia/react-env';
import { MainContainerStyle } from '../../../styles/general/emotion';

export const ArticlePage: React.FC<News_dataportal_Digg_News> = ({
  heading,
  preamble,
  publishedAt,
  blocks,
  image,
}) => {
  const { setBreadcrumb } = useContext(SettingsContext);
  const { t } = useTranslation('routes');
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { width, height, url, alt } = image || {};

  useEffect(() => {
    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: heading || 'Article' });
    setBreadcrumb &&
      setBreadcrumb({
        name: heading || '_',
        crumbs: [
          {
            name: 'Start',
            link: { ...linkBase, link: '/' },
          },
          {
            name: t('news$title'),
            link: { ...linkBase, link: `/${t('news$path')}` },
          },
        ],
      });
  }, [pathname, heading]);
  return (
    <Container cssProp={MainContainerStyle}>
      <div className="news-article content">
        <span className="date_published text-base">{getFormattedDate(publishedAt)}</span>
        <Heading size="2xl">{checkLang(heading)}</Heading>
        <p className="preamble text-lg font-medium">{checkLang(preamble)}</p>
        <div className="news-article-page-img">
          <Image
            loader={() => imageLoader((env('MEDIA_BASE_URL') || '') + url, width as number)}
            src={(env('MEDIA_BASE_URL') || '') + url}
            width={width || ''}
            height={height || ''}
            alt={alt || ''}
            layout="responsive"
          />
        </div>
        <ContentArea blocks={blocks} />
      </div>
    </Container>
  );
};
