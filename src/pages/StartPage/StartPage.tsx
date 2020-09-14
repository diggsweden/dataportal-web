import {
  Box,
  ArrowIcon,
  SearchIcon,
  Accordion,
  Container,
  colorPalette,
} from '@digg/design-system';
import React from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext, Redirect } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import { TopImage } from 'assets/TopImage';
import i18n from 'i18n';
import { Statistic } from '../../components/Statistic';
import { SettingsContext } from '../../components/SettingsProvider';
import { PageProps } from 'pages/PageProps';
import { StatisticGraph } from '../../components/StatisticGraph';
import { Highlight } from '../../components/Highlight';
import { ArticleBlock } from 'components/Articles';
import { searchDatasetsPagePath } from 'utilities/urlHelpers'

const MainContent = Box.withComponent('main');

export class StartPage extends React.Component<PageProps, any> {
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
        <SettingsContext.Consumer>
          {settings => (
            <Box
              id="top"
              display="flex"
              direction="column"
              minHeight="100vh"
              bgColor="#fff"
            >
              <PageMetadata
                seoTitle={i18n.t('pages|startpage|seo_title')}
                seoDescription={i18n.t('pages|startpage|seo_description')}
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
                canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/`}
              />
              <NoJavaScriptWarning text="" />

              <Header ref={this.headerRef} />

              <ErrorBoundary>
                <MainContent id="main" flex="1 1 auto">
                  <div className="wpb_wrapper">
                    <div className="main-search-container">
                      <div className="startpage-top">
                        <div className="startpage-search">
                          <h1 className="">
                            {i18n.t('pages|startpage|search_title_1')}
                            <br/>
                            {i18n.t('pages|startpage|search_title_2')}
                          </h1>
                          <form
                            className="startpage-form"
                            method="GET"
                            action={`/${i18n.languages[0]}/datasets`}
                          >
                            <label
                              className="screen-reader"
                              htmlFor="start-search"
                            >
                              {i18n.t('pages|startpage|search_placeholder')}
                            </label>
                            <input
                              id="start-search"
                              type="text"
                              placeholder={i18n.t(
                                'pages|startpage|search_placeholder'
                              )}
                              name="q"
                              autoComplete="off"
                            ></input>
                            <button
                              className="startpage-searchbtn"
                              type="submit"
                              aria-label={i18n.t('pages|startpage|search_placeholder')}
                            >
                              <SearchIcon
                                color={colorPalette.white}
                                width={[32]}
                              />
                            </button>
                          </form>
                        </div>

                        <div className="search-boxes">
                          <div
                            onClick={e => {
                              window.location.href = `/${i18n.languages[0]}/datasets?p=1&q=&f=`;
                            }}
                          >
                            <a
                              className="text-4"
                              aria-label={i18n.t('pages|search|datasets')}
                              href={`/${i18n.languages[0]}/datasets?p=1&q=&f=`}
                            >
                              {i18n.t('pages|search|datasets')}
                            </a>
                            <span className="text-6">{i18n.t('pages|startpage|explore_datasets')}</span>
                          </div>

                          <div
                            className="disabled-linkbox"
                            // onClick={e => {
                            //   window.location.href = `/${i18n.languages[0]}/concepts?p=1&q=&f=`;
                            // }}
                          >
                            <span className="soon">{i18n.t('pages|startpage|coming_soon')}</span>

                            <span
                              className="text-4"
                              // aria-label="Sök efter begrepp"
                              // href={`/${i18n.languages[0]}/concepts?p=1&q=&f=`}
                            >
                              {i18n.t('pages|search|concepts')}
                            </span>
                            <span className="text-6">
                            {i18n.t('pages|startpage|explore_concepts')}
                            </span>
                          </div>

                          <div
                            className="disabled-linkbox"
                            // onClick={e => {
                            //   window.location.href = `/${i18n.languages[0]}/specifications?p=1&q=&f=`;
                            // }}
                          >
                            <span className="soon">{i18n.t('pages|startpage|coming_soon')}</span>

                            <span
                              className="text-4"
                              // aria-label="Sök efter specifikationer"
                              // href={`/${i18n.languages[0]}/specifications?p=1&q=&f=`}
                            >
                              {i18n.t('pages|search|specifications')}
                            </span>
                            <span className="text-6">
                              {i18n.t('pages|startpage|explore_specs')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="main-container">
                      <div className="startpage-categories">
                          <h2 className="text-3">{i18n.t('pages|startpage|datasets_by_category')}</h2>
                        <ul>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ENVI') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/ENVI')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ENVI')}
                            </a>
                          </li>
                          <li>
                          <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/SOCI') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/SOCI')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/SOCI')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/HEAL') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/HEAL')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/HEAL')}
                            </a>
                          </li>
                          <li>
                          <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ENER') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/ENER')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ENER')}
                            </a>
                          </li>
                          <li>
                          <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/EDUC') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/EDUC')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/EDUC')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/TRAN') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/TRAN')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/TRAN')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/REGI') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/REGI')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/REGI')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ECON') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/ECON')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/ECON')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/AGRI') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/AGRI')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/AGRI')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/GOVE') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/GOVE')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/GOVE')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/TECH') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/TECH')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/TECH')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/INTR') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/INTR')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/INTR')}
                            </a>
                          </li>
                          <li>
                            <a
                              aria-label={i18n.t('pages|startpage|search_datasets_format', {category: i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/JUST') })}
                              href={searchDatasetsPagePath(i18n.languages[0],'http://www.w3.org/ns/dcat#theme','http://publications.europa.eu/resource/authority/data-theme/JUST')}
                            >
                              {i18n.t('resource|http://publications.europa.eu/resource/authority/data-theme/JUST')}
                            </a>
                          </li>
                        </ul>
                      </div>

                      <Highlight env={settings.env} />

                      <ArticleBlock env={settings.env}/>

                      {/* <RenderInBrowser except ie> */}
                      <StatisticGraph env={settings.env} />
                      {/* </RenderInBrowser> */}
                      <Statistic env={settings.env} />
                    </div>
                  </div>
                </MainContent>
              </ErrorBoundary>
              <Footer onToTopButtonPushed={this.setFocus} />
            </Box>
          )}
        </SettingsContext.Consumer>
      </QueryParamProvider>
    );
  }
}
