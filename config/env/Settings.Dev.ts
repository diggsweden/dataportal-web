import { EnvSettings } from "./EnvSettings";

export class Settings_Dev extends EnvSettings {
  ENTRYSCAPE_DATASETS_PATH="admin.dataportal.se"
  // ENTRYSCAPE_DATASETS_PATH="sandbox.admin.dataportal.se"

  ENTRYSCAPE_SPECS_PATH="editera.dataportal.se"
  ENTRYSCAPE_TERMS_PATH="editera.dataportal.se"
  ENTRYSCAPE_ORG_STATS_URL="https://admin.dataportal.se/charts/orgData.json"
  ENTRYSCAPE_THEME_STATS_URL="https://admin.dataportal.se/charts/themeData.json"
  ENTRYSCAPE_THEME_STATS_URL_EN="https://admin.dataportal.se/charts/themeData_en.json"
  
  ENTRYSCAPE_CONCEPT_STATS_URL="https://editera.dataportal.se/stats/entityData.json"
  ENTRYSCAPE_HISTORY_STATS_URL="https://admin.dataportal.se/stats/historyData.json"  
  
  ENTRYSCAPE_BLOCKS_URL="https://static.cdn.entryscape.com/blocks/0.20/app.js"

  ENTRYSCAPE_OPENDATA_SV_URL="https://static.entryscape.com/blocks/0.20/ext/opendata-sv.js"
  ENTRYSCAPE_OPENDATA_EN_URL="https://static.entryscape.com/blocks/0.20/ext/opendata-en.js"

  ENTRYSCAPE_SITEMAP_JSON_URL="https://admin.dataportal.se/sitemap.json";

  API_DETECTION_PATH = "https://admin.dataportal.se/detectedapis.json";
  //API_DETECTION_PATH = "/apiDetections.json";

  CONTENTBACKEND_SITEURL="*dataportal*";


  //CONTENTBACKEND_GRAPHAPI="https://digg-prod-graphproxy.azurewebsites.net";
  CONTENTBACKEND_GRAPHAPI="https://digg-test-graphproxy.azurewebsites.net";
  //CONTENTBACKEND_GRAPHAPI="http://localhost:4444";

  CANONICAL_URL = "http://localhost:8080";

  DCAT_BUNDLE_PATH = "/dcatse_bundle_2022-02-20.json";

  MATOMO_SITEID = 6;

  envName = 'dev';

  public constructor()
  {
    super();    
  }
}