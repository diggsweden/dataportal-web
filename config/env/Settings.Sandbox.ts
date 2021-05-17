import { EnvSettings } from "./EnvSettings";

export class Settings_Sandbox extends EnvSettings {
  ENTRYSCAPE_DATASETS_PATH="sandbox.admin.dataportal.se"
  ENTRYSCAPE_SPECS_PATH="editera.dataportal.se"
  ENTRYSCAPE_TERMS_PATH="editera.dataportal.se"
  ENTRYSCAPE_ORG_STATS_URL="https://sandbox.admin.dataportal.se/charts/orgData.json"
  ENTRYSCAPE_THEME_STATS_URL="https://sandbox.admin.dataportal.se/charts/themeData.json"
  ENTRYSCAPE_THEME_STATS_URL_EN="https://sandbox.admin.dataportal.se/charts/themeData_en.json"

  ENTRYSCAPE_CONCEPT_STATS_URL="https://editera.dataportal.se/stats/entityData.json"
  ENTRYSCAPE_HISTORY_STATS_URL="https://sandbox.admin.dataportal.se/stats/historyData.json"

  ENTRYSCAPE_BLOCKS_URL="https://static.cdn.entryscape.com/blocks/0.20/app.js"

  ENTRYSCAPE_OPENDATA_SV_URL="https://static.entryscape.com/blocks/0.20/ext/opendata-sv.js"
  ENTRYSCAPE_OPENDATA_EN_URL="https://static.entryscape.com/blocks/0.20/ext/opendata-en.js"

  ENTRYSCAPE_SITEMAP_JSON_URL="https://sandbox.admin.dataportal.se/sitemap.json";

  CONTENTBACKEND_SITEURL="*.test.dataportal.*";

  CONTENTBACKEND_GRAPHAPI="https://digg-prod-graphproxy.azurewebsites.net";

  CANONICAL_URL = "https://www-sandbox.dataportal.se";

  MATOMO_SITEID = -1;

  envName = 'sandbox';

  public constructor()
  {
    super();    
  }
}