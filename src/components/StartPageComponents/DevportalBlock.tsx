import React, { Component } from 'react';
import i18n from '../../i18n';
import { DevportalIllustration } from 'assets/illustration_devportal';
import { EnvSettings } from '../../../config/env/EnvSettings';

export interface DevportalBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export class DevportalBlock extends React.Component<DevportalBlockProps> {
  render() {
    return (
      <div>
        {i18n.language.toLowerCase() === 'sv' || i18n.language.toLowerCase() === 'sv-se' ? (
          <div className="main-container ">
            <div className="devportalblock">
              <div className="devportalblock-left-col">
                <h2 className="text-3">
                  Lär dig mer om API-hantering på Utvecklarportalen
                </h2>
                <p className="text-5">
                  Ta del av rekommendationer för hur den offentliga sektorn ska arbeta med utveckling av API:er. En första version av en nationell REST API profil finns publicerad på webbplatsen samt en API-Playbook.
                </p>
                <a className="text-5-link external-link-icon" href="https://dev.dataportal.se/">Till Utvecklarportalen</a>
              </div>
              <div className="devportalblock-right-col">
                <DevportalIllustration />
              </div>
            </div>
          </div>
        )
          :
          ('')
        }
      </div>
    );
  }
}
