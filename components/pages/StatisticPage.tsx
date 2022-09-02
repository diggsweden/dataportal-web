import { useMatomo } from '@datapunt/matomo-tracker-react';
import { Heading, Container } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import {
  Statistic,
  StatisticGraphNumbers,
  StatisticNumbersDatasets,
} from '../../components/Statistic';
import { initBreadcrumb } from '../../pages/_app';
import { MainContainerStyle } from '../../styles/general/emotion';
import { makeBreadcrumbsFromPath } from '../../utilities';
import { SettingsContext } from '../SettingsProvider';

export const StatisticPage: React.FC = () => {
  const { t } = useTranslation('pages');
  const { asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { setBreadcrumb } = useContext(SettingsContext);

  useEffect(() => {
    trackPageView({ documentTitle: t('statistic$statistic-page-header') });
    setBreadcrumb && setBreadcrumb(makeBreadcrumbsFromPath(asPath, t('routes|statistics$title')));
    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, [asPath]);

  return (
    <>
      <Head>
        <title>{`${t('statistic$statistic-page-header')} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t('statistic$statistic-page-header')} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t('statistic$statistic-page-header')} - Sveriges dataportal`}
        />
      </Head>
      <Container cssProp={MainContainerStyle}>
        <Heading size={'2xl'}>{t('statistic$statistic-page-header')} </Heading>
        <div className="content statistic-page">
          <p className="main-text text-md">{t('statistic$statistic-page-text')}</p>
          <StatisticGraphNumbers />
          <p className="main-text text-md">
            {t('statistic$statistic-page-numberofdatasets')} <StatisticNumbersDatasets />
          </p>
          <Statistic />
        </div>
      </Container>
    </>
  );
};
