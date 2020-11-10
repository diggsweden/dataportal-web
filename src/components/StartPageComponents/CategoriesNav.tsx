import React, { Component } from 'react';
import i18n from '../../i18n';
// import { TopImage } from 'assets/TopImage';
import { searchDatasetsPagePath } from '../../../src/utilities/urlHelpers';
import { EnvSettings } from '../../../config/env/EnvSettings';

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
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ENVI'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ENVI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ENVI'
                  )}
                </a>
              </li>
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ECON'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ECON'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ECON'
                  )}
                </a>
              </li>
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/EDUC'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/EDUC'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/EDUC'
                  )}
                </a>
              </li>


              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/REGI'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/REGI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/REGI'
                  )}
                </a>
              </li>

              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/INTR'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/INTR'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/INTR'
                  )}
                </a>
              </li>

              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/GOVE'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/GOVE'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/GOVE'
                  )}
                </a>
              </li>
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/ENER'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/ENER'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/ENER'
                  )}
                </a>
              </li>

              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/JUST'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/JUST'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/JUST'
                  )}
                </a>
              </li>
              
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/HEAL'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/HEAL'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/HEAL'
                  )}
                </a>
              </li>
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/SOCI'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/SOCI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/SOCI'
                  )}
                </a>
              </li>


              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/AGRI'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/AGRI'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/AGRI'
                  )}
                </a>
              </li>


              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/TRAN'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/TRAN'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/TRAN'
                  )}
                </a>
              </li>
              <li>
                <a
                  aria-label={i18n.t('pages|startpage|search_datasets_format', {
                    category: i18n.t(
                      'resource|http://publications.europa.eu/resource/authority/data-theme/TECH'
                    ),
                  })}
                  href={searchDatasetsPagePath(
                    i18n.languages[0],
                    'http://www.w3.org/ns/dcat#theme',
                    'http://publications.europa.eu/resource/authority/data-theme/TECH'
                  )}
                >
                  {i18n.t(
                    'resource|http://publications.europa.eu/resource/authority/data-theme/TECH'
                  )}
                </a>
              </li>




            </ul>
          </div>
        </div>
      </div>
    );
  }
}
