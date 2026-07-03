import type { EnvSettings } from "@/env";

/**
 * Statistic data access. All EntryStore/admin stat endpoints are fetched here
 * (server-side, cached) so the components under `components/statistic` can stay
 * purely presentational. Every fetch fails soft: on error we log and return
 * empty/zero data so the UI degrades gracefully instead of throwing.
 */

export interface StatisticNumbers {
  datasetCount: number;
  publisherCount: number;
  concepts: number;
  terminologies: number;
  specifications: number;
}

export interface StatisticTopList {
  labels: string[];
  series: number[];
  values: string[];
}

export interface StatisticHistoryPoint {
  x: string;
  y: number;
}

const REVALIDATE_SECONDS = 3600;

const orgStatsUrl = (env: EnvSettings) =>
  env.ENTRYSCAPE_ORG_STATS_URL ||
  "https://admin.dataportal.se/charts/orgData.json";

const conceptStatsUrl = (env: EnvSettings) =>
  env.ENTRYSCAPE_CONCEPT_STATS_URL ||
  "https://editera.dataportal.se/stats/entityData.json";

const themeStatsUrl = (env: EnvSettings, lang: string) =>
  lang !== "sv" && env.ENTRYSCAPE_THEME_STATS_URL_EN
    ? env.ENTRYSCAPE_THEME_STATS_URL_EN
    : env.ENTRYSCAPE_THEME_STATS_URL ||
      "https://admin.dataportal.se/charts/themeData.json";

const historyStatsUrl = (env: EnvSettings) =>
  env.ENTRYSCAPE_HISTORY_STATS_URL ||
  "https://admin.dataportal.se/stats/historyData.json";

interface OrgDataResponse {
  publisherCount?: number;
  datasetCount?: number;
  series?: number[][];
  labels?: string[];
  values?: string[];
}

interface ConceptDataResponse {
  concepts?: number;
  terminologies?: number;
  specifications?: number;
}

interface ThemeDataResponse {
  labels?: string[];
  series?: number[];
  values?: string[];
}

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error({
        url,
        status: response.status,
        text: response.statusText,
      });
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error({ url, error });
    return null;
  }
};

export const getStatisticNumbers = async (
  env: EnvSettings,
): Promise<StatisticNumbers> => {
  const [org, concept] = await Promise.all([
    fetchJson<OrgDataResponse>(orgStatsUrl(env)),
    fetchJson<ConceptDataResponse>(conceptStatsUrl(env)),
  ]);

  return {
    datasetCount: org?.datasetCount ?? 0,
    publisherCount: org?.publisherCount ?? 0,
    concepts: concept?.concepts ?? 0,
    terminologies: concept?.terminologies ?? 0,
    specifications: concept?.specifications ?? 0,
  };
};

export const getTopOrganisations = async (
  env: EnvSettings,
): Promise<StatisticTopList> => {
  const org = await fetchJson<OrgDataResponse>(orgStatsUrl(env));

  return {
    labels: org?.labels ?? [],
    series: org?.series?.[0] ?? [],
    values: org?.values ?? [],
  };
};

export const getTopCategories = async (
  env: EnvSettings,
  lang: string,
): Promise<StatisticTopList> => {
  const theme = await fetchJson<ThemeDataResponse>(themeStatsUrl(env, lang));
  const labels = theme?.labels ?? [];
  const series = theme?.series ?? [];
  const values = theme?.values ?? [];

  const sorted = labels
    .map((label, index) => ({
      label,
      serie: series[index] ?? 0,
      value: values[index] ?? "",
    }))
    .sort((a, b) => b.serie - a.serie);

  return {
    labels: sorted.map((item) => item.label),
    series: sorted.map((item) => item.serie),
    values: sorted.map((item) => item.value),
  };
};

export const getStatisticHistory = async (
  env: EnvSettings,
): Promise<StatisticHistoryPoint[]> => {
  const data = await fetchJson<StatisticHistoryPoint[]>(historyStatsUrl(env));
  if (!Array.isArray(data)) return [];

  return data.map((point) => ({ x: String(point.x), y: point.y }));
};
