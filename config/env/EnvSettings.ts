export abstract class EnvSettings {
  abstract ENTRYSCAPE_DATASETS_PATH:string;
  abstract ENTRYSCAPE_SPECS_PATH:string;
  abstract ENTRYSCAPE_TERMS_PATH:string;
  abstract ENTRYSCAPE_ORG_STATS_URL:string;
  abstract ENTRYSCAPE_THEME_STATS_URL:string;
  abstract ENTRYSCAPE_THEME_STATS_URL_EN:string;

  abstract ENTRYSCAPE_CONCEPT_STATS_URL:string;
  abstract ENTRYSCAPE_HISTORY_STATS_URL:string;

  abstract ENTRYSCAPE_SITEMAP_JSON_URL:string;
  
  abstract ENTRYSCAPE_BLOCKS_URL:string;  

  abstract ENTRYSCAPE_OPENDATA_SV_URL:string;  

  abstract ENTRYSCAPE_OPENDATA_EN_URL:string;  

  abstract CONTENTBACKEND_SITEURL: string;

  abstract CONTENTBACKEND_GRAPHAPI: string;

  abstract CANONICAL_URL: string;

  abstract MATOMO_SITEID: number;

  abstract envName: string;
}