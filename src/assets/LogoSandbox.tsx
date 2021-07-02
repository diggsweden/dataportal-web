import React from 'react';
import i18n from 'i18n';
import { LogoSandboxSE } from './LogoSandboxSE';
import { LogoSandboxEN } from './LogoSandboxEN';

const title = i18n.t('common|logo-alt-title');
const titleID = 'LogoID';

export const SandboxLogo: React.FC = () => {
  if (i18n.language === 'en') {
    return <LogoSandboxEN title={title} id={titleID} />;
  }
  return <LogoSandboxSE title={title} id={titleID} />;
};
