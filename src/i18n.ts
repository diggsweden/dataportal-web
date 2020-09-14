import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resources_sv from '../src/translations/sv/resources.json';
import pages_sv from '../src/translations/sv/pages.json';
import resources_en from '../src/translations/en/resources.json';
import pages_en from '../src/translations/en/pages.json';
import routes_sv from '../src/translations/sv/routes.json';
import routes_en from '../src/translations/en/routes.json';
import common_sv from '../src/translations/sv/common.json';
import common_en from '../src/translations/en/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    detection:({
      order:['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    }),    
    resources: {
      sv: {
        resource:resources_sv,
        pages:pages_sv,
        routes: routes_sv,
        common: common_sv
      },
      en: {
        resource:resources_en,
        pages:pages_en,
        routes: routes_en,
        common: common_en
      }
    },
    load: 'languageOnly',
    whitelist:['sv','en'],    
    fallbackLng: {
      'sv-SE':['se'],
      'en-US':['en'],
      'default':['sv']
    },        
    debug: false,    
    keySeparator: '>',
    nsSeparator: '|',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;