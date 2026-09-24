export abstract class EnvSettings {
  abstract PRODUCTION_BASE_URL: string;
  abstract SANDBOX_BASE_URL: string;

  abstract ENTRYSCAPE_ADMIN_PATH: string;

  abstract ENTRYSCAPE_ORG_STATS_URL: string;
  abstract ENTRYSCAPE_THEME_STATS_URL: string;
  abstract ENTRYSCAPE_THEME_STATS_URL_EN: string;

  abstract ENTRYSCAPE_CONCEPT_STATS_URL: string;
  abstract ENTRYSCAPE_HISTORY_STATS_URL: string;

  abstract ENTRYSCAPE_SITEMAP_JSON_URL: string;

  abstract ENTRYSCAPE_BLOCKS_URL: string;

  abstract ENTRYSCAPE_MQA_URL: string;

  abstract ENTRYSCAPE_OPENDATA_URL: string;

  abstract API_DETECTION_PATH: string;

  abstract CANONICAL_URL: string;

  abstract envName: string;

  abstract DCAT_BUNDLE_PATH: string;

  abstract nonce: string;
}
