import React from 'react';
import { EnvSettings, SettingsUtil } from '../../env';
import { Settings_dataportal_v1_Digg_Settings } from '../../graphql/__generated__/Settings';
import { BreadcrumbProps } from '../Breadcrumb';

interface SettingsContext extends DataportalSettings {
  env: EnvSettings;
  setBreadcrumb?: React.Dispatch<React.SetStateAction<BreadcrumbProps>>;
}

export const extractSettings = (
  diggSettings: Settings_dataportal_v1_Digg_Settings
): DataportalSettings => {
  return {
    siteName:
      diggSettings?.items?.find((s) => s?.key === 'sitename')?.value || defaultSettings.siteName,
    pageNotFoundHeading:
      diggSettings?.items?.find((s) => s?.key === 'pageNotFoundHeading')?.value || '',
    pageNotFoundText: diggSettings?.items?.find((s) => s?.key === 'pageNotFoundText')?.value || '',
    noScriptContent: diggSettings?.items?.find((s) => s?.key === 'noScriptContent')?.value || '',
    cookieInformation:
      diggSettings?.items?.find((s) => s?.key === 'cookieInformation')?.value || '',
    cookieMoreInfoLink:
      diggSettings?.items?.find((s) => s?.key === 'cookieMoreInfoLink')?.value || '',
    matomoSiteId: diggSettings?.items?.find((s) => s?.key === 'matomoSiteId')?.value || '',    
  };
};

export const defaultSettings: SettingsContext = {
  env: SettingsUtil.getDefault(),
  siteName: 'Sveriges Dataportal',
  pageNotFoundHeading: '',
  pageNotFoundText: '',
  noScriptContent: '',
  cookieInformation: '',
  cookieMoreInfoLink: '',
  matomoSiteId: '-1',  
};

export const SettingsContext = React.createContext<SettingsContext>(defaultSettings);

export const SettingsProvider: React.FunctionComponent<{
  value: SettingsContext;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
