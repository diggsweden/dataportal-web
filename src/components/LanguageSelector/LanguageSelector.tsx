import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import i18n from '../../i18n';

interface IProps extends WithTranslation {}

class LanguageSelector extends Component<IProps> {
    handleClick() {
        const switchToLang = (i18n.language === 'en') ? 'sv' : 'en';
        i18n.changeLanguage(switchToLang);
    }

    render() {
        return (
            <div>
                <div className="lang-select">
                  <button onClick={this.handleClick} className="text-7">
                  {i18n.t('common|language')}
                  </button>
                </div>
            </div>
        );
    }
}

export default withTranslation()(LanguageSelector);