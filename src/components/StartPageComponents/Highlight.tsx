import React, { Component } from 'react';
import i18n from '../../i18n';
import { Illustration_1 } from 'assets/Illustration_1';
import { Illustration_2 } from 'assets/Illustration_2';
import { Illustration_3 } from 'assets/Illustration_3';

import { EnvSettings } from '../../../config/env/EnvSettings';

export interface HighlightProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

//Search head
export class Highlight extends React.Component<HighlightProps> {
  render() {
    return (
      <div className="main-container">
        <div className="highlight">
          <div className="highlight__illustraitons">
              <Illustration_1></Illustration_1>
              <Illustration_2></Illustration_2>
              <Illustration_3></Illustration_3>

          </div>
          <div className="highlight__txt">
            <h2 className="text-3">
              {i18n.t('pages|highlight|highlight-header')}
            </h2>
            <p className="text-5">{i18n.t('pages|highlight|highlight-text')}</p>

          </div>
          <div>
            {/* <TopImage /> */}
          </div>
        </div>
      </div>
    );
  }
}
