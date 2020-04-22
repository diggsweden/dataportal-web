import React, { Component } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';

export interface NewsProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export class News extends React.Component<NewsProps> {
  render() {
    return (
      <div>
        <h2 className="text-3">Nyheter</h2>
        <div className="news-compact">
          <div className="news-pinned">
            <div>
              <TopImage />
            </div>
            <div>
              <span className="text-6">20 Mars 2020</span>
              <h3 className="">
                <a className="text-4" href="#">
                  Nyhet nummero uno
                </a>
              </h3>
              <p className="text-5">
                {' '}
                Amet facilisis id pulvinar est vitae vel amet dignissim aliquam.
                Feugiat gravida ut tortor nec sit vel viverra sed ut. Feugiat
                gravida ut tortor nec sit vel viverra sed ut. Feugiat gravida ut
                tortor. Feugiat gravida ut tortor nec sit vel viverra sed ut. Feugiat gravida ut
                tortor. Feugiat
                gravida ut tortor nec sit vel viverra sed ut. Feugiat gravida ut
                tortor.
              </p>
            </div>
          </div>

          <div className="news-list-compact">
            <ul>
              <li>
                <span className="text-6">20 Mars 2020</span>
                <h3>
                  <a className="text-4" href="#">
                    Nyhet nummero uno
                  </a>
                </h3>
                <p className="text-5">
                  Amet facilisis id pulvinar est vitae vel amet dignissim
                  aliquam. Feugiat gravida ut tortor nec sit vel viverra sed ut.
                </p>
              </li>

              <li>
                <span className="text-6">20 Mars 2020</span>
                <h3>
                  <a className="text-4" href="#">
                    Nyhet nummero uno
                  </a>
                </h3>
                <p className="text-5">
                  Amet facilisis id pulvinar est vitae vel amet dignissim
                  aliquam. Feugiat gravida ut tortor nec sit vel viverra sed ut.
                </p>
              </li>

              <li>
                <span className="text-6">20 Mars 2020</span>
                <h3>
                  <a className="text-4" href="#">
                    Nyhet nummero uno
                  </a>
                </h3>
                <p className="text-5">
                  Amet facilisis id pulvinar est vitae vel amet dignissim
                  aliquam. Feugiat gravida ut tortor nec sit vel viverra sed ut.
                </p>
              </li>

              <li>
                <span className="text-6">20 Mars 2020</span>
                <h3>
                  <a className="text-4" href="#">
                    Nyhet nummero uno
                  </a>
                </h3>
                <p className="text-5">
                  Amet facilisis id pulvinar est vitae vel amet dignissim
                  aliquam. Feugiat gravida ut tortor nec sit vel viverra sed ut.
                </p>
              </li>
            </ul>
            <a
              href={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
              className="default-button text-5">
              Visa alla nyheter
            </a>
          </div>
        </div>
      </div>
    );
  }
}
