import { generateRandomKey } from "../utilities";
import { EnvSettings } from "./EnvSettings";

export class Settings_Test extends EnvSettings {
  ENTRYSCAPE_DATASETS_PATH = "admin.dataportal.se";
  ENTRYSCAPE_SPECS_PATH = "editera.dataportal.se";
  ENTRYSCAPE_TERMS_PATH = "editera.dataportal.se";
  ENTRYSCAPE_MQA_PATH = "admin.dataportal.se";

  ENTRYSCAPE_ORG_STATS_URL = "https://admin.dataportal.se/charts/orgData.json";
  ENTRYSCAPE_THEME_STATS_URL =
    "https://admin.dataportal.se/charts/themeData.json";
  ENTRYSCAPE_THEME_STATS_URL_EN =
    "https://admin.dataportal.se/charts/themeData_en.json";

  ENTRYSCAPE_CONCEPT_STATS_URL =
    "https://editera.dataportal.se/stats/entityData.json";
  ENTRYSCAPE_HISTORY_STATS_URL =
    "https://admin.dataportal.se/stats/historyData.json";

  ENTRYSCAPE_BLOCKS_URL =
    "https://static.cdn.entryscape.com/blocks/0.20/app.js";

  ENTRYSCAPE_MQA_URL =
    "https://static.cdn.entryscape.com/blocks-ext/1/opendata/mqa-sv.js";

  ENTRYSCAPE_OPENDATA_SV_URL =
    "https://static.entryscape.com/blocks/0.20/ext/opendata-sv.js";
  ENTRYSCAPE_OPENDATA_EN_URL =
    "https://static.entryscape.com/blocks/0.20/ext/opendata-en.js";

  ENTRYSCAPE_SITEMAP_JSON_URL = "https://admin.dataportal.se/sitemap.json";

  API_DETECTION_PATH = "https://admin.dataportal.se/detectedapis.json";

  CANONICAL_URL = "http://dataportal.test.local";

  DCAT_BUNDLE_PATH =
    "https://static.infra.entryscape.com/blocks-ext/1/opendata/dcat-ap_se2.json";

  envName = "test";

  nonce = generateRandomKey(256);

  public constructor() {
    super();
  }
}
