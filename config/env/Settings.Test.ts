import { EnvSettings } from "./EnvSettings";

export class Settings_Test extends EnvSettings {
  ENTRYSCAPE_DATASETS_PATH="admin.dataportal.se"
  ENTRYSCAPE_SPECS_PATH="editera.dataportal.se"
  ENTRYSCAPE_TERMS_PATH="editera.dataportal.se"
  ENTRYSCAPE_ORG_STATS_URL="https://admin.dataportal.se/charts/orgData.json"
  ENTRYSCAPE_THEME_STATS_URL="https://admin.dataportal.se/charts/themeData.json"
  ENTRYSCAPE_THEME_STATS_URL_EN="https://admin.dataportal.se/charts/themeData_en.json"

  ENTRYSCAPE_CONCEPT_STATS_URL="https://editera.dataportal.se/stats/entityData.json"
  ENTRYSCAPE_HISTORY_STATS_URL="https://admin.dataportal.se/stats/historyData.json"

  ENTRYSCAPE_BLOCKS_URL="https://static.cdn.entryscape.com/blocks/0.20/app.js"

  ENTRYSCAPE_OPENDATA_SV_URL="https://dataportal.azureedge.net/cdn/ext-opendata-sv-0.6.js"
  ENTRYSCAPE_OPENDATA_EN_URL="https://dataportal.azureedge.net/cdn/ext-opendata-en-0.6.js"

  ENTRYSCAPE_SITEMAP_JSON_URL="https://admin.dataportal.se/sitemap.json";

  CONTENTBACKEND_SITEURL="*test.dataportal.se";

  CONTENTBACKEND_GRAPHAPI="https://digg-test-graphproxy.azurewebsites.net";

  CANONICAL_URL = "https://digg-test-dataportal.azurewebsites.net";

  MATOMO_SITEID = 5;

  envName = 'test';

  public constructor()
  {
    super();    
  }
}