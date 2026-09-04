import { generateRandomKey } from "../utilities";
import { EnvSettings } from "./env-settings";

export class Settings_Sandbox extends EnvSettings {
  PRODUCTION_BASE_URL = "https://dataportal.se";
  SANDBOX_BASE_URL = "https://www-sandbox.dataportal.se";

  ENTRYSCAPE_ADMIN_PATH = "sandbox.admin.dataportal.se";

  ENTRYSCAPE_ORG_STATS_URL =
    "https://sandbox.admin.dataportal.se/charts/orgData.json";
  ENTRYSCAPE_THEME_STATS_URL =
    "https://sandbox.admin.dataportal.se/charts/themeData.json";
  ENTRYSCAPE_THEME_STATS_URL_EN =
    "https://sandbox.admin.dataportal.se/charts/themeData_en.json";

  ENTRYSCAPE_CONCEPT_STATS_URL =
    "https://sandbox.editera.dataportal.se/stats/entityData.json";
  ENTRYSCAPE_HISTORY_STATS_URL =
    "https://sandbox.admin.dataportal.se/stats/historyData.json";

  ENTRYSCAPE_BLOCKS_URL =
    "https://static.cdn.entryscape.com/blocks/0.20/app.js";

  ENTRYSCAPE_MQA_URL =
    "https://static.entryscape.com/blocks-ext/1/opendata/mqa-SE.js";

  ENTRYSCAPE_OPENDATA_URL =
    "https://static.entryscape.com/blocks-ext/1/opendata/opendata-SE.js";

  ENTRYSCAPE_RDFORMS_SPEC_URL =
    "https://static.entryscape.com/rdforms/specs/1/specs.js";

  ENTRYSCAPE_SITEMAP_JSON_URL =
    "https://sandbox.admin.dataportal.se/sitemap.json";

  API_DETECTION_PATH = "https://sandbox.admin.dataportal.se/detectedapis.json";

  CANONICAL_URL = "https://www-sandbox.dataportal.se";

  DCAT_BUNDLE_PATH =
    "https://static.infra.entryscape.com/blocks-ext/1/opendata/dcat-ap_se2.json";

  envName = "sandbox";

  nonce = generateRandomKey(256);
}
