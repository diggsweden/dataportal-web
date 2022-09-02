import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { EnvSettings } from '../../env/EnvSettings';
import { LogoEN } from './LogoEN';
import { LogoSE } from './LogoSE';
import { LogoTestEN } from './LogoTestEN';
import { LogoTestSE } from './LogoTestSE';

export const DataportalLogo: React.FC<{env:EnvSettings}> = (props) => {
  const { t, lang } = useTranslation('common');
  const title = t('logo-alt-title');
  const titleID = 'LogoID';
  if (lang === 'en') {    
    if(props.env.envName == 'sandbox' || props.env.envName == 'test')
      return (
        <LogoTestEN
          title={title}
          id={titleID}
        />
      );
    else
      return (
        <LogoEN
          title={title}
          id={titleID}
        />
      );
  }

  if(props.env.envName == 'sandbox' || props.env.envName == 'test')
      return (
        <LogoTestSE
          title={title}
          id={titleID}
        />
      );
    else
      return (    
        <LogoSE
          title={title}
          id={titleID}
        />
      );
};
