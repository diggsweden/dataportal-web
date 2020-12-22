import React, { Component } from 'react';
import i18n from '../../i18n';
// import { TopImage } from 'assets/TopImage';
import { searchDatasetsPagePath } from '../../../src/utilities/urlHelpers';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { Link } from 'react-router-dom';

export interface CategoriesNavProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export class CategoriesNav extends React.Component<CategoriesNavProps> {
  render() {
    return (
      <div className="categoriesnav__wrapper">
        <div className="main-container">
          <div className="startpage-categories">
            <h2 className="text-3">
              {i18n.t('pages|startpage|datasets_by_category')}
            </h2>
            <ul>
            <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ENVI'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ENVI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ENVI'
                  )}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ECON'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ECON'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ECON'
                  )}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/EDUC'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/EDUC'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/EDUC'
                  )}
                </Link>
              </li>


              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/REGI'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/REGI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/REGI'
                  )}
                </Link>
              </li>

              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/INTR'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/INTR'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/INTR'
                  )}
                </Link>
              </li>

              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/GOVE'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/GOVE'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/GOVE'
                  )}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ENER'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ENER'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ENER'
                  )}
                </Link>
              </li>

              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/JUST'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/JUST'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/JUST'
                  )}
                </Link>
              </li>
              
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/HEAL'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/HEAL'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/HEAL'
                  )}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/SOCI'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/SOCI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/SOCI'
                  )}
                </Link>
              </li>


              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/AGRI'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/AGRI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/AGRI'
                  )}
                </Link>
              </li>


              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/TRAN'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/TRAN'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/TRAN'
                  )}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/TECH'
                    ),
                  })}
                  to={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/TECH'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/TECH'
                  )}
                </Link>
              </li>




            </ul>
          </div>
        </div>
      </div>
    );
  }
}
