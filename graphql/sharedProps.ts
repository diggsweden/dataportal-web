import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { FOOTER_QUERY } from './footerQuery';
import { MENU_QUERY } from './menuQuery';
import { SETTINGS_QUERY } from './settingsQuery';
import { Footer, FooterVariables } from './__generated__/Footer';
import { MainMenu, MainMenuVariables } from './__generated__/MainMenu';
import { Settings, SettingsVariables } from './__generated__/Settings';

const getMenu = async (client: ApolloClient<NormalizedCacheObject>, locale: string) => {
  const result = await client.query<MainMenu, MainMenuVariables>({
    query: MENU_QUERY,
    variables: { locale },
    fetchPolicy: 'no-cache',
  });

  if (result && result.error) {
    console.log('error in menu');
    console.error(result.error);
    return undefined;
  }

  return result?.data?.dataportal_v1_Digg_Menu;
};

const getFooter = async (client: ApolloClient<NormalizedCacheObject>, locale: string) => {
  const result = await client.query<Footer, FooterVariables>({
    query: FOOTER_QUERY,
    variables: { locale },
    fetchPolicy: 'no-cache',
  });

  if (result && result.error) {
    console.log('error in footer');
    console.error(result.error);
    return null;
  }

  return result?.data?.dataportal_v1_Digg_Footer;
};

const getSettings = async (client: ApolloClient<NormalizedCacheObject>, locale: string) => {
  const result = await client.query<Settings, SettingsVariables>({
    query: SETTINGS_QUERY,
    variables: { locale },
    fetchPolicy: 'no-cache',
  });

  if (result && result.error) {
    console.log('error in settings');
    console.error(result.error);
    return undefined;
  }

  return result?.data?.dataportal_v1_Digg_Settings;
};

export const getSharedProps = async (
  client: ApolloClient<NormalizedCacheObject>,
  locale: string
) => {
  return {
    menu: await getMenu(client, locale),
    footer: await getFooter(client, locale),
    settings: await getSettings(client, locale)    
  };
};
