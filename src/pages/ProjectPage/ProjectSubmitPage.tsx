import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { PageProps } from '../PageProps';
import { TopImageTellUs } from 'assets/TopImageTellUS';

export const ProjectSubmitPage: React.FC<PageProps> = () =>
  <div className="project__submitpage project__page">
    <PageMetadata
      seoTitle="Tipsa oss! - Sveriges dataportal"
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
    // canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|projects|path')}/`}
    />
    <div className="theme_black">
      <div className="project__topimage">
        <TopImageTellUs />
      </div>
      <div>
        <div className="project__banner">
          <div className="main-container">
            <h1 className="text-1">Tipsa oss!</h1>
            <p className="preamble text-4">
              Vill du tipsa oss kring något som inspirerar till
              användning av öppna data eller datadriven
              innovation? Skicka gärna in dina tips till oss!{' '}
            </p>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="content">
          <h2 className="text-3">Så här går det till </h2>
          <p className=" main-text text-5">
            Skicka ett mejl och beskriv kortfattat vad ditt tips
            handlar om. Skicka gärna med länkar eller annan
            information som kan hjälpa oss att förstå och bedöma
            ditt tips. Skriv också hur vi kan ta kontakt med dig
            eller andra personer som vet mer om det du vill tipsa
            om. Vi tar gärna emot tips, men kan inte garantera att
            vi publicerar något kring de tips vi får in.
          </p>
          <p className=" main-text text-5">
            Om vi går vidare med ditt tips tar vi kontakt med dig
            för att ta reda på mer information för en eventuell
            artikel på dataportal.se.
          </p>

          <a
            className="submit-link"
            href="mailto:someone@yoursite.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Skicka in tips via mejl
          </a>
        </div>
      </div>
    </div>
  </div>