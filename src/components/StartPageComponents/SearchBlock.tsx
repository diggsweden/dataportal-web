import {
  Box,
  ArrowIcon,
  SearchIcon,
  Accordion,
  Container,
  colorPalette,
} from '@digg/design-system';
import React, { Component } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';

export interface SearchBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

//Search head
export class SearchBlock extends React.Component<SearchBlockProps> {
  render() {
    return (
      <div className="main-search-container">
        <TopImage></TopImage>
        <div className="startpage-top">
          <div className="startpage-search">
            <h1 className="text-1">
              {i18n.t('pages|startpage|search_title_1')}
            </h1>
            <form
              className="startpage-form"
              method="GET"
              action={`/${i18n.languages[0]}/datasets`}
            >
              <label className="screen-reader" htmlFor="start-search">
                {i18n.t('pages|startpage|search_placeholder')}
              </label>
              <input
                id="start-search"
                type="text"
                placeholder={i18n.t('pages|startpage|search_placeholder')}
                name="q"
                autoComplete="off"
              ></input>
              <button
                className="startpage-searchbtn"
                type="submit"
                aria-label={i18n.t('pages|startpage|search_placeholder')}
              >
                <SearchIcon color={colorPalette.white} width={[32]} />
              </button>
            </form>
          </div>

          <div className="search-boxes">
            <div
            // onClick={(e) => {
            //   window.location.href = `/${i18n.languages[0]}/datasets?p=1&q=&f=`;
            // }}
            >
              <a
                className="text-5-bold"
                aria-label={i18n.t('pages|search|datasets')}
                href={`/${i18n.languages[0]}/datasets?p=1&q=&f=`}
              >
                {i18n.t('pages|search|datasets')}
              </a>
              <span className="text-6">
                {i18n.t('pages|startpage|explore_datasets')}
              </span>
            </div>

            <div
              className=""
              // onClick={e => {
              //   window.location.href = `/${i18n.languages[0]}/concepts?p=1&q=&f=`;
              // }}
            >
              {/* <span className="soon">
                  {i18n.t('pages|startpage|coming_soon')}
                </span> */}

              <span
                className="text-5-bold"
                // aria-label="Sök efter begrepp"
                // href={`/${i18n.languages[0]}/concepts?p=1&q=&f=`}
              >
                {i18n.t('pages|search|concepts')}{' '}
                <span className="text-6">
                  {' '}
                  ({i18n.t('pages|startpage|coming_soon')})
                </span>
              </span>
              <span className="text-6">
                {i18n.t('pages|startpage|explore_concepts')}
              </span>
            </div>

            <div
              className=""
              // onClick={e => {
              //   window.location.href = `/${i18n.languages[0]}/specifications?p=1&q=&f=`;
              // }}
            >
              {/* <span className="soon">
                  {i18n.t('pages|startpage|coming_soon')}
                </span> */}

              <span
                className="text-5-bold"
                // aria-label="Sök efter specifikationer"
                // href={`/${i18n.languages[0]}/specifications?p=1&q=&f=`}
              >
                {i18n.t('pages|search|specifications')}{' '}
                <span className="text-6">
                  {' '}
                  ({i18n.t('pages|startpage|coming_soon')})
                </span>
              </span>
              <span className="text-6">
                {i18n.t('pages|startpage|explore_specs')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
