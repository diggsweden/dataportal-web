import React, { Component } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';

export interface HighlightProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

//Search head
export class Highlight extends React.Component<HighlightProps> {
  render() {
    return (
      <div className="highlight">
        <div>
          <h2 className="text-3">
            {i18n.t('pages|highlight|highlight-header')}
          </h2>
          <p className="text-5">{i18n.t('pages|highlight|highlight-text')}</p>
        </div>
        <div>
          <TopImage />
        </div>
      </div>
    );
  }
}
