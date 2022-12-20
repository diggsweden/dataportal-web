import { useMatomo } from '@datapunt/matomo-tracker-react';
import { css, space, Heading, Container, SearchField } from '@digg/design-system';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Containers_dataportal_Digg_Containers } from '../../graphql/__generated__/Containers';
import { MainContainerStyle } from '../../styles/general/emotion';
import { checkLang } from '../../utilities';
import { Puffs, IPuff } from '../Navigation';
import { Publication_dataportal_Digg_Publications as IPublication } from '../../graphql/__generated__/Publication';
import useTranslation from 'next-translate/useTranslation';
import { ContentArea } from '../ContentArea';
import { CategoriesNav } from '../StartPageComponents';
import { handleDomain } from '../../utilities/domain';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { handleUrl } from '../blocks';
import { responsive } from '../../styles/image';

export interface DomainProps extends Containers_dataportal_Digg_Containers {
  domain?: DiggDomain;
  news?: IPublication;
  example?: IPublication;
  event?: IPublication;
  areas?: IPuff[];
  themes?: IPuff[];
}

const DynamicStatisticGraph = dynamic(() => import('../Statistic/StatisticGraph'), {
  ssr: false,
});

const DynamicStatisticNumbers = dynamic(() => import('../Statistic/StatisticNumbers'), {
  ssr: false,
});

const DynamicStatistic = dynamic(() => import('../Statistic/Statistic'), {
  ssr: false,
});

const DynamicArticleBlock = dynamic(() => import('../blocks/Article').then((c) => c.ArticleBlock), {
  ssr: false,
});

export const DomainPage: React.FC<DomainProps> = (props) => {
  const { domain, areas } = props || {};
  const { content, puffs, publications, heading, preamble, image } = handleDomain(props);
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { t, lang } = useTranslation('pages');
  const src = useMemo(() => image && handleUrl(image), [image]);

  useEffect(() => {
    trackPageView({ documentTitle: 'OpenSource' });
  }, [pathname]);

  return (
    <div className="gradient">
      <Container cssProp={MainContainerStyle}>
        <div className="domain-page">
          <div className="domain-page__header">
            <div className="domain-page__header-heading">
              {heading && (
                <Heading
                  size={'3xl'}
                  color={'pinkPop'}
                  weight={'light'}
                >
                  {checkLang(heading)}
                </Heading>
              )}
              <div>
                <p className="preamble text-md domain-page__preamble">{checkLang(preamble)}</p>
                {domain === 'data' && (
                  <form
                    className="datapage-form"
                    method="GET"
                    action={`/${lang}/datasets`}
                  >
                    <label
                      className="screen-reader"
                      htmlFor="start-search"
                    >
                      {t('startpage$search_placeholder')}
                    </label>
                    <SearchField
                      id="start-search"
                      name="q"
                      placeholder={t('startpage$search_placeholder')}
                      submitLabel="screen-reader"
                    />
                  </form>
                )}
              </div>
            </div>
            <span className="domain-page__top-image">
              {src && (                
                  <Image
                    src={src}
                    style={responsive}
                    width={image?.width || 300}
                    height={image?.height || 200}
                    alt={image?.alt || ''}
                  />                
              )}
            </span>
          </div>

          {puffs && (
            <Puffs
              links={puffs.links as IPuff[]}
              basepath={domain ? '/' + domain : undefined}
            />
          )}

          {pathname === `/` && publications.length > 0 && (
            <>
              <div className="domain-page__show_more--link">
                <Heading
                  level={2}
                  size="xl"
                  color="white"
                  css={css`
                    ${space({ pt: 4 })}
                  `}
                >
                  {t('pages|startpage$current-news')}
                </Heading>
                <Link
                  href={`/aktuellt`}
                  className="text-base"
                >
                  {t('pages|publications$view-all')}
                </Link>
              </div>              
              <DynamicArticleBlock articles={publications} />              
            </>
          )}

          {/* {areas && (
            <div className="domain-page__link-block">
              <Puffs links={areas} />
            </div>
          )} */}

          <div className={'fullWidth'}>
            {/* todo: this width? */}
            {content && (
              <div className="content">
                <ContentArea blocks={content} />
              </div>
            )}
          </div>

          {domain === 'data' && <CategoriesNav />}

          {areas && domain === 'data' && (
            <div className="domain-page__link-block domain-page__theme-block">
              <Heading
                level={2}
                size="xl"
                color="white"
              >
                {t('pages|data$data-areas_text')}
              </Heading>
              <Puffs links={areas} />
            </div>
          )}

          {!domain && (
            <div className="domain-page__statistics">
              <div className="domain-page__show_more--link">
                <Heading
                  level={2}
                  size="xl"
                  color="white"
                >
                  {t('pages|statistic$statistic-numbers')}
                </Heading>
                <Link
                  href={`/${t('routes|statistics$path')}`}
                  locale={lang}
                  className="statistic-link"
                >
                  {t('pages|statistic$statistic-link')}
                </Link>
              </div>

              <div className="statistic-wrapper">
                <DynamicStatisticGraph />
                <DynamicStatisticNumbers />
              </div>

              <DynamicStatistic />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
